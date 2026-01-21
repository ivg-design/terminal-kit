/**
 * Early accent color initialization to prevent FOUC
 * Include this script in <head> BEFORE any CSS loads
 * Usage: <script src="../js/utils/accent-init.js"></script>
 */
(function() {
  const STORAGE_KEY = 'terminal-kit-demo-accent';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  const hexToRgb = (hex) => {
    const cleaned = hex.replace('#', '');
    const full = cleaned.length === 3
      ? cleaned.split('').map(c => c + c).join('')
      : cleaned;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  };

  const rgbToHex = ({ r, g, b }) => {
    const toHex = v => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const rgbToHsl = ({ r, g, b }) => {
    const rn = r / 255, gn = g / 255, bn = b / 255;
    const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
      if (max === rn) h = ((gn - bn) / delta) % 6;
      else if (max === gn) h = (bn - rn) / delta + 2;
      else h = (rn - gn) / delta + 4;
      h *= 60;
      if (h < 0) h += 360;
    }
    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    return { h, s, l };
  };

  const hslToRgb = ({ h, s, l }) => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  const clamp = (v, min = 0, max = 1) => Math.min(Math.max(v, min), max);

  const rgb = hexToRgb(stored);
  const hsl = rgbToHsl(rgb);
  const dim = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l * 0.7) });
  const bright = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l * 1.2) });
  const dark = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l * 0.5) });

  const style = document.createElement('style');
  style.id = 'accent-init-styles';
  // Use !important to override CSS file defaults that load after this script
  style.textContent = `:root {
    --tk-green: ${stored} !important;
    --tk-green-dim: ${rgbToHex(dim)} !important;
    --tk-green-bright: ${rgbToHex(bright)} !important;
    --tk-green-dark: ${rgbToHex(dark)} !important;
    --tk-green-glow: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
    --terminal-green: ${stored} !important;
    --terminal-green-dim: ${rgbToHex(dim)} !important;
    --terminal-green-bright: ${rgbToHex(bright)} !important;
    --terminal-green-dark: ${rgbToHex(dark)} !important;
    --terminal-green-glow: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2) !important;
  }`;
  document.head.appendChild(style);
})();
