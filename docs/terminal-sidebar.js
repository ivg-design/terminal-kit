// Terminal Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Force TOC checkbox to be checked initially and after a delay
    function forceTocVisible() {
        const tocCheckbox = document.getElementById('__toc');
        if (tocCheckbox) {
            tocCheckbox.checked = true;
            // Trigger change event to make MkDocs update
            tocCheckbox.dispatchEvent(new Event('change'));
        }

        // Also force all TOC lists to be visible
        document.querySelectorAll('.md-nav--secondary .md-nav__list').forEach(list => {
            list.style.display = 'block';
            list.style.visibility = 'visible';
            list.style.height = 'auto';
            list.style.opacity = '1';
        });
    }

    // Run immediately
    forceTocVisible();

    // Run after a short delay in case MkDocs JS overrides it
    setTimeout(forceTocVisible, 100);
    setTimeout(forceTocVisible, 500);

    // === RIGHT TOC SIDEBAR FUNCTIONALITY ===
    const tocSidebar = document.querySelector('.md-sidebar--secondary');

    if (tocSidebar) {
        // Create TOC toggle button
        const tocToggle = document.createElement('button');
        tocToggle.className = 'md-toc-toggle';
        tocToggle.textContent = 'TOC';
        tocToggle.setAttribute('aria-label', 'Toggle table of contents');

        // Add toggle button to page
        document.body.appendChild(tocToggle);

        // Get saved state from localStorage
        const savedTocState = localStorage.getItem('tocSidebarOpen');
        const shouldOpenToc = savedTocState === 'true';

        // Functions to manage TOC sidebar
        function openTocSidebar() {
            tocSidebar.classList.add('md-sidebar--toc-open');
            tocToggle.classList.add('md-toc-toggle--active');
            const content = document.querySelector('.md-content');
            if (content) {
                content.classList.add('md-content--toc-open');
            }
            localStorage.setItem('tocSidebarOpen', 'true');
        }

        function closeTocSidebar() {
            tocSidebar.classList.remove('md-sidebar--toc-open');
            tocToggle.classList.remove('md-toc-toggle--active');
            const content = document.querySelector('.md-content');
            if (content) {
                content.classList.remove('md-content--toc-open');
            }
            localStorage.setItem('tocSidebarOpen', 'false');
        }

        function toggleTocSidebar() {
            const isOpen = tocSidebar.classList.contains('md-sidebar--toc-open');
            if (isOpen) {
                closeTocSidebar();
            } else {
                openTocSidebar();
            }
        }

        // Set initial state
        if (shouldOpenToc) {
            openTocSidebar();
        }

        // Event listener for TOC toggle
        tocToggle.addEventListener('click', toggleTocSidebar);

        // Keyboard shortcut for TOC (Ctrl/Cmd + .)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '.') {
                e.preventDefault();
                toggleTocSidebar();
            }
        });
    }

    // === LEFT NAVIGATION SIDEBAR FUNCTIONALITY ===
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'md-sidebar-toggle';
    toggleButton.textContent = 'MENU';
    toggleButton.setAttribute('aria-label', 'Toggle navigation');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'md-sidebar-overlay';

    // Create close button for sidebar
    const closeButton = document.createElement('button');
    closeButton.className = 'md-sidebar-close';
    closeButton.innerHTML = '×';
    closeButton.setAttribute('aria-label', 'Close navigation');

    // Get sidebar element
    const sidebar = document.querySelector('.md-sidebar--primary');

    if (sidebar) {
        // Add close button to sidebar
        const sidebarInner = sidebar.querySelector('.md-sidebar__scrollwrap');
        if (sidebarInner) {
            sidebarInner.insertBefore(closeButton, sidebarInner.firstChild);
        }

        // Add toggle button and overlay to page
        document.body.appendChild(toggleButton);
        document.body.appendChild(overlay);

        // Toggle sidebar function
        function toggleSidebar() {
            const isOpen = sidebar.classList.contains('md-sidebar--open');

            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }

        function openSidebar() {
            sidebar.classList.add('md-sidebar--open');
            overlay.classList.add('md-sidebar-overlay--visible');
            toggleButton.style.display = 'none';
            document.body.style.overflow = 'hidden';
        }

        function closeSidebar() {
            sidebar.classList.remove('md-sidebar--open');
            overlay.classList.remove('md-sidebar-overlay--visible');
            toggleButton.style.display = 'block';
            document.body.style.overflow = '';
        }

        // Event listeners
        toggleButton.addEventListener('click', toggleSidebar);
        closeButton.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);

        // Close sidebar when clicking on a link (for mobile)
        const navLinks = sidebar.querySelectorAll('.md-nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1220) {
                    closeSidebar();
                }
            });
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar.classList.contains('md-sidebar--open')) {
                closeSidebar();
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 1220) {
                    // On larger screens, keep sidebar closed by default
                    closeSidebar();
                }
            }, 250);
        });
    }

    // Add breadcrumb navigation
    const mainContent = document.querySelector('.md-content');
    if (mainContent) {
        const breadcrumb = document.createElement('div');
        breadcrumb.className = 'md-breadcrumb';
        breadcrumb.innerHTML = `
            <a href="http://localhost:3007/demos/index.html" class="breadcrumb-link">Component Gallery</a>
            <span class="breadcrumb-separator">/</span>
            <span class="breadcrumb-current">Documentation</span>
        `;
        breadcrumb.style.cssText = `
            padding: 10px 0;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--terminal-gray-dark);
            font-family: var(--font-mono);
            font-size: 11px;
            color: var(--terminal-green-dim);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        `;

        // Style the link
        const link = breadcrumb.querySelector('.breadcrumb-link');
        if (link) {
            link.style.cssText = `
                color: var(--terminal-green-dim);
                text-decoration: none;
                transition: color 0.3s ease;
            `;
            link.addEventListener('mouseenter', () => {
                link.style.color = 'var(--terminal-green)';
            });
            link.addEventListener('mouseleave', () => {
                link.style.color = 'var(--terminal-green-dim)';
            });
        }

        // Style the separator
        const separator = breadcrumb.querySelector('.breadcrumb-separator');
        if (separator) {
            separator.style.cssText = `
                margin: 0 8px;
                color: var(--terminal-gray-light);
            `;
        }

        // Insert at the beginning of content
        mainContent.insertBefore(breadcrumb, mainContent.firstChild);
    }

    // Add keyboard shortcut hint
    const shortcutHint = document.createElement('div');
    shortcutHint.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--terminal-gray-dark);
        border: 1px solid var(--terminal-green);
        color: var(--terminal-green);
        padding: 8px 12px;
        font-family: var(--font-mono);
        font-size: 10px;
        z-index: 100;
        opacity: 0.7;
        transition: opacity 0.3s;
    `;
    shortcutHint.innerHTML = 'Shortcuts: [Ctrl+.] TOC | [ESC] Close';
    document.body.appendChild(shortcutHint);

    // Hide hint after 5 seconds
    setTimeout(() => {
        shortcutHint.style.opacity = '0';
        setTimeout(() => shortcutHint.remove(), 300);
    }, 5000);
});