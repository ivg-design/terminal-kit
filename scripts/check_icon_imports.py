#!/usr/bin/env python3
"""
Script to extract all icon imports from Terminal component files
and check which icons are being imported from phosphor-icons.js
"""

import os
import re
from pathlib import Path
import json

def extract_icon_imports(file_path):
    """Extract icon imports from a JavaScript component file"""
    icons = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        # Find import statements from phosphor-icons.js
        in_import = False
        import_text = ""
        
        for line in lines:
            # Start of phosphor-icons import
            if 'import' in line and 'from' not in line:
                in_import = True
                import_text = line
            elif in_import:
                import_text += line
                # End of import statement
                if 'phosphor-icons.js' in line:
                    in_import = False
                    # Now parse the import
                    match = re.search(r'\{([^}]+)\}', import_text, re.DOTALL)
                    if match:
                        icons_str = match.group(1)
                        # Clean up and split
                        icons_str = re.sub(r'\s+', ' ', icons_str)
                        icon_names = icons_str.split(',')
                        for icon in icon_names:
                            icon = icon.strip()
                            if icon and 'Icon' in icon:  # Only get icon names
                                icons.append(icon)
                    import_text = ""
            # Single line import
            elif 'import' in line and 'phosphor-icons.js' in line:
                match = re.search(r'\{([^}]+)\}', line)
                if match:
                    icons_str = match.group(1)
                    icon_names = icons_str.split(',')
                    for icon in icon_names:
                        icon = icon.strip()
                        if icon and 'Icon' in icon:
                            icons.append(icon)
    
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    return icons

def scan_components_directory(directory):
    """Scan all component files in the directory"""
    components_data = {}
    all_icons = set()
    
    # Get all .js files in the components directory
    component_files = list(Path(directory).glob('*.js'))
    
    for file_path in sorted(component_files):
        file_name = file_path.name
        
        # Extract icons from this component
        icons = extract_icon_imports(file_path)
        
        if icons:
            components_data[file_name] = icons
            all_icons.update(icons)
    
    return components_data, all_icons

def check_phosphor_icons_exports(phosphor_file):
    """Check which icons are actually exported from phosphor-icons.js"""
    exported_icons = set()
    
    try:
        with open(phosphor_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Pattern to match export const statements
        export_pattern = r'export\s+const\s+(\w+Icon)\s*='
        matches = re.findall(export_pattern, content)
        exported_icons.update(matches)
        
    except Exception as e:
        print(f"Error reading phosphor-icons.js: {e}")
    
    return exported_icons

def main():
    # Paths
    components_dir = Path('/Users/ivg/github/rive-preview/src-v2/js/components')
    phosphor_file = Path('/Users/ivg/github/rive-preview/src-v2/js/utils/phosphor-icons.js')
    
    print("=" * 80)
    print("ICON IMPORTS ANALYSIS FOR TERMINAL COMPONENTS")
    print("=" * 80)
    print()
    
    # Scan components
    components_data, all_imported_icons = scan_components_directory(components_dir)
    
    # Check phosphor exports
    exported_icons = check_phosphor_icons_exports(phosphor_file)
    
    # Display results by component
    print("📁 COMPONENTS AND THEIR ICON IMPORTS:")
    print("-" * 40)
    
    for component, icons in sorted(components_data.items()):
        if icons:
            print(f"\n{component}:")
            for icon in sorted(icons):
                status = "✅" if icon in exported_icons else "❌ MISSING"
                print(f"  - {icon} {status}")
    
    # Summary of all unique icons
    print("\n" + "=" * 80)
    print("📊 SUMMARY OF ALL UNIQUE ICONS:")
    print("-" * 40)
    
    all_imported_sorted = sorted(all_imported_icons)
    print(f"\nTotal unique icons imported: {len(all_imported_sorted)}")
    print("\nAll imported icons:")
    for icon in all_imported_sorted:
        status = "✅" if icon in exported_icons else "❌ MISSING"
        print(f"  - {icon} {status}")
    
    # Find missing icons
    missing_icons = all_imported_icons - exported_icons
    if missing_icons:
        print("\n" + "=" * 80)
        print("⚠️  MISSING ICONS IN phosphor-icons.js:")
        print("-" * 40)
        for icon in sorted(missing_icons):
            print(f"  - {icon}")
        print(f"\nTotal missing: {len(missing_icons)} icons")
    else:
        print("\n" + "=" * 80)
        print("✅ All imported icons are properly exported!")
    
    # Find unused exports (optional)
    unused_exports = exported_icons - all_imported_icons
    if unused_exports and len(unused_exports) < 20:  # Only show if reasonable number
        print("\n" + "=" * 80)
        print("📝 EXPORTED BUT NOT IMPORTED (in components):")
        print("-" * 40)
        for icon in sorted(unused_exports)[:10]:  # Show first 10
            print(f"  - {icon}")
        if len(unused_exports) > 10:
            print(f"  ... and {len(unused_exports) - 10} more")
    
    # Save results to JSON for programmatic use
    results = {
        'components': {k: list(v) for k, v in components_data.items()},
        'all_imported': list(all_imported_sorted),
        'exported': list(sorted(exported_icons)),
        'missing': list(sorted(missing_icons))
    }
    
    output_file = Path('/Users/ivg/github/rive-preview/src-v2/icon_analysis.json')
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to: {output_file}")

if __name__ == "__main__":
    main()