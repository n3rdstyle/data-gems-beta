#!/usr/bin/env python3
"""
Direct AI Recategorization

Claude analyzes gems and outputs categorization inline
"""

import json
import sys
from datetime import datetime

# Taxonomy
TAXONOMY = {
    'Identity': ['Origin', 'Language', 'Demographics', 'Background', 'SelfImage', 'Constraints'],
    'Personality': ['Traits', 'Strengths', 'Weaknesses', 'Behavior', 'Motivation', 'Constraints'],
    'Mindset': ['Attitude', 'Perspective', 'Resilience', 'Curiosity', 'Growth', 'Constraints'],
    'Values': ['Ethics', 'Priorities', 'Beliefs', 'Integrity', 'Purpose', 'Constraints'],
    'Habits': ['Morning', 'Evening', 'Digital', 'Health', 'Productivity', 'Constraints'],
    'Health': ['Physical', 'Mental', 'Sleep', 'Stress', 'Energy', 'Constraints'],
    'Nutrition': ['Diet', 'Preferences', 'Restrictions', 'Cooking', 'EatingOut', 'Constraints'],
    'Fitness': ['Training', 'Mobility', 'Recovery', 'Endurance', 'Strength', 'Constraints'],
    'Sports': ['Running', 'TeamSports', 'Outdoor', 'Water', 'Adventure', 'Constraints'],
    'Recovery': ['Sleep', 'Relaxation', 'Mindfulness', 'BodyCare', 'Balance', 'Constraints'],
    'Work': ['Role', 'Environment', 'Collaboration', 'Motivation', 'Projects', 'Constraints'],
    'Career': ['Path', 'Skills', 'Goals', 'Achievements', 'Network', 'Constraints'],
    'Learning': ['Topics', 'Style', 'Courses', 'Curiosity', 'Knowledge', 'Constraints'],
    'Creativity': ['Ideas', 'Inspiration', 'Expression', 'Making', 'Aesthetics', 'Constraints'],
    'Productivity': ['Tools', 'Focus', 'Time', 'Systems', 'Flow', 'Constraints'],
    'Technology': ['Devices', 'Software', 'AI', 'Automation', 'Innovation', 'Constraints'],
    'Fashion': ['Style', 'Brands', 'Colors', 'Accessories', 'Trends', 'Constraints'],
    'Design': ['Visuals', 'Interior', 'UX', 'Architecture', 'Minimalism', 'Constraints'],
    'Music': ['Genres', 'Artists', 'Playlists', 'Instruments', 'Concerts', 'Constraints'],
    'Movies': ['Genres', 'Directors', 'Favorites', 'Series', 'Streaming', 'Constraints'],
    'Books': ['Genres', 'Authors', 'Favorites', 'Learning', 'Fiction', 'Constraints'],
    'Media': ['Podcasts', 'News', 'Social', 'Magazines', 'Influences', 'Constraints'],
    'Art': ['Visual', 'Modern', 'Photography', 'Exhibitions', 'Expression', 'Constraints'],
    'Travel': ['Destinations', 'Culture', 'Experiences', 'Bucketlist', 'Memories', 'Constraints'],
    'Home': ['Location', 'Interior', 'Comfort', 'Rituals', 'Atmosphere', 'Constraints'],
    'Living': ['Housing', 'Neighborhood', 'Lifestyle', 'Energy', 'Minimalism', 'Constraints'],
    'Nature': ['Outdoor', 'Climate', 'Plants', 'Animals', 'Connection', 'Constraints'],
    'Sustainability': ['Consumption', 'Waste', 'Energy', 'Food', 'Awareness', 'Constraints'],
    'Family': ['Partner', 'Children', 'Parents', 'Traditions', 'Support', 'Constraints'],
    'Friends': ['Circle', 'Trust', 'Activities', 'Memories', 'Loyalty', 'Constraints'],
    'Community': ['Local', 'Online', 'SharedValues', 'Contribution', 'Events', 'Constraints'],
    'Pets': ['Species', 'Routine', 'Care', 'Behavior', 'Bond', 'Constraints'],
    'Lifestyle': ['Routine', 'Choices', 'Attitude', 'Balance', 'Aesthetics', 'Constraints'],
    'Shopping': ['Preferences', 'Habits', 'Budget', 'Online', 'Discovery', 'Constraints'],
    'Brands': ['Favorites', 'Trust', 'Loyalty', 'Image', 'Experience', 'Constraints'],
    'Consumption': ['Products', 'Media', 'Food', 'Fashion', 'Tech', 'Constraints'],
    'Emotions': ['Mood', 'Triggers', 'Expression', 'Regulation', 'Empathy', 'Constraints'],
    'Goals': ['ShortTerm', 'LongTerm', 'Personal', 'Professional', 'Fitness', 'Constraints'],
    'Context': ['Situation', 'Environment', 'Device', 'Activity', 'Interaction', 'Constraints'],
    'Behavior': ['Online', 'Social', 'Purchase', 'Learning', 'Health', 'Constraints'],
    'Location': ['City', 'Country', 'Home', 'Work', 'Travel', 'Constraints'],
    'Time': ['Morning', 'Afternoon', 'Evening', 'Weekend', 'Season', 'Constraints']
}

