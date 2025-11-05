#!/usr/bin/env python3
"""
Recategorize Data Gems Backup JSON

Converts old collections to new Main Categories + SubCategories
using rule-based mapping (no AI needed - instant!)
"""

import json
import re
from datetime import datetime

# Mapping: Old Collection Name → New Main Category
COLLECTION_MAPPING = {
    'Entertainment & Media': 'Media',
    'Fashion & Style': 'Fashion',
    'Lifestyle & Preferences': 'Lifestyle',
    'Personal Information': 'Identity',
    'Health & Fitness': 'Health',
    'Work & Career': 'Work',
    'Technology': 'Technology',
    'Sports & Outdoor': 'Sports',
    'Food & Nutrition': 'Nutrition',
    'Travel': 'Travel',
    'Hobbies & Interests': 'Creativity',
    'Relationships': 'Family',
    'Shopping': 'Shopping',
    'Home & Living': 'Home',
    'Values & Beliefs': 'Values',
    'Goals & Aspirations': 'Goals',
}

# SubCategory assignment based on keywords in gem value
SUBCATEGORY_RULES = {
    # Fashion
    'fashion_style': ['style', 'aesthetic', 'minimalist', 'classic', 'modern', 'casual', 'formal'],
    'fashion_brands': ['brand', 'nike', 'adidas', 'uniqlo', 'h&m', 'zara'],
    'fashion_colors': ['color', 'colour', 'black', 'white', 'blue', 'red', 'grey'],
    'fashion_accessories': ['watch', 'bag', 'jewelry', 'belt', 'glasses', 'hat'],
    'fashion_trends': ['trend', 'fashion', 'season'],

    # Health
    'health_physical': ['fitness', 'exercise', 'workout', 'gym', 'strength', 'cardio', 'body'],
    'health_mental': ['mental', 'therapy', 'stress', 'anxiety', 'meditation', 'mindfulness'],
    'health_sleep': ['sleep', 'rest', 'bed', 'wake', 'insomnia'],
    'health_energy': ['energy', 'fatigue', 'tired', 'vitality'],

    # Nutrition
    'nutrition_diet': ['diet', 'eating', 'vegan', 'vegetarian', 'paleo', 'keto'],
    'nutrition_preferences': ['favorite food', 'like', 'prefer', 'love', 'enjoy', 'go-to', 'lieblings', 'favorite', 'favourite', 'fav'],
    'nutrition_restrictions': ['allergy', 'intolerant', 'avoid', 'can\'t eat', 'lactose', 'allergic'],
    'nutrition_cooking': ['cook', 'recipe', 'kitchen', 'meal prep'],

    # Work
    'work_role': ['job', 'position', 'role', 'work as', 'profession', 'occupation', 'career', 'arbeite als'],
    'work_environment': ['office', 'remote', 'hybrid', 'workplace', 'desk', 'work from', 'home office'],
    'work_collaboration': ['team', 'colleague', 'meeting', 'collaboration', 'multitasking', 'focus'],
    'work_projects': ['project', 'working on', 'current work', 'task', 'assignment'],

    # Sports
    'sports_running': ['run', 'running', 'marathon', 'jogging', '5k', '10k'],
    'sports_teamsports': ['soccer', 'football', 'basketball', 'team sport', 'player'],
    'sports_outdoor': ['hiking', 'climbing', 'outdoor', 'mountain'],
    'sports_water': ['swim', 'swimming', 'surf', 'diving', 'water sport'],

    # Technology
    'technology_devices': ['phone', 'laptop', 'computer', 'tablet', 'device', 'iphone', 'android'],
    'technology_software': ['app', 'software', 'tool', 'program', 'use'],
    'technology_ai': ['ai', 'artificial intelligence', 'chatgpt', 'claude', 'gemini'],

    # Learning
    'learning_topics': ['learning', 'study', 'interested in', 'curious about'],
    'learning_style': ['learn by', 'prefer to learn', 'learning style'],
    'learning_courses': ['course', 'class', 'training', 'certification'],

    # Music
    'music_genres': ['genre', 'music genre', 'listen to', 'type of music'],
    'music_artists': ['artist', 'band', 'musician', 'singer', 'favorite artist'],
    'music_playlists': ['playlist', 'favorite songs', 'song'],

    # Movies
    'movies_genres': ['movie genre', 'film genre', 'watch', 'love movies'],
    'movies_favorites': ['favorite movie', 'best movie', 'top movie'],
    'movies_series': ['series', 'show', 'tv show', 'netflix', 'streaming'],

    # Books
    'books_genres': ['book genre', 'read', 'reading'],
    'books_authors': ['author', 'writer', 'favorite author'],
    'books_favorites': ['favorite book', 'best book', 'love book'],

    # Travel
    'travel_destinations': ['travel', 'visit', 'country', 'city', 'destination', 'been to', 'im urlaub', 'vacation', 'holiday', 'reise'],
    'travel_experiences': ['experience', 'trip', 'journey', 'adventure', 'traveled to', 'visited'],
    'travel_bucketlist': ['bucket list', 'want to visit', 'dream destination', 'next trip', 'planning to'],

    # Identity
    'identity_origin': ['from', 'born in', 'grew up', 'nationality', 'origin'],
    'identity_language': ['speak', 'language', 'fluent', 'native'],
    'identity_demographics': ['age', 'gender', 'location', 'live in'],

    # Lifestyle
    'lifestyle_routine': ['routine', 'daily', 'morning', 'evening', 'schedule', 'day starts', 'wake up', 'go to bed'],
    'lifestyle_choices': ['lifestyle', 'live', 'prefer', 'choice', 'usually', 'typically', 'tend to', 'always', 'never', 'often'],

    # Family
    'family_partner': ['partner', 'wife', 'husband', 'spouse', 'girlfriend', 'boyfriend'],
    'family_children': ['child', 'children', 'kids', 'son', 'daughter'],
    'family_parents': ['parent', 'mother', 'father', 'mom', 'dad'],

    # Pets
    'pets_species': ['dog', 'cat', 'pet', 'animal', 'have a'],
    'pets_routine': ['pet routine', 'walk', 'feed'],
}


