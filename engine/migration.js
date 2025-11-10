/**
 * Migration Helper
 * Context Engine v2 - chrome.storage → RxDB Migration
 *
 * Migrates existing Data Gems from chrome.storage.local to RxDB
 * with auto-enrichment (embeddings + keywords)
 */

import { getContextEngine } from './context-engine.js';

/**
 * Convert HSP Profile item to Context Engine v2 format
 * @param {Object} item - HSP profile preference item
 * @returns {Object} Context Engine v2 gem
 */
function convertHSPItemToGem(item) {
  // Base structure (already compatible!)
  const gem = {
    id: item.id,
    value: item.value,
    collections: item.collections || [],
    subCollections: item.subCollections || [],
    timestamp: new Date(item.created_at || Date.now()).getTime()
  };

  // Add semantic metadata if exists
  if (item.semanticType) {
    gem.semanticType = item.semanticType;
  }

  if (item.attribute) {
    gem.attribute = item.attribute;
  }

  if (item.attributeValue) {
    gem.attributeValue = item.attributeValue;
  }

  if (item.attributeUnit) {
    gem.attributeUnit = item.attributeUnit;
  }

  // Add quality metadata
  if (item.userVerified) {
    gem.userVerified = item.userVerified;
  }

  // Note: vector and keywords will be added by auto-enrichment

  return gem;
}

/**
 * Migrate data from chrome.storage.local to Context Engine v2
 * @param {Object} options - Migration options
 * @param {boolean} options.autoEnrich - Auto-enrich gems (default: true)
 * @param {boolean} options.clearOldData - Clear chrome.storage after migration (default: false)
 * @param {Function} options.onProgress - Progress callback (current, total)
 * @returns {Promise<Object>} Migration results
 */
export async function migrateToContextEngine({
  autoEnrich = true,
  clearOldData = false,
  onProgress = null
} = {}) {
  console.log('[Migration] Starting migration to Context Engine v2...');

  try {
    // 1. Load data from chrome.storage.local
    console.log('[Migration] Loading data from chrome.storage...');
    const result = await chrome.storage.local.get(['hspProfile']);

    if (!result.hspProfile) {
      console.warn('[Migration] No hspProfile found in chrome.storage');
      return {
        success: false,
        error: 'No data to migrate',
        migrated: 0
      };
    }

    const hspProfile = result.hspProfile;
    const items = hspProfile?.content?.preferences?.items || [];

    if (items.length === 0) {
      console.warn('[Migration] No preference items found');
      return {
        success: false,
        error: 'No preference items to migrate',
        migrated: 0
      };
    }

    console.log(`[Migration] Found ${items.length} items to migrate`);

    // 2. Convert to Context Engine v2 format
    console.log('[Migration] Converting to Context Engine v2 format...');
    const gems = items.map(item => convertHSPItemToGem(item));

    console.log(`[Migration] Converted ${gems.length} gems`);

    // 3. Initialize Context Engine
    console.log('[Migration] Initializing Context Engine v2...');
    const engine = await getContextEngine();

    // 4. Bulk import with auto-enrichment
    console.log(`[Migration] Importing ${gems.length} gems (autoEnrich: ${autoEnrich})...`);

    const importResults = await engine.bulkImport(
      gems,
      autoEnrich,
      (current, total) => {
        console.log(`[Migration] Progress: ${current}/${total} gems enriched`);
        if (onProgress) {
          onProgress(current, total);
        }
      }
    );

    console.log('[Migration] Import results:', importResults);

    // 5. Clear old data if requested
    if (clearOldData) {
      console.log('[Migration] Clearing old chrome.storage data...');
      await chrome.storage.local.remove(['hspProfile', 'preferences', 'userData']);
      console.log('[Migration] Old data cleared');
    }

    // 6. Get final stats
    const stats = await engine.getStats();

    const results = {
      success: true,
      migrated: importResults.success.length,
      errors: importResults.error.length,
      stats: stats.database,
      clearedOldData: clearOldData
    };

    console.log('[Migration] Migration complete:', results);

    return results;

  } catch (error) {
    console.error('[Migration] Migration failed:', error);
    return {
      success: false,
      error: error.message,
      migrated: 0
    };
  }
}

