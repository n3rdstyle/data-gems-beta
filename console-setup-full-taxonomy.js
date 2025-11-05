/**
 * Console Script: Setup Complete SubCategory Taxonomy
 *
 * Creates SubCategory Registry with:
 * - 42 Main Categories
 * - 252 SubCategories (6 per category)
 *
 * Usage:
 * 1. Open extension popup
 * 2. Open DevTools (F12)
 * 3. Copy and paste this entire script
 */

(async function setupFullTaxonomy() {
  console.log('=== Setting up Complete SubCategory Taxonomy ===');

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
    // Load profile
    console.log('[1/3] Loading profile...');
    const data = await chrome.storage.local.get('hspProfile');
    if (!data.hspProfile) {
      throw new Error('No profile found!');
    }

    const profile = data.hspProfile;
    console.log('✓ Profile loaded');

    // Create SubCategory Registry
    console.log('[2/3] Creating SubCategory Registry...');
    console.log(`Processing ${taxonomy.length} categories with ${taxonomy.reduce((sum, cat) => sum + cat.subcategories.length, 0)} subcategories...`);

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

      // Log progress every 10 categories
      if (subCategoryCount % 60 === 0) {
        console.log(`  ✓ Processed ${subCategoryCount} SubCategories...`);
      }
    });

    // Assign registry to profile
    profile.subCategoryRegistry = registry;

    console.log(`✓ Created ${subCategoryCount} SubCategories for ${taxonomy.length} categories`);

    // Save profile
    console.log('[3/3] Saving profile...');
    await chrome.storage.local.set({ hspProfile: profile });
    console.log('✓ Profile saved');

    // Print summary
    console.log('');
    console.log('=== Taxonomy Setup Complete ===');
    console.log(`✓ ${taxonomy.length} Main Categories`);
    console.log(`✓ ${subCategoryCount} SubCategories`);
    console.log('');

    // Group SubCategories by parent
    const grouped = {};
    Object.keys(registry).forEach(subCatKey => {
      const parent = registry[subCatKey].parent;
      if (!grouped[parent]) {
        grouped[parent] = [];
      }
      grouped[parent].push(subCatKey);
    });

    console.log('SubCategories by Category:');
    Object.keys(grouped).sort().forEach(parent => {
      console.log(`  ${parent} (${grouped[parent].length}): ${grouped[parent].join(', ')}`);
    });

    console.log('');
    console.log('✓ Taxonomy ready! You can now assign gems to these SubCategories.');
    console.log('');
    console.log('Example SubCategory keys:');
    console.log('  - identity_origin');
    console.log('  - fashion_style');
    console.log('  - health_physical');
    console.log('  - work_role');
    console.log('  - learning_topics');

  } catch (error) {
    console.error('✗ Setup failed:', error);
    throw error;
  }
})();
