/**
 * Debounce utility - delays function execution until after wait time
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 *
 * @example
 * const debouncedResize = debounce(() => console.log('resized'), 300);
 * window.addEventListener('resize', debouncedResize);
 */
export function debounce(func, wait = 100) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default debounce;