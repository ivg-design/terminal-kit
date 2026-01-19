# Archived Files

Legacy files archived on 2026-01-18 during Lit migration cleanup.

## Contents

| Directory | Description | Count |
|-----------|-------------|-------|
| `legacy-components/` | DSD-based components (pre-Lit) | 13 |
| `legacy-css/` | External CSS files (Lit uses internal styles) | 21 |
| `legacy-utils/` | Unused utility functions | 6 |
| `legacy-docs/` | Documentation for removed components | 5 |
| `legacy-demos/` | Demos for deprecated features | 5 |
| `legacy-examples/` | Example files for legacy utilities | 2 |
| `legacy-types/` | TypeScript defs for legacy utilities | 1 |

## Migration Notes

All active components are now Pure Lit 3.x with:
- Internal `static styles` blocks (no external CSS)
- Shadow DOM encapsulation
- ComponentLogger for logging
- Manifest auto-generation

## Restoration

If needed, files can be restored by moving them back to their original locations.
