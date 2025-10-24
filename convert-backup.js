/**
 * Conversion Script: Personal Context Backup → HAS v0.1
 * Converts backup JSON to Data Gems HAS Protocol format
 */

const fs = require('fs');
const path = require('path');

// Read the backup file
const backupPath = '/Users/d.breuer/Downloads/personal-context-backup.json';
const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

// Helper functions
function generateId(prefix = 'id') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}${random}`;
}

function getTimestamp() {
  return new Date().toISOString();
}

// Create HAS v0.1 Profile
const hasProfile = {
  id: generateId('profile'),
  has: '0.1',
  type: 'profile',
  created_at: backup.exportedAt || getTimestamp(),
  updated_at: getTimestamp(),

  content: {
    basic: {
      identity: {
        name: {
          value: 'Dennis',
          assurance: 'self_declared',
          reliability: 'high',
          updated_at: getTimestamp()
        },
        subtitle: {
          value: 'Founder',
          assurance: 'self_declared',
          reliability: 'high',
          updated_at: getTimestamp()
        },
        email: {
          value: '',
          assurance: 'self_declared',
          reliability: 'high',
          updated_at: getTimestamp()
        },
        age: {
          value: null,
          assurance: 'self_declared',
          reliability: 'medium',
          updated_at: getTimestamp()
        },
        gender: {
          value: null,
          assurance: 'self_declared',
          reliability: 'high',
          updated_at: getTimestamp()
        },
        location: {
          value: '',
          assurance: 'self_declared',
          reliability: 'high',
          updated_at: getTimestamp()
        },
        description: {
          value: backup.personalDescription || '',
          assurance: 'self_declared',
          reliability: 'authoritative',
          updated_at: getTimestamp()
        },
        languages: {
          value: [],
          assurance: 'self_declared',
          reliability: 'high',
          updated_at: getTimestamp()
        }
      }
    },
    preferences: {
      items: []
    }
  },

  collections: [
    {
      id: generateId('col'),
      name: 'favorites',
      label: 'Favorites',
      created_at: getTimestamp()
    }
  ],

  settings: {
    ui: {
      theme: 'light',
      compact_mode: false
    },
    privacy: {
      store_locally_only: true,
      auto_clear_after_days: null
    }
  },

  metadata: {
    schema_version: '0.1',
    extension_version: '2.0.0',
    total_preferences: 0,
    last_backup: null
  }
};

// Collect all unique categories
const categoriesSet = new Set();
backup.contextItems.forEach(item => {
  if (item.category) {
    categoriesSet.add(item.category);
  }
});

// Register all categories as collections
categoriesSet.forEach(category => {
  hasProfile.collections.push({
    id: generateId('col'),
    name: category.toLowerCase().replace(/\s+/g, '_').replace(/&/g, 'and'),
    label: category,
    created_at: getTimestamp()
  });
});

// Convert context items to preferences
backup.contextItems.forEach(item => {
  // Format as Q&A text
  const value = `${item.question}\n\n${item.answer}`;

  // Get collection label
  const collections = item.category ? [item.category] : [];

  // Create preference
  const preference = {
    id: generateId('pref'),
    value: value,
    assurance: 'self_declared',
    reliability: 'authoritative',
    state: 'default',
    collections: collections,
    created_at: item.createdAt || backup.exportedAt || getTimestamp(),
    updated_at: item.updatedAt || backup.exportedAt || getTimestamp()
  };

  hasProfile.content.preferences.items.push(preference);
});

// Update total preferences count
hasProfile.metadata.total_preferences = hasProfile.content.preferences.items.length;

// Write output
const outputPath = '/Users/d.breuer/Desktop/data-gems-has-profile-converted.json';
fs.writeFileSync(outputPath, JSON.stringify(hasProfile, null, 2), 'utf8');

console.log(`✅ Conversion complete!`);
console.log(`📊 Converted ${hasProfile.content.preferences.items.length} context items to preferences`);
console.log(`🏷️  Created ${hasProfile.collections.length} collections`);
console.log(`💾 Output: ${outputPath}`);