def map_collection(old_collection):
    """Map old collection name to new main category"""
    # Direct mapping
    if old_collection in COLLECTION_MAPPING:
        return COLLECTION_MAPPING[old_collection]

    # Fuzzy matching
    for old_name, new_cat in COLLECTION_MAPPING.items():
        if old_name.lower() in old_collection.lower():
            return new_cat

    # Default fallbacks based on keywords
    old_lower = old_collection.lower()
    if 'fashion' in old_lower or 'style' in old_lower or 'clothing' in old_lower:
        return 'Fashion'
    if 'health' in old_lower or 'fitness' in old_lower:
        return 'Health'
    if 'food' in old_lower or 'nutrition' in old_lower:
        return 'Nutrition'
    if 'work' in old_lower or 'career' in old_lower or 'job' in old_lower:
        return 'Work'
    if 'tech' in old_lower:
        return 'Technology'
    if 'sport' in old_lower:
        return 'Sports'
    if 'travel' in old_lower:
        return 'Travel'
    if 'music' in old_lower:
        return 'Music'
    if 'movie' in old_lower or 'film' in old_lower:
        return 'Movies'
    if 'book' in old_lower:
        return 'Books'
    if 'media' in old_lower:
        return 'Media'
    if 'family' in old_lower or 'relationship' in old_lower:
        return 'Family'
    if 'pet' in old_lower:
        return 'Pets'
    if 'home' in old_lower or 'living' in old_lower:
        return 'Home'

    # Generic fallback
    return 'Lifestyle'


