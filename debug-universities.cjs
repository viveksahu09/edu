// Debug script to check if universities data is loading correctly
const fs = require('fs');
const path = require('path');

// Read the universities file
const universitiesPath = path.join(__dirname, 'src/data/universities.ts');
const content = fs.readFileSync(universitiesPath, 'utf8');

// Extract the universities array
const universitiesMatch = content.match(/export const universities.*?=\s*(\[[\s\S]*?\]);/);
if (!universitiesMatch) {
    console.log('Could not find universities array');
    process.exit(1);
}

// Count universities by looking for id patterns
const universityIds = content.match(/^\s*id:\s*"\d+"/gm) || [];
console.log(`Found ${universityIds.length} university IDs:`);
universityIds.forEach(id => console.log(`  ${id.trim()}`));

// Also check for university names
const universityNames = content.match(/^\s*name:\s*"([^"]+)"/gm) || [];
console.log(`\nFound ${universityNames.length} university names:`);
universityNames.forEach(name => console.log(`  ${name.trim()}`));
