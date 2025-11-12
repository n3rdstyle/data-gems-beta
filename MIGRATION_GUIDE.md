# Migration Guide: Chrome Storage → RxDB

## Overview

This migration moves your preference data from Chrome Storage to RxDB (Context Engine), making RxDB the single source of truth for all preference data. This solves the issue of missing child gems in exports and enables better AI enrichment.

## Architecture Changes

### Before Migration:
- **Chrome Storage**: Stored all profile + preferences data (HSP format)
- **RxDB**: Stored enriched gems with vectors (separate, not synced)
- **Problem**: Data duplication, missing child gems in exports

### After Migration:
- **Chrome Storage**: Profile identity only (name, email, age, etc.)
- **RxDB**: All preferences with full enrichment (child gems, vectors, semantic metadata)
- **Benefit**: Single source of truth, complete exports, better performance

## How to Migrate

### Step 1: Run the Migration Script

1. Open `chrome://extensions/`
2. Find "Data Gems" extension
3. Click **"service worker"** link
4. Copy-paste the contents of `migrate-to-rxdb.js` into the console
5. Press Enter and wait (~1-2 minutes for 100 preferences)

### Step 2: Verify Migration

1. Reload the extension popup
2. Check that all your preferences are still there
3. Test adding/editing/deleting a preference
4. Check browser console for `[App] Loading preferences from RxDB...` message

### Step 3: Test Export

1. Go to Settings → Backup Data
2. Export your profile
3. Open the JSON file
4. Verify that preferences now include ALL fields:
   - ✅ `state`, `assurance`, `reliability`
   - ✅ `created_at`, `updated_at`
   - ✅ `topic`, `source_url`, `mergedFrom`
   - ✅ `vector`, `semanticType`, `keywords` (if enriched)
   - ✅ `childGems` array (if you have child gems)

## What Changed

### Database Schema

The RxDB gem schema (v2) now includes ALL HSP fields:

```javascript
{
  // Core fields
  id, value, collections, subCollections, timestamp,

  // HSP Protocol fields
  state, assurance, reliability, source_url, mergedFrom,
  created_at, updated_at, topic,

  // AI Enrichment fields
  semanticType, attribute, vector, keywords,

  // Child gem relationships
  isPrimary, parentGem, childGems, isVirtual
}
```

### CRUD Operations

All preference operations now use RxDB:

| Operation | Before | After |
|-----------|--------|-------|
| **Add** | Chrome Storage only | RxDB + AppState cache |
| **Update** | Chrome Storage only | RxDB + AppState cache |
| **Delete** | Chrome Storage only | RxDB + AppState cache |
| **Load** | Chrome Storage only | RxDB → AppState cache |
| **Export** | Chrome Storage only | RxDB (includes child gems!) |

### AppState (Memory Cache)

`AppState.content.preferences.items` is now a **read-only cache** populated from RxDB:

- **On startup**: Loaded from RxDB
- **On add/update/delete**: Updated in both RxDB and cache
- **On render**: UI reads from cache (fast!)

## Rollback (if needed)

If something goes wrong, your data is safe:

1. **Chrome Storage backup**: Automatically saved to `chrome.storage.local.hspProfileBackup`
2. **Restore**: Set `migrationCompleted` to `false` in Chrome Storage
3. **Re-run app**: Will use Chrome Storage again

```javascript
// In service worker console:
chrome.storage.local.set({ migrationCompleted: false });
```

## Benefits

### 1. Complete Exports ✅
Exports now include:
- Child gems (primary + child relationships)
- Vector embeddings
- Semantic metadata
- All HSP fields

### 2. Better Performance ✅
- RxDB is optimized for large datasets
- Indexed queries for fast filtering
- Vector search capabilities

### 3. Single Source of Truth ✅
- No more data duplication
- No sync issues
- Simpler codebase

### 4. AI Enrichment Ready ✅
- Automatic embedding generation
- Child gem extraction
- Semantic type classification

## Troubleshooting

### Migration fails with "ContextEngineAPI not available"
- Make sure the extension is loaded
- Reload the service worker
- Try reloading the extension

### Preferences not showing after migration
- Check browser console for errors
- Verify `migrationCompleted: true` in Chrome Storage
- Check RxDB stats: `self.ContextEngineAPI.getStats()`

### Export still missing child gems
- Verify migration completed: Check console logs
- Run enrichment: `enrich-gems.js` (generates child gems)
- Check RxDB: Count child gems with `db.gems.find({selector: {isPrimary: false}}).exec()`

## Next Steps

After migration:

1. **Run AI Enrichment** (optional):
   ```javascript
   // Copy-paste enrich-gems.js into service worker console
   // This adds vector embeddings and child gems
   ```

2. **Test Thoroughly**:
   - Add new preferences
   - Edit existing ones
   - Delete preferences
   - Export and verify

3. **Monitor Performance**:
   - Check console logs
   - Verify no errors
   - Test with 100+ preferences

## Migration Status Check

Run this in the service worker console to check migration status:

```javascript
(async () => {
  const result = await chrome.storage.local.get(['migrationCompleted']);
  const stats = await self.ContextEngineAPI.getStats();

  console.log('Migration Status:', result.migrationCompleted ? '✅ COMPLETED' : '❌ NOT STARTED');
  console.log('RxDB Stats:', stats);
})();
```

## Support

If you encounter issues:

1. Check browser console for errors
2. Verify migration completed successfully
3. Check RxDB stats
4. Your data is safe in `hspProfileBackup`

---

**Migration Version**: 1.0
**Schema Version**: RxDB v2
**Date**: 2025-01-12
