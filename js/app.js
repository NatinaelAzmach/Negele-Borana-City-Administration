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
        const closeBtn = document.getElementById('close-mobile-menu');
        const mobileMenu = document.getElementById('mobile-menu');

        if (!menuBtn || !mobileMenu) return;

        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });

        // Close logic is inside the button which might be dynamically loaded or static
        document.addEventListener('click', (e) => {
            if (e.target.closest('#close-mobile-menu')) {
                mobileMenu.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });
    }

    /**
     * Dropdown Menu Logic
     */
    function initDropdowns() {
        // Use event delegation for dropdowns since they are critical
        document.addEventListener('click', function(e) {
            const toggle = e.target.closest('.dropdown-toggle');
            if (toggle) {
                const isMobile = window.innerWidth < 768 || toggle.closest('#mobile-menu');
                if (isMobile) {
                    e.preventDefault();
                    e.stopPropagation();
                    const parent = toggle.closest('.dropdown');
                    parent.classList.toggle('active');
                    
                    // Close others
                    document.querySelectorAll('.dropdown.active').forEach(other => {
                        if (other !== parent) other.classList.remove('active');
                    });
                }
            } else {
                // Close all on outside click
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
