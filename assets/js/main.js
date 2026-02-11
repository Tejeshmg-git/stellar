/**
 * Stellar Template - Main UI Logic
 * Handles: Dark/Light Mode, RTL Toggle, Mobile Menu, and Modern Animations
 * Compliant with Internationalization Best Practices
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Navigation Active State Handling ---
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-list a, .admin-nav a, .sidebar-nav a');

    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === './')) {
            link.classList.add('active');
        } else {
            // Remove hardcoded active classes if they don't match
            link.classList.remove('active');
        }
    });

    // --- 1. Theme Toggle (Dark/Light) ---
    const themeToggles = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    const updateThemeIcons = (theme) => {
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    };

    // Initialize Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (currentTheme === 'dark' || (!currentTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcons('dark');
    }

    themeToggles.forEach(toggle => {
        toggle?.addEventListener('click', () => {
            toggle.classList.add('spinning');
            setTimeout(() => toggle.classList.remove('spinning'), 300);

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
        });
    });

    // --- 2. RTL Toggle & Layout Direction ---
    const rtlToggles = document.querySelectorAll('#rtl-toggle, #mobile-rtl-toggle');
    const currentDir = localStorage.getItem('dir') || 'ltr';
    const currentLang = localStorage.getItem('lang') || 'en';

    // Initialize Direction
    document.documentElement.setAttribute('dir', currentDir);
    document.documentElement.setAttribute('lang', currentLang);

    rtlToggles.forEach(toggle => {
        toggle?.addEventListener('click', () => {
            toggle.classList.add('spinning');
            setTimeout(() => toggle.classList.remove('spinning'), 300);

            const isCurrentlyLTR = document.documentElement.getAttribute('dir') === 'ltr';
            const newDir = isCurrentlyLTR ? 'rtl' : 'ltr';
            const newLang = isCurrentlyLTR ? 'ar' : 'en';

            document.documentElement.setAttribute('dir', newDir);
            document.documentElement.setAttribute('lang', newLang);
            localStorage.setItem('dir', newDir);
            localStorage.setItem('lang', newLang);

            // Close mobile menu if clicked from there
            if (toggle.id === 'mobile-rtl-toggle') {
                document.getElementById('mobile-overlay')?.classList.remove('open');
                document.querySelector('.hamburger')?.classList.remove('active');
                document.body.style.overflow = 'auto';
            }

            console.log(`Layout: ${newDir}`);
            window.dispatchEvent(new Event('resize'));
        });
    });

    // --- 3. Mobile Menu Overlay ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-overlay');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
        });

        // Close menu when clicking links (one-time initialization)
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });

        // Close mobile menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // --- 4. Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return; // Ignore placeholder links

            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 90;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            } catch (err) {
                console.warn('Scroll target invalid:', href);
            }
        });
    });

    // --- 5. Image State Management (Skeletons & Transitions) ---
    const handleImageStates = () => {
        document.querySelectorAll('img').forEach(img => {
            const wrapper = img.parentElement;
            if (!wrapper) return;

            const onImageSuccess = () => {
                wrapper.classList.remove('skeleton');
                img.classList.remove('img-loading');
                img.classList.add('img-loaded');
            };

            const onImageError = () => {
                wrapper.classList.remove('skeleton');
                img.classList.remove('img-loading');
                img.classList.add('img-error');
                wrapper.style.backgroundColor = 'var(--surface)';
            };

            if (img.complete) {
                if (img.naturalWidth !== 0) onImageSuccess();
                else onImageError();
            } else {
                wrapper.classList.add('skeleton');
                img.classList.add('img-loading');
                img.addEventListener('load', onImageSuccess);
                img.addEventListener('error', onImageError);
            }
        });
    };

    handleImageStates();

    // --- 6. Form Handling Interactivity ---
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]') || contactForm.querySelector('.btn');
        if (!btn) return;

        const originalText = btn.innerText;
        btn.innerText = 'Transmitting...';
        btn.disabled = true;

        setTimeout(() => {
            alert('Transmission Successful! Our astronomers will contact you soon.');
            btn.innerText = originalText;
            btn.disabled = false;
            contactForm.reset();
        }, 1500);
    });
    // --- 7. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    });
});

