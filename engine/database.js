/**
 * RxDB Database Configuration
 * Context Engine v2 - Storage Layer
 *
 * Sets up RxDB with IndexedDB backend and Vector plugin for semantic search
 */

import { createRxDatabase, addRxPlugin } from '../node_modules/rxdb/dist/esm/index.js';
import { getRxStorageDexie } from '../node_modules/rxdb/dist/esm/plugins/storage-dexie/index.js';
import { RxDBQueryBuilderPlugin } from '../node_modules/rxdb/dist/esm/plugins/query-builder/index.js';
import { RxDBUpdatePlugin } from '../node_modules/rxdb/dist/esm/plugins/update/index.js';
import { RxDBMigrationSchemaPlugin } from '../node_modules/rxdb/dist/esm/plugins/migration-schema/index.js';

// Add plugins
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);

// Note: Dev-mode plugin disabled for Chrome Extension (CSP blocks AJV validator)

/**
 * Gem Schema for RxDB
 * Enhanced with semantic metadata, vector embeddings, AND HSP fields
 * This is now the single source of truth for preference data
 */
const gemSchema = {
  version: 2,  // UPDATED: v1 -> v2 for HSP fields (state, assurance, reliability, source_url, mergedFrom, created_at, updated_at)
  primaryKey: 'id',
  type: 'object',
  properties: {
    // CORE FIELDS
    id: {
      type: 'string',
      maxLength: 100
    },
    value: {
      type: 'string',
      maxLength: 10000
    },
    collections: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    subCollections: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    timestamp: {
      type: 'number',
      minimum: 0,
      multipleOf: 1  // Required for indexed number fields
    },

    // HSP PROTOCOL FIELDS
    state: {
      type: 'string',
      enum: ['default', 'favorited', 'hidden'],
      default: 'default'
    },
    assurance: {
      type: 'string',
      enum: ['self_declared', 'third_party', 'derived'],
      default: 'self_declared'
    },
    reliability: {
      type: 'string',
      enum: ['authoritative', 'high', 'medium', 'low'],
      default: 'authoritative'
    },
    source_url: {
      type: 'string',
      maxLength: 2000
    },
    mergedFrom: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    created_at: {
      type: 'string',
      format: 'date-time'
    },
    updated_at: {
      type: 'string',
      format: 'date-time'
    },

    // Topic/Sub-Topic Hierarchy
    topic: {
      type: 'string',
      maxLength: 500
    },
    subTopic: {
      type: 'string',
      maxLength: 500
    },

    // Semantic Metadata (AI Enrichment)
    semanticType: {
      type: 'string',
      enum: ['constraint', 'preference', 'activity', 'characteristic', 'goal']
    },
    attribute: {
      type: 'string',
      maxLength: 200
    },
    attributeValue: {
      type: 'string',
      maxLength: 500
    },
    attributeUnit: {
      type: 'string',
      maxLength: 50
    },

    // Vector Embeddings (384-dim from Gemini Nano)
    vector: {
      type: 'array',
      items: {
        type: 'number'
      },
      minItems: 384,
      maxItems: 384
    },

    // Keywords for BM25 sparse search
    keywords: {
      type: 'object',
      additionalProperties: {
        type: 'number'  // word: frequency
      }
    },

    // Quality Metadata
    enrichmentVersion: {
      type: 'string',
      maxLength: 20
    },
    enrichmentTimestamp: {
      type: 'number',
      minimum: 0,
      multipleOf: 1  // Required for indexed number fields
    },
    userVerified: {
      type: 'boolean'
    },

    // Primary/Child Gem Relationship
    isPrimary: {
      type: 'boolean'
    },
    parentGem: {
      type: 'string',
      maxLength: 100
    },
    childGems: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    isVirtual: {
      type: 'boolean'
    }
  },
  required: [
    'id',
    'value',
    'timestamp',
    'collections',
    'subCollections',
    'state',
    'assurance',
    'reliability',
    'created_at',
    'updated_at',
    'isPrimary',
    'parentGem'
  ],
  indexes: [
    'timestamp',
    'state',  // NEW: Index for filtering by state
    ['collections'],  // Multi-entry index for array
    ['subCollections'],
    'isPrimary',  // Index for filtering primary vs child gems
    'parentGem',   // Index for finding children of a parent
    'created_at'  // NEW: Index for sorting by creation date
  ]
};

/**
 * Database instance (singleton)
 */
let dbInstance = null;
let initPromise = null;  // Prevent race conditions

/**
 * Initialize RxDB database
 * @returns {Promise<RxDatabase>}
 */
