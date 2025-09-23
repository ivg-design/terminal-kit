import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, 'assets', 'icons');
const outputFile = path.join(__dirname, 'js', 'utils', 'phosphor-icons.js');

// Read all SVG files
const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));

// Generate the module
let output = `/**
 * Phosphor Icons Module
 * Auto-generated from SVG files
 * Total icons: ${files.length}
 */

`;

const iconExports = [];

files.forEach(file => {
  const name = file.replace('.svg', '');
  const camelName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const svgContent = fs.readFileSync(path.join(iconsDir, file), 'utf8')
    .replace(/\n/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  output += `export const ${camelName}Icon = '${svgContent}';\n`;
  iconExports.push(camelName + 'Icon');
});

// Add default export
output += `
// Default export with all icons
export default {
  ${iconExports.join(',\n  ')}
};
`;

fs.writeFileSync(outputFile, output);
console.log(`Generated ${files.length} icons in phosphor-icons.js`);