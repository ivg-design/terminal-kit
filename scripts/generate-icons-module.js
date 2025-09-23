#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory containing SVG files
const iconsDir = path.join(__dirname, 'assets/icons/phosphor');
const outputFile = path.join(__dirname, 'js/utils/phosphor-icons.js');

// Function to convert kebab-case to camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Function to clean and format SVG content
function cleanSvg(svgContent) {
  // Remove newlines and extra spaces, escape quotes
  return svgContent
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/'/g, "\\'")
    .trim();
}

// Read all SVG files
const svgFiles = fs.readdirSync(iconsDir).filter(file => file.endsWith('.svg'));

// Generate the module content
let moduleContent = `/**
 * Phosphor Icons Module
 * Auto-generated from SVG files
 * 
 * Usage:
 * import { playIcon, pauseIcon, folderIcon } from './phosphor-icons.js';
 * 
 * To use in HTML:
 * element.innerHTML = playIcon;
 * 
 * To customize size/color:
 * element.innerHTML = createIcon(playIcon, { size: 24, color: '#00ff41' });
 */

`;

// Process each SVG file
const iconExports = [];

svgFiles.forEach(file => {
  const fileName = path.basename(file, '.svg');
  const variableName = toCamelCase(fileName) + 'Icon';
  const svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf8');
  const cleanedSvg = cleanSvg(svgContent);
  
  moduleContent += `// ${fileName}\n`;
  moduleContent += `export const ${variableName} = '${cleanedSvg}';\n\n`;
  iconExports.push(variableName);
});

// Add a default export with all icons as an object
moduleContent += `// All icons as an object\nexport const phosphorIcons = {\n`;
svgFiles.forEach(file => {
  const fileName = path.basename(file, '.svg');
  const variableName = toCamelCase(fileName) + 'Icon';
  const camelName = toCamelCase(fileName);
  moduleContent += `  ${camelName}: ${variableName},\n`;
});
moduleContent += `};\n\n`;

// Add helper function to create icon element
moduleContent += `/**
 * Helper function to create an icon element
 * @param {string} iconSvg - The SVG string
 * @param {Object} options - Options for customization
 * @returns {string} - The customized SVG string
 */
export function createIcon(iconSvg, options = {}) {
  let svg = iconSvg;
  
  // Apply size
  if (options.size) {
    svg = svg.replace('viewBox', \`width="\${options.size}" height="\${options.size}" viewBox\`);
  }
  
  // Apply color
  if (options.color) {
    svg = svg.replace(/currentColor/g, options.color);
  }
  
  // Apply class
  if (options.className) {
    svg = svg.replace('<svg', \`<svg class="\${options.className}"\`);
  }
  
  return svg;
}

/**
 * Get icon by name
 * @param {string} name - Icon name (camelCase or kebab-case)
 * @returns {string|null} - The SVG string or null if not found
 */
export function getIcon(name) {
  // Convert kebab-case to camelCase if needed
  const camelName = name.includes('-') ? name.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) : name;
  return phosphorIcons[camelName] || null;
}

// Export icon names for reference
export const iconNames = ${JSON.stringify(svgFiles.map(f => path.basename(f, '.svg')), null, 2).replace(/\n/g, '\n')};
`;

// Ensure the output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the module file
fs.writeFileSync(outputFile, moduleContent);

console.log(`✅ Icons module generated successfully!`);
console.log(`📁 Output: ${outputFile}`);
console.log(`📊 Total icons: ${svgFiles.length}`);
console.log(`\nExample usage:`);
console.log(`  import { playIcon, pauseIcon } from './js/utils/phosphor-icons.js';`);
console.log(`  element.innerHTML = playIcon;`);