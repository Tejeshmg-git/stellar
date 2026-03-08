/**
 * Stellar Template - Main UI Logic
 * Handles: Dark/Light Mode, RTL Toggle, Mobile Menu, and Modern Animations
 * Compliant with Internationalization Best Practices
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Navigation Active State Handling ---
    const normalizeUrl = (url) => {
        try {
            const cleanUrl = url.split(/[?#]/)[0];
            return cleanUrl.endsWith('/') ? cleanUrl + 'index.html' : cleanUrl;
        } catch (e) { return url; }
    };

    const currentUrl = normalizeUrl(window.location.href);
    const allLinks = document.querySelectorAll('.nav-link, .mobile-nav-list a, .admin-nav a, .sidebar-nav a, .mobile-dropdown-menu a, .dropdown-menu a');

    allLinks.forEach(link => {
        const rawHref = link.getAttribute('href');
        let isMatch = false;

        if (rawHref && rawHref !== '#' && !rawHref.startsWith('#')) {
            const linkUrl = normalizeUrl(link.href);
            if (linkUrl === currentUrl) isMatch = true;
        }

        if (isMatch) {
            link.classList.add('active');

            // Mobile Dropdown: Highlight parent trigger
            const parentMobileDropdown = link.closest('.mobile-dropdown-menu');
            if (parentMobileDropdown) {
                const trigger = parentMobileDropdown.previousElementSibling;
                if (trigger && trigger.classList.contains('mobile-dropdown-trigger')) {
                    trigger.classList.add('active');
                    parentMobileDropdown.classList.add('active');
                }
            }

            // Desktop Dropdown: Highlight parent nav-link
            const parentDesktopDropdown = link.closest('.dropdown-menu');
            if (parentDesktopDropdown) {
                const parentLi = parentDesktopDropdown.closest('.dropdown');
                if (parentLi) {
                    const trigger = parentLi.querySelector('.nav-link');
                    if (trigger) trigger.classList.add('active');
                }
            }
        } else {
            link.classList.remove('active');
        }
    });

    // --- 1. Theme Configuration (Dark Mode Default) ---
    const themeToggles = document.querySelectorAll('#theme-toggle, #mobile-theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Force dark as default

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update all toggle icons
        themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                // Sun icon for dark mode (to toggle to light), Moon for light mode
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    };

    // Initial Apply
    applyTheme(savedTheme);

    themeToggles.forEach(toggle => {
        toggle?.addEventListener('click', () => {
            toggle.classList.add('spinning');
            setTimeout(() => toggle.classList.remove('spinning'), 500);

            const activeTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
            applyTheme(targetTheme);
        });
    });

    // --- 2. Directional Logic (RTL/LTR) ---
    const rtlToggles = document.querySelectorAll('#rtl-toggle, #mobile-rtl-toggle');
    const savedDir = localStorage.getItem('dir') || 'ltr';
    const savedLang = localStorage.getItem('lang') || 'en';

    const applyDirection = (dir, lang) => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', lang);
        localStorage.setItem('dir', dir);
        localStorage.setItem('lang', lang);

        // Update Toggle Text if it's text-based, or handle specific RTL icons if needed
        rtlToggles.forEach(toggle => {
            const label = toggle.querySelector('.toggle-label');
            if (label) {
                label.innerText = dir === 'ltr' ? 'RTL' : 'LTR';
            }
        });

        window.dispatchEvent(new Event('resize'));
    };

    // Initial Apply
    applyDirection(savedDir, savedLang);

    rtlToggles.forEach(toggle => {
        toggle?.addEventListener('click', () => {
            toggle.classList.add('spinning');
            setTimeout(() => toggle.classList.remove('spinning'), 500);

            const activeDir = document.documentElement.getAttribute('dir');
            const targetDir = activeDir === 'ltr' ? 'rtl' : 'ltr';
            const targetLang = targetDir === 'rtl' ? 'ar' : 'en';

            applyDirection(targetDir, targetLang);

            // Close mobile menu if triggered from mobile toggle
            if (toggle.id === 'mobile-rtl-toggle') {
                document.getElementById('mobile-overlay')?.classList.remove('open');
                document.querySelector('.hamburger')?.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
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
        mobileMenu.querySelectorAll('a:not(.mobile-dropdown-trigger)').forEach(link => {
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
    // --- 8. Stats Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace('+', ''); // Handle if already has +

                // Lower inc to slow and higher to slow
                const inc = target / speed;

                if (count < target) {
                    // Add inc to count and output in counter
                    counter.innerText = Math.ceil(count + inc);
                    // Call function every ms
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCount();
        });
    };

    // Use Intersection Observer to trigger animation
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.disconnect(); // Only run once
            }
        });
    }, {
        threshold: 0.5
    });

    if (counters.length > 0) {
        // Observe the section containing counters, or the first counter
        const statsSection = document.querySelector('.stats-v2-section');
        if (statsSection) {
            counterObserver.observe(statsSection);
        } else {
            // Fallback if section class changes
            counterObserver.observe(counters[0]);
        }
    }
});

// --- 9. Scroll Top Functionality ---
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    scrollTopBtn.onclick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
}

// Mobile Dropdown Global Handler
function toggleMobileDropdown(element, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    const submenu = element.nextElementSibling;
    const isAlreadyActive = element.classList.contains('active');

    // Close other open dropdowns in the same menu
    const allTriggers = document.querySelectorAll('.mobile-dropdown-trigger');
    const allMenus = document.querySelectorAll('.mobile-dropdown-menu');

    allTriggers.forEach(t => t.classList.remove('active'));
    allMenus.forEach(m => m.classList.remove('active'));

    // If it wasn't active, open it
    if (!isAlreadyActive && submenu) {
        submenu.classList.add('active');
        element.classList.add('active');
    }
}

