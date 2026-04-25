/**
 * Negele Borana City Administration - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Navigation Features
    initThemeToggle();
    initMobileMenu();
    initDropdowns();
    initScrollToTop();
    initScrollAnimations();

    // 2. Component Loader (Footer)
    loadComponent('footer-placeholder', 'components/footer.html');

    /**
     * Loads an HTML component and injects it into a placeholder
     */
    async function loadComponent(placeholderId, filePath, callback) {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) return;

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            const html = await response.text();
            placeholder.innerHTML = html;
            if (callback) callback();
        } catch (error) {
            console.error('Error loading component:', error);
            // On local files, fetch might fail. We fallback or just ignore for non-critical parts like footer.
        }
    }

    /**
     * Theme Toggle Logic
     */
    function initThemeToggle() {
        const toggleBtn = document.getElementById('night-mode-toggle');
        const html = document.documentElement;

        if (!toggleBtn) return;

        const updateBtnIcon = (isDark) => {
            toggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        };

        // Set initial icon based on current state (applied by head script)
        updateBtnIcon(html.classList.contains('dark'));

        toggleBtn.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateBtnIcon(isDark);
        });
    }

    /**
     * Mobile Menu Logic
     */
    function initMobileMenu() {
        const menuBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!menuBtn || !mobileMenu) return;

        // Toggle the slide-down panel
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isHidden = mobileMenu.classList.contains('hidden');
            mobileMenu.classList.toggle('hidden', !isHidden);
            // Swap hamburger ↔ X icon
            menuBtn.innerHTML = isHidden
                ? `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                   </svg>`
                : `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                   </svg>`;
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') &&
                !mobileMenu.contains(e.target) &&
                !menuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                menuBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>`;
            }
        });

        // Inline dropdown toggles inside the mobile menu
        mobileMenu.addEventListener('click', (e) => {
            const toggle = e.target.closest('.mobile-dropdown-toggle');
            if (!toggle) return;
            e.preventDefault();

            const parent = toggle.closest('.mobile-dropdown');
            const isOpen = parent.classList.contains('open');

            // Close all open mobile dropdowns first
            mobileMenu.querySelectorAll('.mobile-dropdown.open').forEach(d => {
                d.classList.remove('open');
            });

            // Open the clicked one if it was closed
            if (!isOpen) {
                parent.classList.add('open');
            }
        });
    }

    /**
     * Dropdown Menu Logic (desktop — handled by CSS :hover; mobile handled in initMobileMenu)
     */
    function initDropdowns() {
        // Close desktop dropdowns on outside click (they use CSS hover, but .active class is a fallback)
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.active').forEach(d => d.classList.remove('active'));
            }
        });
    }

    /**
     * Scroll Animations (Intersection Observer)
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('section, .simple-card, .slide-in');
        revealElements.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    /**
     * Scroll to Top Logic
     */
    function initScrollToTop() {
        let scrollBtn = document.getElementById('scroll-top');
        if (!scrollBtn) {
            scrollBtn = document.createElement('div');
            scrollBtn.id = 'scroll-top';
            scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(scrollBtn);
        }

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
        });

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
