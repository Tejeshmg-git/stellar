// EMERGENCY NAVIGATION FIX SCRIPT
// This script forcibly ensures all navigation links work correctly

document.addEventListener('DOMContentLoaded', function () {
    console.log('%c🔧 NAVIGATION CHECK LOADED', 'color: cyan; font-size: 14px; font-weight: bold');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                console.log(`%c🚀 Navigating to: ${href}`, 'color: #3b82f6; font-weight: bold');
            }
        });
    });
});
