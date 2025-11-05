/**
 * Console Script: Setup & Verify SubCategory Taxonomy
 *
 * Creates AND verifies SubCategory Registry in one go
 */

(async function setupAndVerifyTaxonomy() {
  console.log('=== Setting up & Verifying SubCategory Taxonomy ===\n');

  const taxonomy = [
    { "category": "Identity", "subcategories": ["Origin", "Language", "Demographics", "Background", "SelfImage", "Constraints"] },
    { "category": "Personality", "subcategories": ["Traits", "Strengths", "Weaknesses", "Behavior", "Motivation", "Constraints"] },
    { "category": "Mindset", "subcategories": ["Attitude", "Perspective", "Resilience", "Curiosity", "Growth", "Constraints"] },
    { "category": "Values", "subcategories": ["Ethics", "Priorities", "Beliefs", "Integrity", "Purpose", "Constraints"] },
    { "category": "Habits", "subcategories": ["Morning", "Evening", "Digital", "Health", "Productivity", "Constraints"] },
    { "category": "Health", "subcategories": ["Physical", "Mental", "Sleep", "Stress", "Energy", "Constraints"] },
    { "category": "Nutrition", "subcategories": ["Diet", "Preferences", "Restrictions", "Cooking", "EatingOut", "Constraints"] },
    { "category": "Fitness", "subcategories": ["Training", "Mobility", "Recovery", "Endurance", "Strength", "Constraints"] },
    { "category": "Sports", "subcategories": ["Running", "TeamSports", "Outdoor", "Water", "Adventure", "Constraints"] },
    { "category": "Recovery", "subcategories": ["Sleep", "Relaxation", "Mindfulness", "BodyCare", "Balance", "Constraints"] },
    { "category": "Work", "subcategories": ["Role", "Environment", "Collaboration", "Motivation", "Projects", "Constraints"] },
    { "category": "Career", "subcategories": ["Path", "Skills", "Goals", "Achievements", "Network", "Constraints"] },
    { "category": "Learning", "subcategories": ["Topics", "Style", "Courses", "Curiosity", "Knowledge", "Constraints"] },
    { "category": "Creativity", "subcategories": ["Ideas", "Inspiration", "Expression", "Making", "Aesthetics", "Constraints"] },
    { "category": "Productivity", "subcategories": ["Tools", "Focus", "Time", "Systems", "Flow", "Constraints"] },
    { "category": "Technology", "subcategories": ["Devices", "Software", "AI", "Automation", "Innovation", "Constraints"] },
    { "category": "Fashion", "subcategories": ["Style", "Brands", "Colors", "Accessories", "Trends", "Constraints"] },
    { "category": "Design", "subcategories": ["Visuals", "Interior", "UX", "Architecture", "Minimalism", "Constraints"] },
    { "category": "Music", "subcategories": ["Genres", "Artists", "Playlists", "Instruments", "Concerts", "Constraints"] },
    { "category": "Movies", "subcategories": ["Genres", "Directors", "Favorites", "Series", "Streaming", "Constraints"] },
    { "category": "Books", "subcategories": ["Genres", "Authors", "Favorites", "Learning", "Fiction", "Constraints"] },
    { "category": "Media", "subcategories": ["Podcasts", "News", "Social", "Magazines", "Influences", "Constraints"] },
    { "category": "Art", "subcategories": ["Visual", "Modern", "Photography", "Exhibitions", "Expression", "Constraints"] },
    { "category": "Travel", "subcategories": ["Destinations", "Culture", "Experiences", "Bucketlist", "Memories", "Constraints"] },
    { "category": "Home", "subcategories": ["Location", "Interior", "Comfort", "Rituals", "Atmosphere", "Constraints"] },
    { "category": "Living", "subcategories": ["Housing", "Neighborhood", "Lifestyle", "Energy", "Minimalism", "Constraints"] },
    { "category": "Nature", "subcategories": ["Outdoor", "Climate", "Plants", "Animals", "Connection", "Constraints"] },
    { "category": "Sustainability", "subcategories": ["Consumption", "Waste", "Energy", "Food", "Awareness", "Constraints"] },
    { "category": "Family", "subcategories": ["Partner", "Children", "Parents", "Traditions", "Support", "Constraints"] },
    { "category": "Friends", "subcategories": ["Circle", "Trust", "Activities", "Memories", "Loyalty", "Constraints"] },
    { "category": "Community", "subcategories": ["Local", "Online", "SharedValues", "Contribution", "Events", "Constraints"] },
    { "category": "Pets", "subcategories": ["Species", "Routine", "Care", "Behavior", "Bond", "Constraints"] },
    { "category": "Lifestyle", "subcategories": ["Routine", "Choices", "Attitude", "Balance", "Aesthetics", "Constraints"] },
    { "category": "Shopping", "subcategories": ["Preferences", "Habits", "Budget", "Online", "Discovery", "Constraints"] },
    { "category": "Brands", "subcategories": ["Favorites", "Trust", "Loyalty", "Image", "Experience", "Constraints"] },
    { "category": "Consumption", "subcategories": ["Products", "Media", "Food", "Fashion", "Tech", "Constraints"] },
    { "category": "Emotions", "subcategories": ["Mood", "Triggers", "Expression", "Regulation", "Empathy", "Constraints"] },
    { "category": "Goals", "subcategories": ["ShortTerm", "LongTerm", "Personal", "Professional", "Fitness", "Constraints"] },
    { "category": "Context", "subcategories": ["Situation", "Environment", "Device", "Activity", "Interaction", "Constraints"] },
    { "category": "Behavior", "subcategories": ["Online", "Social", "Purchase", "Learning", "Health", "Constraints"] },
    { "category": "Location", "subcategories": ["City", "Country", "Home", "Work", "Travel", "Constraints"] },
    { "category": "Time", "subcategories": ["Morning", "Afternoon", "Evening", "Weekend", "Season", "Constraints"] }
  ];

  try {
    // STEP 1: Load profile
    console.log('[1/4] Loading profile from chrome.storage...');
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      throw new Error('No profile found! Make sure you have data in the extension.');
    }

    const profile = data.hspProfile;
    console.log('✓ Profile loaded\n');

    // STEP 2: Create SubCategory Registry
    console.log('[2/4] Creating SubCategory Registry...');

    const registry = {};
    let subCategoryCount = 0;

    taxonomy.forEach(item => {
      const category = item.category;
      const subcategories = item.subcategories;

      subcategories.forEach(subCat => {
        // Create SubCategory key: category_subcategory (lowercase)
        const subCatKey = `${category.toLowerCase()}_${subCat.toLowerCase()}`;

        registry[subCatKey] = {
          parent: category,
          displayName: subCat,
          gemCount: 0,
          created_at: new Date().toISOString()
        };

        subCategoryCount++;
      });
    });

    console.log(`✓ Created ${subCategoryCount} SubCategories for ${taxonomy.length} categories\n`);

    // STEP 3: Assign to profile
    console.log('[3/4] Assigning registry to profile...');
    profile.subCategoryRegistry = registry;
    console.log('✓ Registry assigned\n');

    // STEP 4: Save to chrome.storage
    console.log('[4/4] Saving to chrome.storage...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Profile saved to chrome.storage\n');

    // STEP 5: Verify by re-loading
    console.log('[5/5] Verifying by re-loading from chrome.storage...');
    const verifyData = await chrome.storage.local.get('hspProfile');
    const verifyRegistry = verifyData.hspProfile?.subCategoryRegistry;

    if (!verifyRegistry) {
      throw new Error('Verification failed: Registry not found after save!');
    }

    const verifyCount = Object.keys(verifyRegistry).length;
    console.log(`✓ Verified: ${verifyCount} SubCategories found in storage\n`);

    // SUCCESS: Show summary
    console.log('====================================');
    console.log('✓ SUCCESS! Taxonomy Setup Complete');
    console.log('====================================\n');

    // Group by parent for summary
    const grouped = {};
    Object.keys(verifyRegistry).forEach(subCatKey => {
      const parent = verifyRegistry[subCatKey].parent;
      if (!grouped[parent]) {
        grouped[parent] = [];
      }
      grouped[parent].push(subCatKey);
    });

    console.log(`📊 Summary:`);
    console.log(`   ${taxonomy.length} Main Categories`);
    console.log(`   ${verifyCount} SubCategories`);
    console.log(`   ${(verifyCount / taxonomy.length).toFixed(1)} SubCategories per Category (average)\n`);

    console.log('📋 Categories:');
    console.log('   ' + Object.keys(grouped).sort().join(', ') + '\n');

    console.log('📝 Sample SubCategories:');
    const samples = [
      'fashion_style',
      'health_physical',
      'work_role',
      'learning_topics',
      'nutrition_diet'
    ];
    samples.forEach(sample => {
      if (verifyRegistry[sample]) {
        console.log(`   - ${sample} (parent: ${verifyRegistry[sample].parent})`);
      }
    });

    console.log('\n✓ Ready to assign gems to SubCategories!');

  } catch (error) {
    console.error('✗ Setup failed:', error);
    throw error;
  }
})();
