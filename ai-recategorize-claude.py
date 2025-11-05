#!/usr/bin/env python3
"""
AI-Powered Recategorization using Claude (via Claude Code)

This script:
1. Extracts gems from the backup JSON
2. For each gem, Claude analyzes it semantically
3. Outputs the categorization results
4. Updates the JSON with proper categories
"""

import json
import sys
from datetime import datetime

def extract_gems_for_analysis(input_file):
    """Extract gems from JSON for Claude to analyze"""
    print('[1/3] Loading JSON and extracting gems...')

    with open(input_file, 'r', encoding='utf-8') as f:
        profile = json.load(f)

    gems = profile.get('content', {}).get('preferences', {}).get('items', [])
    print(f'✓ Found {len(gems)} gems\n')

    # Create simplified list for Claude
    gems_for_claude = []
    for i, gem in enumerate(gems):
        gems_for_claude.append({
            'index': i,
            'id': gem.get('id'),
            'value': gem.get('value', '')[:500]  # Truncate long values
        })

    return profile, gems, gems_for_claude


def main():
    input_file = '/Users/d.breuer/Downloads/data-gems-hsp-profile-1762352816212.json'
    output_file = '/Users/d.breuer/Downloads/data-gems-hsp-profile-CLAUDE-RECATEGORIZED.json'

    print('=== AI Recategorization with Claude ===\n')

    # Extract gems
    profile, gems, gems_for_claude = extract_gems_for_analysis(input_file)

    # Output for Claude
    print('[2/3] Gems ready for Claude analysis')
    print(f'Total: {len(gems_for_claude)} gems')
    print('\nNow Claude will analyze each gem...\n')

    # Save gems list for reference
    with open('/tmp/gems_for_claude.json', 'w', encoding='utf-8') as f:
        json.dump(gems_for_claude, f, indent=2, ensure_ascii=False)

    print('✓ Gems list saved to /tmp/gems_for_claude.json')
    print('\n📋 INSTRUCTIONS FOR CLAUDE:')
    print('1. Read the gems from /tmp/gems_for_claude.json')
    print('2. For EACH gem, analyze semantically and determine:')
    print('   - Main Category (from taxonomy)')
    print('   - SubCategory (specific, not _constraints unless truly generic)')
    print('3. Output the results as a JSON mapping:')
    print('   {')
    print('     "0": {"category": "Nutrition", "subcategory": "nutrition_preferences"},')
    print('     "1": {"category": "Travel", "subcategory": "travel_destinations"},')
    print('     ...')
    print('   }')
    print('4. Save it to /tmp/claude_categorization.json')
    print('\n⏸ Waiting for Claude to complete analysis...')
    print('(Press Enter after Claude finishes)')
    input()

    # Load Claude's categorization
    print('\n[3/3] Applying Claude\'s categorization...')
    try:
        with open('/tmp/claude_categorization.json', 'r', encoding='utf-8') as f:
            categorization = json.load(f)
    except FileNotFoundError:
        print('✗ Categorization file not found!')
        print('Make sure Claude saved to /tmp/claude_categorization.json')
        sys.exit(1)

    # Initialize SubCategory Registry
    taxonomy = {
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

    registry = {}
    for category, subcats in taxonomy.items():
        for subcat in subcats:
            key = f"{category.lower()}_{subcat.lower()}"
            registry[key] = {
                'parent': category,
                'displayName': subcat,
                'gemCount': 0,
                'created_at': datetime.now().isoformat()
            }

    profile['subCategoryRegistry'] = registry

    # Apply categorization
    stats = {'categorized': 0, 'skipped': 0}

    for idx_str, cat_data in categorization.items():
        idx = int(idx_str)
        if idx >= len(gems):
            continue

        gem = gems[idx]
        main_cat = cat_data.get('category')
        sub_cat = cat_data.get('subcategory')

        if main_cat and sub_cat and sub_cat in registry:
            gem['collections'] = [main_cat]
            gem['subCollections'] = [sub_cat]
            gem['updated_at'] = datetime.now().isoformat()
            registry[sub_cat]['gemCount'] += 1
            stats['categorized'] += 1
        else:
            stats['skipped'] += 1

    print(f'✓ Applied categorization to {stats["categorized"]} gems')
    print(f'⊘ Skipped {stats["skipped"]} gems')

    # Save
    print(f'\nSaving to {output_file}...')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)

    print('✓ Saved!')
    print('\n====================================')
    print('✓ AI Recategorization Complete!')
    print('====================================')
    print(f'\n✓ Output: {output_file}')
    print('✓ Ready to import in the extension!')


if __name__ == '__main__':
    main()