/**
 * Check if migration is needed
 * @returns {Promise<Object>} Migration status
 */
export async function checkMigrationStatus() {
  try {
    // Check if old data exists
    const oldData = await chrome.storage.local.get(['hspProfile', 'preferences']);
    const hasOldData = !!(oldData.hspProfile || oldData.preferences);

    // Check if new data exists
    const engine = await getContextEngine();
    const stats = await engine.getStats();
    const hasNewData = stats.database.totalGems > 0;

    return {
      needsMigration: hasOldData && !hasNewData,
      hasOldData,
      hasNewData,
      oldItemCount: oldData.hspProfile?.content?.preferences?.items?.length || 0,
      newItemCount: stats.database.totalGems
    };
  } catch (error) {
    console.error('[Migration] Failed to check migration status:', error);
    return {
      needsMigration: false,
      hasOldData: false,
      hasNewData: false,
      error: error.message
    };
  }
}

/**
 * Incremental sync: Add new gems from chrome.storage to RxDB
 * Useful if both systems run in parallel during transition
 * @returns {Promise<Object>} Sync results
 */
export async function syncNewGemsToRxDB() {
  console.log('[Migration] Syncing new gems to RxDB...');

  try {
    // Get all gems from chrome.storage
    const result = await chrome.storage.local.get(['hspProfile']);
    const items = result.hspProfile?.content?.preferences?.items || [];

    if (items.length === 0) {
      return {
        success: true,
        synced: 0,
        skipped: 0
      };
    }

    // Get Context Engine
    const engine = await getContextEngine();

    // Check which gems already exist in RxDB
    const existingIds = new Set();
    const allGems = await engine.getAllGems();
    allGems.forEach(gem => existingIds.add(gem.id));

    // Find new gems
    const newItems = items.filter(item => !existingIds.has(item.id));

    if (newItems.length === 0) {
      console.log('[Migration] No new gems to sync');
      return {
        success: true,
        synced: 0,
        skipped: items.length
      };
    }

    console.log(`[Migration] Found ${newItems.length} new gems to sync`);

    // Convert and import new gems
    const newGems = newItems.map(item => convertHSPItemToGem(item));
    const importResults = await engine.bulkImport(newGems, true);

    const results = {
      success: true,
      synced: importResults.success.length,
      skipped: items.length - newItems.length,
      errors: importResults.error.length
    };

    console.log('[Migration] Sync complete:', results);

    return results;

  } catch (error) {
    console.error('[Migration] Sync failed:', error);
    return {
      success: false,
      error: error.message,
      synced: 0,
      skipped: 0
    };
  }
}

/**
 * Export RxDB gems back to chrome.storage format
 * Useful for backup or rollback
 * @returns {Promise<Object>} Export results
 */
export async function exportToChromeStor

age() {
  console.log('[Migration] Exporting RxDB gems to chrome.storage format...');

  try {
    const engine = await getContextEngine();
    const gems = await engine.getAllGems();

    // Convert gems to HSP format
    const items = gems.map(gem => ({
      id: gem.id,
      value: gem.value,
      collections: gem.collections || [],
      subCollections: gem.subCollections || [],
      semanticType: gem.semanticType,
      attribute: gem.attribute,
      attributeValue: gem.attributeValue,
      attributeUnit: gem.attributeUnit,
      userVerified: gem.userVerified || false,
      state: 'default',  // Default state
      created_at: new Date(gem.timestamp).toISOString(),
      updated_at: new Date(gem.timestamp).toISOString()
    }));

    // Create HSP profile structure
    const hspProfile = {
      content: {
        preferences: {
          items
        }
      },
      updated_at: new Date().toISOString()
    };

    // Save to chrome.storage
    await chrome.storage.local.set({ hspProfile });

    console.log(`[Migration] Exported ${items.length} gems to chrome.storage`);

    return {
      success: true,
      exported: items.length
    };

  } catch (error) {
    console.error('[Migration] Export failed:', error);
    return {
      success: false,
      error: error.message,
      exported: 0
    };
  }
}