export async function initDatabase() {
  if (dbInstance) {
    console.log('[Database] Using existing database instance');
    return dbInstance;
  }

  // If already initializing, return the same promise
  if (initPromise) {
    console.log('[Database] Initialization already in progress, waiting...');
    return initPromise;
  }

  console.log('[Database] Initializing RxDB with IndexedDB backend...');

  // Store the initialization promise
  initPromise = (async () => {

  try {
    // Create database
    const db = await createRxDatabase({
      name: 'rxdb-datagems-context',
      storage: getRxStorageDexie(),
      multiInstance: true,  // Allow multiple instances (Popup reopens each time)
      eventReduce: true  // Share events between instances
    });

    console.log('[Database] RxDB created successfully');

    // Add gems collection
    await db.addCollections({
      gems: {
        schema: gemSchema,
        migrationStrategies: {
          // Migration from v0 to v1: Add new required fields with defaults
          1: function(oldDoc) {
            console.log('[Database] Migrating gem from v0 to v1:', oldDoc.id);
            return {
              ...oldDoc,
              // Set defaults for new required fields
              isPrimary: oldDoc.isPrimary !== undefined ? oldDoc.isPrimary : false,
              parentGem: oldDoc.parentGem || '',
              // Set defaults for new optional fields
              topic: oldDoc.topic || '',
              subTopic: oldDoc.subTopic || '',
              childGems: oldDoc.childGems || [],
              isVirtual: oldDoc.isVirtual !== undefined ? oldDoc.isVirtual : false
            };
          },
          // Migration from v1 to v2: Add HSP protocol fields
          2: function(oldDoc) {
            console.log('[Database] Migrating gem from v1 to v2 (adding HSP fields):', oldDoc.id);
            const now = new Date().toISOString();
            return {
              ...oldDoc,
              // HSP required fields with defaults
              state: oldDoc.state || 'default',
              assurance: oldDoc.assurance || 'self_declared',
              reliability: oldDoc.reliability || 'authoritative',
              created_at: oldDoc.created_at || oldDoc.timestamp ? new Date(oldDoc.timestamp).toISOString() : now,
              updated_at: oldDoc.updated_at || now,
              // Optional HSP fields
              source_url: oldDoc.source_url || undefined,
              mergedFrom: oldDoc.mergedFrom || undefined
            };
          }
        }
        // Note: Vector search plugin will be added separately
        // to avoid circular dependency issues
      }
    });

    console.log('[Database] Gems collection created');
    console.log('[Database] Schema version:', gemSchema.version);

    dbInstance = db;

    // Log database info
    console.log('[Database] Database ready:', {
      name: db.name,
      collections: Object.keys(db.collections),
      storage: 'Dexie (IndexedDB)'
    });

    return db;

  } catch (error) {
    console.error('[Database] Failed to initialize:', error);
    initPromise = null;  // Reset on error so retry is possible
    throw error;
  } finally {
    initPromise = null;  // Clear promise when done
  }
  })();

  return initPromise;
}

/**
 * Get database instance
 * @returns {RxDatabase|null}
 */
export function getDatabase() {
  return dbInstance;
}

/**
 * Close database connection
 * CRITICAL for allowing IndexedDB deletion without blocking
 */
export async function closeDatabase() {
  if (dbInstance) {
    console.log('[Database] Closing database...');
    await dbInstance.destroy();
    dbInstance = null;
    initPromise = null; // Reset init promise so database can be recreated
    console.log('[Database] Database closed and reset');
  }
}

/**
 * Get gems collection
 * @returns {RxCollection|null}
 */
export function getGemsCollection() {
  if (!dbInstance) {
    console.warn('[Database] Database not initialized');
    return null;
  }
  return dbInstance.gems;
}

/**
 * Database statistics
 * @returns {Promise<Object>}
 */
export async function getDatabaseStats() {
  const collection = getGemsCollection();
  if (!collection) {
    return null;
  }

  // Get all gems and count in-memory (avoid $exists operator which isn't supported)
  const allGems = await collection.find().exec();
  const count = allGems.length;
  const withVectors = allGems.filter(gem => gem.vector && gem.vector.length > 0).length;
  const withSemantics = allGems.filter(gem => gem.semanticType).length;

  return {
    totalGems: count,
    gemsWithVectors: withVectors,
    gemsWithSemantics: withSemantics,
    enrichmentRate: count > 0 ? (withSemantics / count * 100).toFixed(1) : 0
  };
}

/**
 * Migration helper (for future schema updates)
 * @param {number} toVersion
 */
export async function migrateSchema(toVersion) {
  // Placeholder for future schema migrations
  console.log(`[Database] Migration to v${toVersion} requested`);
  // Implementation will be added when schema version changes
}
