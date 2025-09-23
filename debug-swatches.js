// Debug script for testing swatch removal
// Run this in browser console to test

function debugSwatchRemoval() {
    const picker = document.getElementById('colorPicker1');
    if (!picker) {
        console.error('No color picker found with ID colorPicker1');
        return;
    }

    console.log('=== Swatch Removal Debug ===');
    console.log('Custom swatches:', picker.customSwatches);

    // Find Pickr popup
    const pickrId = picker._pickrId;
    const pickrApp = document.querySelector(`.pickr-${pickrId}`);

    if (!pickrApp) {
        console.error('Pickr popup not found. Click on the color picker first.');
        return;
    }

    const swatchContainer = pickrApp.querySelector('.pcr-swatches');
    if (!swatchContainer) {
        console.error('No swatch container found');
        return;
    }

    const buttons = swatchContainer.querySelectorAll('.pcr-button');
    console.log(`Found ${buttons.length} swatch buttons`);

    // Check each button
    buttons.forEach((btn, i) => {
        const color = btn.style.getPropertyValue('--pcr-color');
        const hasCustomClass = btn.classList.contains('custom-swatch');
        const hasRemovableClass = btn.classList.contains('removable');
        console.log(`Button ${i}: color=${color}, custom=${hasCustomClass}, removable=${hasRemovableClass}`);
    });

    // Test marking swatches as removable
    console.log('\n=== Testing removable state ===');
    buttons.forEach(btn => {
        const btnColor = btn.style.getPropertyValue('--pcr-color');
        if (btnColor && picker.customSwatches.some(c => picker.colorsMatch(c, btnColor))) {
            console.log(`Marking ${btnColor} as custom and removable`);
            btn.classList.add('custom-swatch', 'removable');
        }
    });

    console.log('\n=== Manual removal test ===');
    console.log('To remove a swatch manually:');
    console.log('1. Hold CMD/Ctrl');
    console.log('2. Click on a custom swatch');
    console.log('3. Check if swatch is removed');

    // Add temporary click handler for testing
    const testHandler = (e) => {
        const btn = e.target.closest('.pcr-button');
        if (!btn) return;

        const color = btn.style.getPropertyValue('--pcr-color');
        const isCmd = e.metaKey || e.ctrlKey;
        console.log(`[TEST CLICK] color=${color}, cmd=${isCmd}`);

        if (isCmd && btn.classList.contains('custom-swatch')) {
            console.log('[TEST] Would remove swatch:', color);
            e.preventDefault();
            e.stopPropagation();
        }
    };

    swatchContainer.addEventListener('click', testHandler, true);
    console.log('Test handler attached. Click swatches to test.');

    // Return cleanup function
    return () => {
        swatchContainer.removeEventListener('click', testHandler, true);
        console.log('Test handler removed');
    };
}

// Run the debug function
debugSwatchRemoval();