def apply_categorization(input_file, categorization_json, output_file):
    """Apply Claude's categorization to the JSON"""

    print('=== Applying Claude Categorization ===\n')

    # Load original profile
    print(f'[1/3] Loading {input_file}...')
    with open(input_file, 'r', encoding='utf-8') as f:
        profile = json.load(f)

    gems = profile['content']['preferences']['items']
    print(f'✓ Loaded {len(gems)} gems\n')

    # Load categorization
    print(f'[2/3] Loading categorization from {categorization_json}...')
    with open(categorization_json, 'r', encoding='utf-8') as f:
        categorization = json.load(f)

    print(f'✓ Loaded {len(categorization)} categorizations\n')

    # Create registry
    registry = {}
    for category, subcats in TAXONOMY.items():
        for subcat in subcats:
            key = f"{category.lower()}_{subcat.lower()}"
            registry[key] = {
                'parent': category,
                'displayName': subcat,
                'gemCount': 0,
                'created_at': datetime.now().isoformat()
            }

    profile['subCategoryRegistry'] = registry

    # Apply
    print('[3/3] Applying categorization...')
    stats = {'categorized': 0, 'skipped': 0, 'invalid': 0}

    for idx_str, cat_data in categorization.items():
        idx = int(idx_str)
        if idx >= len(gems):
            continue

        gem = gems[idx]
        main_cat = cat_data.get('category')
        sub_cat = cat_data.get('subcategory')

        if main_cat and sub_cat:
            if sub_cat in registry:
                gem['collections'] = [main_cat]
                gem['subCollections'] = [sub_cat]
                gem['updated_at'] = datetime.now().isoformat()
                registry[sub_cat]['gemCount'] += 1
                stats['categorized'] += 1
            else:
                print(f'  ⚠ Invalid subcategory: {sub_cat}')
                stats['invalid'] += 1
        else:
            stats['skipped'] += 1

    print(f'\n✓ Categorized: {stats["categorized"]} gems')
    print(f'⊘ Skipped: {stats["skipped"]} gems')
    if stats['invalid'] > 0:
        print(f'⚠ Invalid: {stats["invalid"]} gems')

    # Save
    print(f'\nSaving to {output_file}...')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)

    print('✓ Saved!\n')
    print('====================================')
    print('✓ Complete!')
    print('====================================')

if __name__ == '__main__':
    if len(sys.argv) != 4:
        print('Usage: python3 ai-recategorize-direct.py <input.json> <categorization.json> <output.json>')
        sys.exit(1)

    apply_categorization(sys.argv[1], sys.argv[2], sys.argv[3])
