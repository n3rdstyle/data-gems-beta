/**
 * Update JSON templates with new 50-question structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Category mappings from FIELD_MAPPINGS
const CATEGORY_FIELDS = {
  travel: [
    'travel_persona', 'preferred_vibe', 'trip_frequency', 'travel_companions', 'core_motivations',
    'avoid_on_trips', 'favorite_regions_or_countries', 'preferred_climate', 'preferred_landscapes',
    'urban_vs_nature_preference', 'cultural_interests', 'language_comfort_zones', 'travel_bucket_list',
    'preferred_types', 'comfort_level', 'style_keywords', 'amenities_priority', 'favorite_hotels_or_brands',
    'stay_duration_pattern', 'preferred_modes', 'airline_or_train_loyalty', 'seat_preference',
    'baggage_habits', 'car_rental_preference', 'sustainability_priority', 'dietary_considerations',
    'favorite_cuisines', 'coffee_habits', 'restaurant_type_preference', 'local_food_openness',
    'avoid_foods', 'average_budget_per_trip', 'budget_flexibility', 'splurge_categories',
    'saving_preferences', 'value_definition', 'preferred_payment_method', 'planning_style',
    'booking_window', 'trip_discovery_channels', 'trust_sources', 'trip_length_preference',
    'spontaneity_level', 'feelings_sought_on_trip', 'perfect_trip_description', 'most_memorable_trip',
    'worst_trip_pain_points', 'stress_triggers_when_traveling', 'post_trip_feelings', 'favorite_travel_activities'
  ],
  shopping: [
    'style_words', 'dominant_colors', 'preferred_materials', 'avoided_textures_patterns',
    'attractive_design_qualities', 'product_feels_like_me', 'visual_references', 'sizes',
    'preferred_fit', 'brands_fit_well', 'comfort_features', 'cuts_shapes_to_avoid',
    'sensitivity_notes', 'main_use_cases', 'purchase_frequency_by_use_case', 'key_functional_traits',
    'existing_ecosystem', 'tech_upgrade_cadence', 'discovery_channels', 'value_aligned_brands',
    'appealing_brand_stories', 'avoid_practices_materials', 'local_ethic_priority', 'prioritize_emerging_brands',
    'preferred_certifications', 'price_range_everyday_clothing', 'price_range_shoes', 'price_range_tech',
    'quality_vs_quantity', 'worth_it_criteria', 'primary_location', 'typical_weather',
    'travel_habits', 'daily_rhythm', 'environmental_constraints', 'lifestyle_habits',
    'decision_style', 'typical_comparison_set_size', 'curation_preference', 'return_rate_sentiment',
    'purchase_triggers', 'review_influence_level', 'shopping_mode_preference', 'desired_purchase_emotions',
    'story_vs_function_bias', 'packaging_preferences', 'most_memorable_purchase', 'most_common_regret',
    'perfect_buy_definition', 'trend_following_approach'
  ],
  emotions: [
    'core_emotions_felt_often', 'emotional_expression_style', 'emotional_language_strength', 'comfort_with_vulnerability',
    'dominant_emotional_tone', 'relationship_with_emotions', 'typical_daily_mood_range', 'energy_vs_emotion_pattern',
    'emotional_triggers_positive', 'emotional_triggers_negative', 'coping_mechanisms', 'emotional_recovery_speed',
    'need_for_connection', 'need_for_stability', 'need_for_excitement_or_novelty', 'need_for_recognition',
    'need_for_safety', 'need_for_autonomy', 'preferred_forms_of_expression', 'creative_or_physical_outlets',
    'communication_of_feelings', 'body_language_awareness', 'tendency_to_suppress_or_share', 'rituals_for_emotional_release',
    'stress_response_pattern', 'main_sources_of_stress', 'stress_management_strategies', 'resilience_triggers',
    'comfort_sources', 'burnout_signs', 'self_awareness_level', 'empathy_toward_others',
    'ability_to_label_emotions', 'emotional_regulation_skill', 'pattern_recognition_in_others', 'emotional_learning_goals',
    'sources_of_joy', 'moments_of_calm', 'factors_that_reduce_wellbeing', 'gratitude_practices',
    'definition_of_happiness', 'emotional_balance_strategy', 'recent_emotional_realizations', 'most_common_feeling_lately',
    'emotions_you_want_to_experience_more', 'emotions_you_avoid', 'what_your_emotions_teach_you', 'relationship_between_emotion_and_identity',
    'emotional_support_system', 'emotional_boundaries'
  ],
  work: [
    'current_role', 'industry', 'company_or_organization', 'workplace_size', 'years_of_experience',
    'professional_strengths', 'career_values', 'short_term_goals', 'long_term_goals', 'career_dreams',
    'motivation_for_work', 'definition_of_success', 'career_inspirations', 'typical_work_hours', 'preferred_start_time',
    'break_patterns', 'focus_energy_cycles', 'workload_tolerance', 'ideal_workday_description', 'collaboration_style',
    'communication_preferences', 'meeting_tolerance_level', 'feedback_preference', 'team_dynamics_preference', 'preferred_tools_for_communication',
    'project_management_style', 'preferred_productivity_system', 'favorite_work_apps_or_tools', 'file_organization_habits', 'automation_or_ai_tools_used',
    'distraction_management_strategies', 'leadership_style', 'mentorship_roles', 'learning_priorities_for_work', 'decision_making_style',
    'change_management_comfort', 'growth_mindset_practices', 'preferred_work_location', 'home_office_setup', 'office_environment_preferences',
    'travel_frequency_for_work', 'commute_preference', 'ideal_workspace_vibe', 'feelings_toward_work', 'moments_of_flow',
    'biggest_sources_of_stress', 'most_proud_work_moments', 'work_life_balance_definition', 'purpose_you_find_in_work', 'professional_development_priorities'
  ],
  nutrition: [
    'overall_diet_type', 'eating_philosophy', 'dietary_restrictions', 'allergies', 'ethical_or_religious_considerations',
    'nutrition_goals', 'flexibility_level', 'meal_frequency', 'usual_breakfast_time', 'usual_lunch_time',
    'usual_dinner_time', 'snack_patterns', 'late_night_eating_habit', 'favorite_cuisines', 'favorite_dishes',
    'preferred_flavors', 'disliked_foods', 'comfort_foods', 'experimental_openness', 'daily_drinks',
    'coffee_or_tea_preference', 'alcohol_consumption_pattern', 'hydration_habits', 'favorite_non_alcoholic_drinks', 'avoid_beverages',
    'cooking_frequency', 'preferred_cooking_methods', 'skill_level', 'favorite_ingredients', 'kitchen_equipment_priority',
    'takeout_frequency', 'fitness_connection', 'supplement_routine', 'tracking_methods', 'gut_health_focus',
    'energy_level_patterns', 'food_sensitivity_awareness', 'grocery_frequency', 'preferred_supermarkets_or_brands', 'organic_preference',
    'budget_per_week', 'online_vs_offline_shopping', 'food_sourcing_priority', 'emotional_triggers_for_eating', 'food_as_reward_or_relaxation',
    'most_memorable_meal', 'stress_eating_tendency', 'mindful_eating_practices', 'definition_of_good_meal', 'meal_planning_habits'
  ],
  health: [
    'sleep_pattern', 'sleep_hours', 'sleep_quality', 'exercise_routine', 'exercise_type',
    'exercise_duration', 'fitness_goals', 'health_priorities', 'chronic_conditions', 'medications_regular',
    'supplements', 'health_tracking', 'doctor_visit_frequency', 'preventive_care', 'mental_health_practices',
    'stress_level', 'energy_levels', 'body_signals_awareness', 'pain_areas', 'mobility_issues',
    'vision_hearing', 'dental_health', 'skin_care_routine', 'water_intake', 'caffeine_consumption',
    'alcohol_limits', 'smoking_status', 'screen_time', 'outdoor_time', 'recovery_priorities',
    'health_anxiety', 'wellness_budget', 'health_insurance', 'alternative_medicine', 'body_goals',
    'immune_system_health', 'allergy_situation', 'digestive_health', 'hormonal_health', 'heart_health',
    'respiratory_health', 'bone_health', 'posture_awareness', 'stretching_routine', 'injury_history',
    'health_check_frequency', 'health_education', 'health_role_models', 'longevity_practices', 'health_transformation_goals'
  ],
  memory: [
    'relationship_with_past', 'attitude_toward_memory', 'emotional_connection_to_nostalgia', 'view_on_time_and_change', 'storytelling_style',
    'memory_triggers', 'childhood_memories', 'adolescent_formative_experiences', 'adulthood_defining_moments', 'career_or_achievement_highlights',
    'transformative_failures_or_lessons', 'moments_of_awakening', 'most_influential_people', 'memories_shared_with_loved_ones', 'losses_that_shaped_you',
    'mentors_or_role_models', 'friendship_moments_you_value', 'relationship_transitions', 'childhood_places', 'cities_or_countries_that_shaped_you',
    'favorite_places_from_past', 'places_associated_with_calm_or_home', 'memories_linked_to_travel', 'environmental_sensory_triggers', 'sentimental_objects',
    'family_heirlooms_or_symbols', 'music_or_art_that_evokes_memory', 'digital_memories_saved', 'personal_archives_or_journals', 'photographs_that_define_you',
    'happiest_memories', 'most_challenging_moments', 'memories_of_love_and_connection', 'memories_of_fear_or_loss', 'themes_that_repeat_in_memory',
    'healing_or_reframed_memories', 'lessons_from_past', 'how_you_revisit_old_memories', 'how_memory_influences_present_choices', 'moments_you_want_to_preserve_forever',
    'how_you_deal_with_regret', 'what_memory_means_to_you', 'stories_you_tell_about_yourself', 'stories_you_avoid_telling', 'people_you_want_to_pass_memories_to',
    'mediums_you_use_to_preserve_memory', 'how_you_want_to_be_remembered', 'memory_project_or_archive_idea', 'forgotten_memories_you_wish_to_recall', 'earliest_memory'
  ],
  arts_creativity: [
    'creative_self_description', 'role_of_creativity_in_life', 'artistic_or_inventive_disciplines', 'creative_strengths', 'creative_challenges',
    'definition_of_originality', 'favorite_art_styles_or_movements', 'aesthetic_keywords', 'preferred_color_palettes', 'material_or_medium_preferences',
    'emotional_response_to_aesthetics', 'symbols_or_visual_motifs', 'inspiration_sources', 'idea_generation_methods', 'workflow_from_idea_to_creation',
    'preferred_tools_or_mediums', 'balance_between_planning_and_improvisation', 'creative_rituals_or_routines', 'approach_to_innovation', 'comfort_with_ambiguity_and_failure',
    'curiosity_triggers', 'collaboration_in_creation', 'pattern_recognition_strengths', 'examples_of_inventive_projects', 'creative_outlets',
    'art_forms_you_practice', 'performance_or_exhibition_experience', 'favorite_subjects_or_themes', 'audience_relationship', 'art_as_emotional_expression',
    'favorite_artists_or_creators', 'inspirational_works', 'museums_or_events_you_frequent', 'favorite_music_books_or_films', 'online_art_spaces_or_communities',
    'daily_inspiration_sources', 'skills_in_development', 'creative_courses_or_workshops', 'mentorship_or_peer_learning', 'creative_feedback_habits',
    'projects_you_want_to_master', 'vision_for_creative_growth', 'artistic_or_innovative_goals', 'technologies_or_tools_you_want_to_explore', 'dream_collaborations',
    'vision_for_future_creative_work', 'cultural_impact_you_want_to_make', 'definition_of_creative_legacy', 'creative_blocks_and_solutions', 'artistic_evolution'
  ],
  family: [
    'family_structure', 'family_size', 'relationship_status', 'children', 'children_ages',
    'parenting_style', 'extended_family_closeness', 'family_values', 'family_traditions', 'family_gathering_frequency',
    'family_communication_style', 'conflict_resolution', 'support_system', 'caregiving_responsibilities', 'household_roles',
    'decision_making_family', 'cultural_heritage', 'language_spoken_at_home', 'religious_practices', 'family_activities',
    'vacation_style_family', 'family_meals_frequency', 'pet_situation', 'living_situation', 'proximity_to_family',
    'family_support_needs', 'future_family_plans', 'parenting_challenges', 'family_health_concerns', 'inheritance_planning',
    'family_business', 'sibling_relationships', 'parent_relationship', 'in_law_relationships', 'family_boundaries',
    'family_dynamics', 'family_history', 'generational_patterns', 'family_strengths', 'family_growth_areas',
    'family_celebrations', 'family_crisis_management', 'intergenerational_relationships', 'family_roles_evolution', 'blended_family_dynamics',
    'family_legacy', 'chosen_family', 'family_time_quality', 'family_technology_use', 'family_financial_approach'
  ],
  identity: [
    'age', 'gender', 'pronouns', 'nationality', 'ethnicity',
    'languages_spoken', 'religion', 'political_leaning', 'education_level', 'personality_type',
    'core_values', 'life_philosophy', 'strengths', 'weaknesses', 'introvert_extrovert',
    'risk_tolerance', 'decision_making_style_general', 'conflict_style', 'communication_style_general', 'love_language',
    'attachment_style', 'morning_night_person', 'organization_style', 'perfectionism_level', 'spontaneity_vs_planning',
    'optimism_pessimism', 'social_battery', 'alone_time_needs', 'life_priorities', 'biggest_fear',
    'biggest_dream', 'role_models', 'life_changing_moment', 'proudest_moment', 'biggest_regret',
    'personal_mission_statement', 'identity_evolution', 'cultural_identity', 'gender_expression', 'sexuality',
    'neurodiversity', 'disability_identity', 'social_class_background', 'generational_identity', 'regional_identity',
    'professional_identity', 'creative_identity', 'spiritual_journey', 'values_conflicts', 'identity_labels'
  ],
  learning: [
    'learning_style', 'preferred_learning_format', 'learning_pace', 'retention_method', 'concentration_span',
    'best_learning_time', 'learning_environment', 'note_taking_style', 'learning_goals', 'subjects_of_interest',
    'formal_education', 'online_course_platforms', 'learning_budget', 'certifications_desired', 'mentor_preference',
    'group_vs_solo_learning', 'practice_frequency', 'learning_challenges', 'knowledge_application', 'skill_gaps',
    'languages_learning', 'reading_frequency', 'podcast_listening', 'documentary_watching', 'conference_attendance',
    'professional_development', 'teaching_others', 'learning_community', 'knowledge_sharing', 'curiosity_areas',
    'learning_motivation', 'failure_response', 'information_consumption', 'critical_thinking', 'learning_resources',
    'study_techniques', 'learning_accountability', 'interdisciplinary_learning', 'deep_vs_broad_learning', 'learning_milestones',
    'learning_projects', 'skill_mastery_time', 'learning_setbacks', 'knowledge_gaps_awareness', 'learning_reflection',
    'unlearning_willingness', 'experimental_learning', 'meta_learning', 'future_learning_goals', 'learning_legacy'
  ],
  relationships: [
    'relationship_status_detailed', 'relationship_length', 'relationship_goals', 'partnership_values', 'conflict_resolution_relationships',
    'quality_time_needs', 'independence_needs', 'communication_frequency', 'affection_style', 'date_night_frequency',
    'shared_interests', 'separate_interests', 'financial_approach', 'household_responsibilities', 'social_life_balance',
    'friend_circle_size', 'friendship_depth', 'friend_contact_frequency', 'social_activities', 'networking',
    'boundaries_relationships', 'trust_level', 'jealousy_tendency', 'commitment_readiness', 'past_relationship_impact',
    'relationship_deal_breakers', 'ideal_partner_qualities', 'relationship_challenges', 'support_expectations', 'growth_together',
    'relationship_patterns', 'emotional_intimacy_comfort', 'physical_intimacy_importance', 'relationship_role_models', 'friendship_maintenance',
    'long_distance_experience', 'relationship_communication_style', 'vulnerability_in_relationships', 'relationship_repair', 'social_connection_needs',
    'community_involvement', 'relationship_priorities', 'friendship_evolution', 'relationship_work_balance', 'healthy_relationship_definition',
    'relationship_red_flags', 'forgiveness_approach', 'relationship_expectations', 'conflict_avoidance_tendency', 'relationship_growth_areas'
  ],
  habits: [
    'morning_routine', 'evening_routine', 'wake_up_time', 'bedtime', 'screen_time_before_bed',
    'morning_beverage', 'breakfast_habit', 'commute_time', 'work_breaks', 'lunch_break',
    'afternoon_energy', 'exercise_timing', 'meal_prep_frequency', 'cleaning_frequency', 'laundry_frequency',
    'errands_timing', 'social_media_usage', 'news_consumption', 'hobbies_frequency', 'tv_streaming_time',
    'gaming_frequency', 'reading_time', 'meditation_practice', 'journaling', 'planning_frequency',
    'productivity_peak', 'procrastination_tendency', 'multitasking', 'habit_tracking', 'routine_flexibility',
    'sleep_consistency', 'nap_habits', 'caffeine_timing', 'alcohol_consumption_habits', 'digital_detox_frequency',
    'self_care_routine', 'gratitude_practice_habits', 'reflection_time', 'goal_review_frequency', 'habit_stacking',
    'trigger_habits', 'keystone_habits', 'bad_habits_awareness', 'habit_change_approach', 'routine_disruption_response',
    'weekend_routine_difference', 'seasonal_habit_changes', 'habit_accountability', 'environment_design', 'habit_rewards'
  ],
  sports_hobbies: [
    'sports_participation', 'exercise_frequency_sports', 'fitness_level', 'team_vs_individual_sports', 'outdoor_vs_indoor',
    'competitive_nature', 'sports_budget', 'equipment_owned', 'gym_membership', 'sports_goals_specific',
    'injury_history', 'recovery_needs_sports', 'sports_events_attended', 'favorite_sports_to_watch', 'hobbies_list',
    'hobby_time_per_week', 'hobby_budget', 'hobby_social_aspect', 'hobby_skill_level', 'hobby_learning_interest',
    'collections', 'crafts_diy', 'music_instruments', 'music_practice', 'creative_hobbies',
    'outdoor_activities', 'water_activities', 'winter_activities', 'adventure_level', 'relaxation_hobbies',
    'sports_role_models', 'athletic_background', 'sports_achievements', 'training_approach', 'sports_community',
    'workout_preferences', 'sports_motivation', 'hobby_evolution', 'hobby_investment', 'hobby_achievements',
    'hobby_community', 'hobby_sharing', 'hobby_income', 'seasonal_sports', 'sports_lifestyle_integration',
    'hobby_balance', 'future_sports_goals', 'future_hobby_goals', 'play_philosophy', 'hobby_exploration'
  ],
  technology: [
    'tech_comfort_level', 'primary_devices', 'phone_model', 'computer_os', 'tablet_usage',
    'smartwatch', 'smart_home_devices', 'gaming_devices', 'vr_ar_usage', 'tech_upgrade_frequency',
    'tech_budget', 'software_preferences', 'cloud_storage', 'password_manager', 'vpn_usage',
    'privacy_concerns', 'data_backup', 'social_media_platforms', 'messaging_apps', 'email_clients',
    'browser_preference', 'streaming_services', 'music_service', 'podcast_platform', 'productivity_apps',
    'ai_tools_used', 'automation_tools', 'tech_learning', 'screen_time_daily', 'digital_detox',
    'tech_frustrations', 'tech_wishlist', 'early_adopter', 'tech_support', 'online_shopping_frequency',
    'digital_organization', 'tech_dependencies', 'tech_minimalism', 'notification_management', 'digital_wellbeing',
    'tech_ethics', 'data_privacy_actions', 'tech_security_measures', 'software_subscriptions', 'tech_influence_on_life',
    'future_tech_interest', 'tech_skills_development', 'tech_work_tools', 'tech_entertainment', 'tech_socialization'
  ],
  housing_lifestyle: [
    'housing_type', 'home_ownership', 'living_space_size', 'bedrooms', 'bathrooms',
    'outdoor_space', 'home_office', 'parking', 'neighborhood_type', 'commute_to_work',
    'walkability_score', 'public_transport_access', 'nearby_amenities', 'noise_tolerance', 'natural_light_importance',
    'interior_style', 'furniture_budget', 'plant_ownership', 'home_maintenance', 'cleaning_service',
    'home_renovations', 'smart_home_level', 'energy_efficiency', 'sustainability_home', 'pet_friendly',
    'guest_accommodation', 'storage_situation', 'home_security', 'utilities_budget', 'rent_mortgage',
    'move_frequency', 'ideal_location', 'climate_preference_housing', 'future_housing_plans', 'home_value',
    'community_engagement', 'neighborhood_satisfaction', 'home_personalization', 'downsizing_upsizing_plans', 'second_home_interest',
    'relocation_considerations', 'home_priorities', 'space_usage', 'home_improvement_projects', 'roommate_preferences',
    'living_alone_preference', 'housing_budget_percentage', 'dream_home_description', 'housing_trade_offs', 'housing_satisfaction'
  ],
  environment: [
    'environmental_concern', 'climate_action', 'recycling_habits', 'composting', 'waste_reduction',
    'reusable_items', 'plastic_avoidance', 'energy_conservation', 'water_conservation', 'renewable_energy',
    'transportation_environmental', 'electric_vehicle', 'carbon_footprint_awareness', 'carbon_offsetting', 'sustainable_shopping',
    'secondhand_shopping', 'local_products', 'organic_products', 'minimalism', 'donation_frequency',
    'environmental_activism', 'conservation_efforts', 'wildlife_support', 'environmental_education', 'eco_friendly_home',
    'garden_growing', 'environmental_budget', 'green_certifications', 'environmental_goals', 'climate_anxiety',
    'environmental_community', 'sustainable_diet', 'meat_consumption', 'food_waste', 'packaging_preference',
    'eco_cleaning', 'natural_beauty', 'fast_fashion', 'clothing_lifecycle', 'digital_footprint',
    'paperless', 'environmental_influence', 'nature_connection', 'outdoor_recreation', 'environmental_inspiration',
    'green_technology', 'environmental_priorities', 'sustainable_travel', 'local_environment', 'environmental_future'
  ],
  philosophy: [
    'life_purpose', 'meaning_of_life', 'belief_system', 'existential_questions', 'mortality_perspective',
    'afterlife_beliefs', 'free_will', 'fate_vs_choice', 'good_vs_evil', 'human_nature',
    'truth_definition', 'knowledge_sources', 'reality_perception', 'consciousness_view', 'ethical_framework',
    'moral_compass', 'justice_definition', 'rights_responsibilities', 'individual_vs_collective', 'change_vs_tradition',
    'progress_definition', 'technology_philosophy', 'nature_vs_nurture', 'happiness_pursuit', 'suffering_meaning',
    'legacy_importance', 'influence_philosophy', 'contemplation_frequency', 'spiritual_practices', 'meditation_philosophy',
    'religious_affiliation', 'faith_role', 'doubt_comfort', 'absolute_truth', 'moral_relativism',
    'time_perception', 'identity_continuity', 'self_definition', 'authenticity', 'virtue_priority',
    'vice_awareness', 'rationality_emotion', 'knowledge_limits', 'beauty_definition', 'art_purpose',
    'language_thought', 'mind_body', 'artificial_intelligence', 'simulation_theory', 'philosophical_reading'
  ],
  politics: [
    'political_engagement', 'political_ideology', 'voting_frequency', 'news_sources_politics', 'political_discussion',
    'activism_participation', 'causes_supported', 'charity_donations', 'volunteering', 'social_justice',
    'economic_views', 'healthcare_views', 'education_views', 'environmental_policy', 'immigration_views',
    'foreign_policy', 'government_role', 'taxation_views', 'regulation_views', 'civil_liberties',
    'gun_control', 'abortion_rights', 'lgbtq_rights', 'racial_justice', 'gender_equality',
    'workers_rights', 'corporate_responsibility', 'media_trust', 'fact_checking', 'political_hope',
    'democratic_participation', 'political_party', 'bipartisanship', 'political_compromise', 'grassroots_movements',
    'electoral_system', 'campaign_finance', 'term_limits', 'voting_rights', 'criminal_justice',
    'police_reform', 'drug_policy', 'privacy_rights', 'surveillance', 'whistleblowers',
    'international_aid', 'military_spending', 'nato_alliances', 'united_nations', 'political_influence'
  ],
  future: [
    'future_outlook', 'one_year_goals', 'five_year_goals', 'ten_year_goals', 'career_aspirations',
    'financial_goals', 'savings_target', 'retirement_plans', 'retirement_age_target', 'investment_strategy',
    'real_estate_goals', 'education_future', 'skill_development', 'health_goals_future', 'fitness_goals_future',
    'weight_goals', 'relationship_future', 'family_future', 'children_future', 'relocation_plans',
    'travel_bucket_list', 'adventure_goals', 'creative_projects', 'business_ideas', 'side_hustle',
    'passive_income', 'philanthropy', 'legacy_goals', 'bucket_list', 'fears_about_future',
    'excitement_about_future', 'personal_growth', 'habits_to_build', 'habits_to_break', 'learning_goals',
    'language_learning', 'hobbies_future', 'social_goals', 'community_involvement', 'professional_network',
    'work_life_balance', 'lifestyle_changes', 'sustainability_future', 'minimalism_future', 'time_management',
    'technology_adoption', 'digital_detox', 'mental_health_future', 'spiritual_journey', 'challenges_anticipated'
  ]
};

// Generate template structure
function generateTemplate(categoryKey, fields) {
  const template = {};

  // Group fields by logical subcategories (simplified - using single group per category)
  const subcategoryName = `${categoryKey}_profile`;
  template[subcategoryName] = {};

  fields.forEach(field => {
    template[subcategoryName][field] = '';
  });

  return template;
}

// Update all templates
async function updateAllTemplates() {
  const templateDir = path.join(__dirname, 'templates');

  console.log('🔄 Updating all JSON templates with 50 questions per category...\n');

  let successCount = 0;
  let failCount = 0;

  for (const [categoryKey, fields] of Object.entries(CATEGORY_FIELDS)) {
    try {
      const template = generateTemplate(categoryKey, fields);
      const fileName = `${categoryKey}_context_profile_template.json`;
      const filePath = path.join(templateDir, fileName);

      fs.writeFileSync(filePath, JSON.stringify(template, null, 2), 'utf8');

      console.log(`✅ ${categoryKey.toUpperCase()}: ${fields.length} questions`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to update ${categoryKey}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ ${successCount} templates updated`);
  console.log(`   ❌ ${failCount} templates failed`);
  console.log(`   📝 Total fields: ${Object.values(CATEGORY_FIELDS).reduce((sum, fields) => sum + fields.length, 0)}`);
}

updateAllTemplates().catch(console.error);
