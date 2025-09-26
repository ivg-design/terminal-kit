#!/usr/bin/env node

import https from 'https';
import fs from 'fs';
import path from 'path';

// List of icons extracted from phosphor-icons.js
const iconList = [
  'arrows-clockwise',
  'backspace',
  'barcode',
  'binary',
  'blueprint',
  'bounding-box',
  'briefcase',
  'caret-down',
  'caret-right',
  'caret-up',
  'check-circle',
  'check',
  'code-block',
  'code',
  'dots-three-circle-vertical',
  'dots-three-circle',
  'download',
  'drop-slash',
  'eye-closed',
  'eye-slash',
  'eye',
  'faders-horizontal',
  'faders',
  'file',
  'floppy-disk',
  'folder-minus',
  'folder-open',
  'folder-plus',
  'folder-simple-user',
  'folder-star',
  'folder-user',
  'folder',
  'frame-corners',
  'funnel',
  'gauge',
  'gear-six',
  'info',
  'keyboard',
  'link-break',
  'link',
  'magnifying-glass-minus',
  'magnifying-glass-plus',
  'magnifying-glass',
  'map-pin-simple',
  'minus-circle',
  'minus-square',
  'note-blank',
  'note-pencil',
  'package',
  'paint-bucket',
  'palette',
  'pause',
  'play',
  'plus-circle',
  'plus-square',
  'prohibit',
  'push-pin',
  'rectangle-dashed',
  'selection',
  'sliders-horizontal',
  'sliders',
  'speaker-high',
  'speaker-slash',
  'stack',
  'table',
  'tag-chevron',
  'tag',
  'tray-arrow-down',
  'tray-arrow-up',
  'tree-view',
  'upload',
  'user-circle',
  'wrench',
  'x',
  'number-square-one',
  'text-aa',
  'list',
  'toggle-left',
  'square',
  'sign-out',
  'house',
  'chart-bar',
  'app-window',
  'list-checks',
  'plus',
  'minus',
  'paste',
  'copy',
  'help',
  'phosphor-logo',
  'warning',
  'warning-diamond',
  'warning-circle',
  'check-square',
  'image',
  'artboard',
  'trash',
  'recycle'
];

// Some icons that are already filled variants
const alreadyFilledIcons = [
  'caret-down',
  'caret-right',
  'caret-up'
];

