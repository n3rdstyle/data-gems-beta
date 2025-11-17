/**
 * Generate CSV from question-generator.js FIELD_MAPPINGS
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the question generator file
const questionGeneratorPath = path.join(__dirname, 'services', 'question-generator.js');
const content = fs.readFileSync(questionGeneratorPath, 'utf8');

// Extract FIELD_MAPPINGS object
const fieldMappingsMatch = content.match(/const FIELD_MAPPINGS = \{([\s\S]*?)\};/);
if (!fieldMappingsMatch) {
  console.error('Could not find FIELD_MAPPINGS');
  process.exit(1);
}

const fieldMappingsStr = fieldMappingsMatch[1];

// Parse category comments and questions
const lines = fieldMappingsStr.split('\n');
let currentCategory = '';
const questions = [];
let questionNumber = 1;

for (const line of lines) {
  // Check for category comment
  const categoryMatch = line.match(/\/\/ === (\w+[\w\s&]*?) \((\d+)\) ===/);
  if (categoryMatch) {
    currentCategory = categoryMatch[1];
    continue;
  }

  // Check for field mapping
  const fieldMatch = line.match(/^\s+(\w+):\s*'(.+?)',?\s*$/);
  if (fieldMatch && currentCategory) {
    const fieldName = fieldMatch[1];
    const question = fieldMatch[2].replace(/'/g, '\'');

    questions.push({
      nr: questionNumber++,
      question: question,
      category: currentCategory,
      fieldName: fieldName
    });
  }
}

// Generate CSV
const csvHeader = 'Nr,Question,Main Category,Field Name\n';
const csvRows = questions.map(q => {
  const questionEscaped = `"${q.question.replace(/"/g, '""')}"`;
  const categoryEscaped = `"${q.category}"`;
  const fieldNameEscaped = `"${q.fieldName}"`;
  return `${q.nr},${questionEscaped},${categoryEscaped},${fieldNameEscaped}`;
}).join('\n');

const csv = csvHeader + csvRows;

// Write CSV file
const outputPath = path.join(__dirname, 'complete-questions-1000.csv');
fs.writeFileSync(outputPath, csv, 'utf8');

console.log(`✅ Generated CSV with ${questions.length} questions`);
console.log(`📄 File: ${outputPath}`);

// Print category breakdown
const categoryCounts = {};
questions.forEach(q => {
  categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
});

console.log('\n📊 Category breakdown:');
Object.entries(categoryCounts).forEach(([category, count]) => {
  console.log(`   ${category}: ${count} questions`);
});
