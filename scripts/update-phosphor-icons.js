#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

// Download a fill variant icon
function downloadFillIcon(iconName) {
  return new Promise((resolve) => {
    const url = `https://raw.githubusercontent.com/phosphor-icons/core/main/raw/fill/${iconName}-fill.svg`;

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        console.log(`  No fill variant for ${iconName}`);
        resolve(null);
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        // Extract the path from the SVG
        const pathMatch = data.match(/<path[^>]*d="([^"]*)"/);
        if (pathMatch) {
          resolve(pathMatch[1]);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

async function main() {
  console.log('Phosphor Icons - Adding Fill Variants\n');

  // Read the original file
  const originalFile = fs.readFileSync('js/utils/phosphor-icons.js', 'utf8');

  // Extract all icon names and their paths - Updated regex to match actual format with newline and tab
  const iconRegex = /export const (\w+)Icon =\n\t'<svg[^>]*><path d="([^"]*)"[^>]*><\/svg>';/g;
  const icons = [];
  let match;

  while ((match = iconRegex.exec(originalFile)) !== null) {
    icons.push({
      name: match[1],
      regularPath: match[2]
    });
  }

  console.log(`Found ${icons.length} icons in original file\n`);
  console.log('Downloading fill variants...\n');

  // Download fill variants
  for (const icon of icons) {
    const kebabName = icon.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    process.stdout.write(`Downloading ${icon.name} (${kebabName}) fill variant...`);
    const fillPath = await downloadFillIcon(kebabName);
    icon.fillPath = fillPath || icon.regularPath; // Use regular as fallback
    process.stdout.write(fillPath ? ' ✓\n' : ' (using regular)\n');
  }

  // Generate the new file content
  let newContent = `/**
 * Phosphor Icons Library - Regular and Fill Variants
 * Generated from https://github.com/phosphor-icons/core
 * Original icons preserved from terminal-kit
 */

// Individual icon exports - Regular variants (original format preserved)
`;

  // Add original regular icon exports in the original format
  for (const icon of icons) {
    newContent += `export const ${icon.name}Icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="${icon.regularPath}"/></svg>';\n`;
  }

  // Add fill variants
  newContent += `
// Fill variants
`;
  for (const icon of icons) {
    newContent += `export const ${icon.name}IconFill = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="${icon.fillPath}"/></svg>';\n`;
  }

  // Add helper functions
  newContent += `
// Helper functions for getting icons
export function getIcon(name, variant = 'regular') {
  const iconKey = name + 'Icon' + (variant === 'fill' ? 'Fill' : '');
  return phosphorIcons[iconKey] || phosphorIcons[name + 'Icon'];
}

export function getRegularIcon(name) {
  return getIcon(name, 'regular');
}

export function getFillIcon(name) {
  return getIcon(name, 'fill');
}

// All icons in an object for dynamic access
export const phosphorIcons = {
`;

  // Add to phosphorIcons object
  for (const icon of icons) {
    newContent += `  ${icon.name}Icon,\n`;
    newContent += `  ${icon.name}IconFill,\n`;
  }

  // Remove trailing comma and close object
  newContent = newContent.slice(0, -2) + '\n};\n\n';

  // Add default export
  newContent += 'export default phosphorIcons;\n';

  // Add backwards compatibility
  newContent += `
// Legacy support - createIcon function
export function createIcon(name, options = {}) {
  const { size = 24, color = 'currentColor', variant = 'regular' } = options;
  const iconSvg = getIcon(name, variant);
  if (!iconSvg) return null;

  // Create a wrapper element
  const wrapper = document.createElement('span');
  wrapper.innerHTML = iconSvg;
  const svg = wrapper.querySelector('svg');

  if (svg) {
    svg.setAttribute('width', size);
    svg.setAttribute('height', size);
    svg.style.fill = color;
  }

  return svg;
}

// Export icon names for compatibility
export const iconNames = [
`;

  for (const icon of icons) {
    newContent += `  '${icon.name}',\n`;
  }

  newContent = newContent.slice(0, -2) + '\n];\n';

  // Write the new file
  fs.writeFileSync('js/utils/phosphor-icons.js', newContent);

  console.log('\n✅ Successfully updated phosphor-icons.js with fill variants!');
  console.log(`Total icons: ${icons.length} (each with regular and fill variants)`);
}

main().catch(console.error);