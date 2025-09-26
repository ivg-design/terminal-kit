#!/usr/bin/env node

import https from 'https';
import fs from 'fs';

// Download a fill variant icon
function downloadFillIcon(iconName) {
  return new Promise((resolve) => {
    const url = `https://raw.githubusercontent.com/phosphor-icons/core/main/raw/fill/${iconName}-fill.svg`;

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        resolve(null);
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        // Extract all paths from the SVG and combine them
        const paths = [];
        const pathRegex = /<path[^>]*d="([^"]*)"[^>]*\/?>/g;
        let match;
        while ((match = pathRegex.exec(data)) !== null) {
          paths.push(match[1]);
        }
        resolve(paths.length > 0 ? paths.join(' ') : null);
      });
    }).on('error', () => {
      resolve(null);
    });
  });
}

async function main() {
  console.log('Fixing Phosphor Icons - Processing ALL icons\n');

  // Read the backup file
  const backupFile = fs.readFileSync('js/utils/phosphor-icons.backup.js', 'utf8');

  // More flexible regex to capture all icon formats
  const iconRegex = /export const (\w+)Icon =\s*'(<svg[^']*<\/svg>)';/gs;
  const icons = [];
  let match;

  while ((match = iconRegex.exec(backupFile)) !== null) {
    const name = match[1];
    const svgContent = match[2];

    // Extract all paths from the SVG
    const paths = [];
    const pathRegex = /<path[^>]*d="([^"]*)"[^>]*\/?>/g;
    let pathMatch;
    while ((pathMatch = pathRegex.exec(svgContent)) !== null) {
      paths.push(pathMatch[1]);
    }

    icons.push({
      name: name,
      svgContent: svgContent,
      regularPath: paths.join(' ')  // Combine all paths
    });
  }

  console.log(`Found ${icons.length} icons in backup file\n`);
  console.log('Downloading fill variants...\n');

  // Download fill variants
  let downloadCount = 0;
  for (const icon of icons) {
    const kebabName = icon.name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
    process.stdout.write(`[${++downloadCount}/${icons.length}] ${icon.name} (${kebabName})...`);

    const fillPath = await downloadFillIcon(kebabName);
    icon.fillPath = fillPath || icon.regularPath;
    process.stdout.write(fillPath ? ' ✓\n' : ' (using regular)\n');
  }

  // Generate the new file content
  let newContent = `/**
 * Phosphor Icons Library - Regular and Fill Variants
 * Generated from https://github.com/phosphor-icons/core
 * Total icons: ${icons.length}
 */

`;

  // Add original icons in their exact format
  for (const icon of icons) {
    newContent += `export const ${icon.name}Icon = '${icon.svgContent}';\n`;
  }

  // Add fill variants
  newContent += `
// Fill variants
`;
  for (const icon of icons) {
    // For fill variants, create a clean SVG with just the path
    const fillSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor"><path d="${icon.fillPath}"/></svg>`;
    newContent += `export const ${icon.name}IconFill = '${fillSvg}';\n`;
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

  console.log('\n✅ Successfully updated phosphor-icons.js with ALL icons and fill variants!');
  console.log(`Total icons: ${icons.length} (each with regular and fill variants)`);
}

main().catch(console.error);