function downloadIcon(iconName, variant = 'regular') {
  return new Promise((resolve, reject) => {
    // For fill variants, icons are in raw/fill/ with -fill suffix
    const fileName = variant === 'fill' ? `${iconName}-fill` : iconName;
    const folderName = variant === 'fill' ? 'fill' : 'regular';
    const url = `https://raw.githubusercontent.com/phosphor-icons/core/main/raw/${folderName}/${fileName}.svg`;

    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (response.statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(`Failed to download ${iconName} (${variant}): ${response.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractSvgPath(svgContent) {
  // Extract just the path data from the SVG
  const pathMatch = svgContent.match(/<path[^>]*d="([^"]+)"/);
  if (pathMatch) {
    return pathMatch[1];
  }

  // Check for multiple paths (some icons have multiple path elements)
  const paths = svgContent.matchAll(/<path[^>]*d="([^"]+)"/g);
  const pathData = Array.from(paths).map(match => match[1]);

  if (pathData.length > 1) {
    // Return multiple paths as an array
    return pathData;
  }

  return null;
}

function camelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

async function downloadAllIcons() {
  const icons = {};
  let successCount = 0;
  let failCount = 0;

  console.log(`Starting download of ${iconList.length} icons...`);

  for (const iconName of iconList) {
    const iconKey = camelCase(iconName);

    try {
      // Special case for phosphor-logo
      const actualIconName = iconName === 'phosphor-logo' ? 'phosphor-logo' : iconName;

      // Download regular variant
      console.log(`Downloading ${iconName} (regular)...`);
      const regularSvg = await downloadIcon(actualIconName, 'regular');
      const regularPath = extractSvgPath(regularSvg);

      // Download fill variant (if it exists)
      let fillPath = regularPath; // Default to regular if fill doesn't exist

      // Skip fill variant for icons that are already filled
      if (!alreadyFilledIcons.includes(iconName)) {
        try {
          console.log(`Downloading ${iconName} (fill)...`);
          const fillSvg = await downloadIcon(actualIconName, 'fill');
          fillPath = extractSvgPath(fillSvg);
        } catch (err) {
          console.log(`  No fill variant for ${iconName}, using regular`);
        }
      }

      icons[iconKey] = {
        regular: regularPath,
        fill: fillPath
      };

      successCount++;
    } catch (err) {
      console.error(`Failed to download ${iconName}: ${err.message}`);
      failCount++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\nDownload complete: ${successCount} successful, ${failCount} failed`);

  return icons;
}

function generateIconsFile(icons) {
  let content = `// Phosphor Icons - Auto-generated
// Generated on ${new Date().toISOString()}
// Regular and Fill variants for each icon

/**
 * Creates an SVG icon string with the specified path data
 * @param {string|string[]} pathData - The SVG path data
 * @param {string} variant - The icon variant (regular or fill)
 * @returns {string} The complete SVG markup
 */
function createIcon(pathData, variant = 'regular') {
  const paths = Array.isArray(pathData) ? pathData : [pathData];
  const pathElements = paths.map(d => \`<path d="\${d}" />\`).join('');

  return \`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" fill="currentColor">
    \${pathElements}
  </svg>\`;
}

/**
 * Gets an icon with the specified variant
 * @param {string} name - The icon name
 * @param {string} variant - 'regular' or 'fill' (default: 'regular')
 * @returns {string} The SVG markup for the icon
 */
export function getIcon(name, variant = 'regular') {
  const icon = phosphorIcons[name];
  if (!icon) {
    console.warn(\`Icon "\${name}" not found\`);
    return '';
  }

  const pathData = icon[variant] || icon.regular;
  return createIcon(pathData, variant);
}

`;

  // Add individual icon exports
  for (const [iconKey, iconData] of Object.entries(icons)) {
    const iconName = `${iconKey}Icon`;

    // Convert path data to string literal
    const regularPath = JSON.stringify(iconData.regular);
    const fillPath = JSON.stringify(iconData.fill);

    content += `
// ${iconKey}
export const ${iconName} = createIcon(${regularPath}, 'regular');
export const ${iconName}Fill = createIcon(${fillPath}, 'fill');
`;
  }

  // Add the icons object
  content += `
// All icons object for easy access
export const phosphorIcons = {
`;

  for (const [iconKey, iconData] of Object.entries(icons)) {
    const regularPath = JSON.stringify(iconData.regular);
    const fillPath = JSON.stringify(iconData.fill);

    content += `  ${iconKey}: {
    regular: ${regularPath},
    fill: ${fillPath}
  },
`;
  }

  content += `};

// Export convenience functions for getting specific variants
export function getRegularIcon(name) {
  return getIcon(name, 'regular');
}

export function getFillIcon(name) {
  return getIcon(name, 'fill');
}

// Default export
export default phosphorIcons;
`;

  return content;
}

async function main() {
  try {
    console.log('Phosphor Icons Downloader\n');

    // Download all icons
    const icons = await downloadAllIcons();

    // Generate the new phosphor-icons.js file
    console.log('\nGenerating phosphor-icons.js file...');
    const fileContent = generateIconsFile(icons);

    // Save to file
    const outputPath = path.join(process.cwd(), 'js', 'utils', 'phosphor-icons-new.js');
    fs.writeFileSync(outputPath, fileContent, 'utf8');

    console.log(`✓ File saved to ${outputPath}`);
    console.log('\nYou can review the file and then rename it to phosphor-icons.js');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

// Run the script
main();