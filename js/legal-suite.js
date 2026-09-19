/**
 * RoboYuwa Legal & Policy Suite Interactive Enhancements
 * - ScrollSpy for Table of Contents
 * - Smooth anchor navigation with sticky navbar offset
 * - Clipboard copy with toast notification
 * - Print trigger
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth scrolling for TOC links with header offset
    const tocLinks = document.querySelectorAll('.legal-toc-link');
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    const navHeight = 110; // Combined height of sticky navs
                    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    tocLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // 2. ScrollSpy via IntersectionObserver
    const sections = document.querySelectorAll('.legal-card[id]');
    if (sections.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    tocLinks.forEach(link => {
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(sec => observer.observe(sec));
    }
});

/**
 * Trigger print dialog
 */
function printPolicyDocument() {
    window.print();
}

/**
 * Copy document link to clipboard and show toast
 */
function copyPolicyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showLegalToast('Policy document link copied to clipboard!');
    }).catch(() => {
        // Fallback
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = url;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        showLegalToast('Policy document link copied to clipboard!');
    });
}

/**
 * Show temporary feedback toast
 */
function showLegalToast(message) {
    let toast = document.getElementById('legalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'legalToast';
        toast.className = 'legal-toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span id="legalToastMsg"></span>`;
        document.body.appendChild(toast);
    }
    const msgEl = document.getElementById('legalToastMsg');
    if (msgEl) msgEl.textContent = message;
    
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3200);
}