def assign_subcategory(gem_value, main_category):
    """Assign SubCategory based on gem value and main category"""
    value_lower = gem_value.lower()

    # Score each subcategory based on keyword matches
    scores = {}
    for subcat_key, keywords in SUBCATEGORY_RULES.items():
        # Only consider subcategories that match the main category
        subcat_category = subcat_key.split('_')[0]
        if subcat_category == main_category.lower():
            score = 0
            for keyword in keywords:
                if keyword.lower() in value_lower:
                    score += 1
            if score > 0:
                scores[subcat_key] = score

    # Return highest scoring subcategory
    if scores:
        best_subcat = max(scores, key=scores.get)
        return best_subcat

    # Fallback to constraints
    return f"{main_category.lower()}_constraints"


def recategorize_backup(input_path, output_path):
    """Process backup JSON and recategorize all gems"""
    print('=== Recategorizing Backup JSON ===\n')

    # Load backup
    print(f'[1/4] Loading backup from: {input_path}')
    with open(input_path, 'r', encoding='utf-8') as f:
        profile = json.load(f)

    gems = profile.get('content', {}).get('preferences', {}).get('items', [])
    print(f'✓ Loaded {len(gems)} gems\n')

    # Initialize SubCategory Registry
    print('[2/4] Creating SubCategory Registry...')

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
    print(f'✓ Created {len(registry)} SubCategories\n')

    # Recategorize all gems
    print(f'[3/4] Recategorizing {len(gems)} gems...')

    stats = {
        'categorized': 0,
        'skipped': 0,
        'categories_used': {},
        'subcategories_used': {}
    }

    for i, gem in enumerate(gems):
        if (i + 1) % 50 == 0:
            print(f'  Progress: {i+1}/{len(gems)} ({int((i+1)/len(gems)*100)}%)')

        # Get old collection
        old_collections = gem.get('collections', [])
        if not old_collections:
            stats['skipped'] += 1
            continue

        old_collection = old_collections[0]  # Use first collection

        # Map to new main category
        main_category = map_collection(old_collection)

        # Assign subcategory
        subcategory = assign_subcategory(gem.get('value', ''), main_category)

        # Update gem
        gem['collections'] = [main_category]
        gem['subCollections'] = [subcategory]
        gem['updated_at'] = datetime.now().isoformat()

        # Update registry count
        if subcategory in registry:
            registry[subcategory]['gemCount'] += 1

        # Track stats
        stats['categorized'] += 1
        stats['categories_used'][main_category] = stats['categories_used'].get(main_category, 0) + 1
        stats['subcategories_used'][subcategory] = stats['subcategories_used'].get(subcategory, 0) + 1

    print(f'✓ Categorized {stats["categorized"]} gems\n')

    # Save output
    print(f'[4/4] Saving to: {output_path}')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(profile, f, indent=2, ensure_ascii=False)

    print('✓ Saved\n')

    # Summary
    print('====================================')
    print('✓ Recategorization Complete!')
    print('====================================\n')

    print(f'📊 Results:')
    print(f'   Categorized: {stats["categorized"]} gems')
    print(f'   Skipped: {stats["skipped"]} gems\n')

    print('📋 Top Categories Used:')
    for cat, count in sorted(stats['categories_used'].items(), key=lambda x: -x[1])[:10]:
        print(f'   - {cat}: {count} gems')

    print('\n📋 Top SubCategories Used:')
    for subcat, count in sorted(stats['subcategories_used'].items(), key=lambda x: -x[1])[:15]:
        parent = registry.get(subcat, {}).get('parent', '?')
        print(f'   - {subcat} ({parent}): {count} gems')

    print(f'\n✓ Output saved to: {output_path}')
    print('✓ You can now import this JSON in the extension!')


if __name__ == '__main__':
    input_file = '/Users/d.breuer/Downloads/data-gems-hsp-profile-1762352816212.json'
    output_file = '/Users/d.breuer/Downloads/data-gems-hsp-profile-RECATEGORIZED.json'

    recategorize_backup(input_file, output_file)
