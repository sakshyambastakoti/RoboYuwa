// ============================================================
//  Rounded Favicon Generator (canvas clip with border-radius)
// ============================================================
(function applyRoundedFavicon() {
    const size = 64;
    const radius = size * 0.22; // ~22% corner radius — Apple-style squircle
    const imgSrc = document.querySelector('link[rel="icon"]')?.href;
    if (!imgSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Draw rounded clipping mask
        ctx.beginPath();
        ctx.moveTo(radius, 0);
        ctx.lineTo(size - radius, 0);
        ctx.quadraticCurveTo(size, 0, size, radius);
        ctx.lineTo(size, size - radius);
        ctx.quadraticCurveTo(size, size, size - radius, size);
        ctx.lineTo(radius, size);
        ctx.quadraticCurveTo(0, size, 0, size - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(img, 0, 0, size, size);

        // Replace favicon link
        let link = document.querySelector('link[rel="icon"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.type = 'image/png';
        link.href = canvas.toDataURL('image/png');
    };
    img.onerror = () => {}; // Silently fail if image can't load
    img.src = imgSrc;
})();

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle for Mobile
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a.nav-item');
    const sections = document.querySelectorAll('section[id]');
    const header = document.getElementById('header');

    const closeMobileMenu = () => {
        if (navLinks && toggleBtn && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            toggleBtn.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('mobile-menu-open');
        }
    };

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
            navLinks.classList.toggle('active');
            toggleBtn.classList.toggle('active');
            document.body.classList.toggle('mobile-menu-open', !isExpanded);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });

        // Close on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 991) {
                closeMobileMenu();
            }
        });
    }

    // Close mobile menu when clicking any nav link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Header Scroll Effect & Parallax
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 30) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Subtle parallax depth on active hero background image
        const activeHeroImage = document.querySelector('.hero-slide.active .hero-bg img');
        if (activeHeroImage && window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.12;
            activeHeroImage.style.transform = `scale(1.02) translateY(${offset}px)`;
        }
    });

    // ==========================================================================
    // Hero Slider Carousel (Cinematic - Progress Bar, Dot Nav, Swipe & Ken Burns)
    // ==========================================================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');
    const impactLabel = document.getElementById('impactCardLabel');
    const impactValue = document.getElementById('impactCardValue');
    const heroSlider = document.getElementById('heroSlider');
    const progressBar = document.getElementById('heroProgressBar');
    const heroDots = document.querySelectorAll('.hero-dot');

    let currentSlide = 0;
    let slideTimer = null;
    const slideDuration = 6500; // 6.5s auto advance

    // -- Progress bar helpers --
    function resetProgressBar() {
        if (!progressBar) return;
        progressBar.classList.remove('animating');
        progressBar.style.width = '0%';
    }

    function startProgressBar() {
        if (!progressBar) return;
        // Force reflow so the width reset registers
        void progressBar.offsetWidth;
        progressBar.classList.add('animating');
    }

    // -- Dot nav helpers --
    function updateDots(index) {
        heroDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function showSlide(index) {
        if (!heroSlides.length) return;

        const prevSlideIndex = currentSlide;
        currentSlide = (index + heroSlides.length) % heroSlides.length;

        heroSlides.forEach((slide, idx) => {
            const isActive = idx === currentSlide;
            const wasActive = idx === prevSlideIndex;

            // Add exiting class to old slide for smooth fade-out
            if (wasActive && idx !== currentSlide) {
                slide.classList.add('exiting');
                setTimeout(() => slide.classList.remove('exiting'), 1000);
            }

            slide.classList.toggle('active', isActive);

            if (isActive) {
                // Re-trigger text animations
                const animatedElements = slide.querySelectorAll('.hero-eyebrow, .title-line, .hero-desc, .hero-actions');
                animatedElements.forEach((el) => {
                    el.style.animation = 'none';
                    void el.offsetWidth;
                    el.style.animation = '';
                });

                // Update Impact Card stats
                const statLabel = slide.getAttribute('data-stat-label');
                const statVal = slide.getAttribute('data-stat-val');
                if (impactLabel && statLabel) {
                    impactLabel.style.opacity = '0';
                    setTimeout(() => {
                        impactLabel.textContent = statLabel;
                        impactLabel.style.opacity = '1';
                    }, 150);
                }
                if (impactValue && statVal) {
                    impactValue.style.opacity = '0';
                    setTimeout(() => {
                        impactValue.textContent = statVal;
                        impactValue.style.opacity = '1';
                    }, 150);
                }
            }
        });

        // Sync dot indicators
        updateDots(currentSlide);

        // Restart progress bar
        resetProgressBar();
        setTimeout(startProgressBar, 30);
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startAutoSlide() {
        stopAutoSlide();
        slideTimer = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
        if (slideTimer) {
            clearInterval(slideTimer);
            slideTimer = null;
        }
    }

    if (heroSlides.length > 1) {
        // Arrow buttons
        if (sliderNextBtn) sliderNextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
        if (sliderPrevBtn) sliderPrevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

        // Dot nav click
        heroDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const target = parseInt(dot.getAttribute('data-dot'), 10);
                showSlide(target);
                startAutoSlide();
            });
        });

        // Pause on hover
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', () => { stopAutoSlide(); resetProgressBar(); });
            heroSlider.addEventListener('mouseleave', () => { startAutoSlide(); startProgressBar(); });
            heroSlider.addEventListener('touchstart', stopAutoSlide, { passive: true });
        }

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        if (heroSlider) {
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    diff > 0 ? nextSlide() : prevSlide();
                    startAutoSlide();
                }
            }, { passive: true });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (window.scrollY < window.innerHeight) {
                if (e.key === 'ArrowRight') { nextSlide(); startAutoSlide(); }
                else if (e.key === 'ArrowLeft') { prevSlide(); startAutoSlide(); }
            }
        });

        // Kick off
        showSlide(0);
        startAutoSlide();
    }

    // ==========================================================================
    // Interactive Video Showcase Modal
    // ==========================================================================
    const videoModal = document.getElementById('videoModal');
    const closeVideoModal = document.getElementById('closeVideoModal');
    const videoIframe = document.getElementById('videoIframe');
    const videoButtons = document.querySelectorAll('.hero-video-btn');

    const defaultVideoSrc = 'https://www.youtube-nocookie.com/embed/gZ_S9hL9tYk?autoplay=1';

    function openModalVideo() {
        if (videoModal) {
            stopAutoSlide();
            videoModal.classList.add('active');
            videoModal.setAttribute('aria-hidden', 'false');
            if (videoIframe) {
                videoIframe.src = defaultVideoSrc;
            }
        }
    }

    function hideModalVideo() {
        if (videoModal) {
            videoModal.classList.remove('active');
            videoModal.setAttribute('aria-hidden', 'true');
            if (videoIframe) {
                videoIframe.src = '';
            }
            startAutoSlide();
        }
    }

    videoButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalVideo();
        });
    });

    if (closeVideoModal) {
        closeVideoModal.addEventListener('click', hideModalVideo);
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                hideModalVideo();
            }
        });
    }

    // ==========================================================================
    // Quick Search Modal
    // ==========================================================================
    const searchModal = document.getElementById('searchModal');
    const openSearchBtn = document.getElementById('openSearchBtn');
    const closeSearchModal = document.getElementById('closeSearchModal');
    const siteSearchInput = document.getElementById('siteSearchInput');

    function openSearch() {
        if (searchModal) {
            searchModal.classList.add('active');
            searchModal.setAttribute('aria-hidden', 'false');
            setTimeout(() => {
                siteSearchInput?.focus();
            }, 100);
        }
    }

    function hideSearch() {
        if (searchModal) {
            searchModal.classList.remove('active');
            searchModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (openSearchBtn) {
        openSearchBtn.addEventListener('click', openSearch);
    }

    if (closeSearchModal) {
        closeSearchModal.addEventListener('click', hideSearch);
    }

    if (searchModal) {
        searchModal.addEventListener('click', (e) => {
            if (e.target === searchModal) {
                hideSearch();
            }
        });
    }

    // Global Escape key handler for open modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideModalVideo();
            hideSearch();
        }
    });

    // ==========================================================================
    // Active navigation link based on current section in viewport (Home page only)
    // ==========================================================================
    const setActiveNavLink = () => {
        const heroSection = document.getElementById('home');
        if (!heroSection || sections.length === 0) return;

        let currentId = 'home';
        const offset = 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offset;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                currentId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href && (href.startsWith('#') || href === 'index.html')) {
                const target = href === 'index.html' ? 'home' : href.replace('#', '');
                item.classList.toggle('active', target === currentId);
            }
        });
    };

    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink();

    // Smooth scroll to top when on home page and clicking logo or Home nav link
    const isHomePage = !!document.getElementById('home') || window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
    if (isHomePage) {
        document.querySelectorAll('.logo, .nav-links a[href="index.html"], .nav-links a[href="#home"]').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || !window.location.pathname.includes('.html')) {
                    if (window.scrollY > 20) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // Smooth Scrolling for Anchor Links (Accessibility improvements)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length <= 1) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    });

    // Reveal animation for sections/cards on scroll
    const targetSelectors = '.section-title, .about-grid, .mission-card, .objective-item, .program-card, .stat-box, .timeline-item, .cta .container, .team-card';
    const revealTargets = document.querySelectorAll(targetSelectors);

    revealTargets.forEach((el) => el.classList.add('reveal'));

    const allRevealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
    );

    allRevealElements.forEach((el) => observer.observe(el));

    // ==========================================================================
    // Footer Newsletter — handled by js/formspree.js
    // ==========================================================================

    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================================================
    // Executive Contact Form — handled by js/formspree.js
    // ==========================================================================

    // ==========================================================================
    // Testimonials Showcase Slider (Reference Design Controller)
    // ==========================================================================
    const testiSlides = document.querySelectorAll('.testi-slide');
    const testiPrevBtn = document.getElementById('testiPrevBtn');
    const testiNextBtn = document.getElementById('testiNextBtn');
    const testiDots = document.querySelectorAll('.testi-dot');
    const testiCard = document.querySelector('.testi-showcase-card');

    if (testiSlides.length > 0) {
        let currentTesti = 0;
        let testiAutoTimer = null;
        const testiIntervalTime = 6500; // 6.5s auto advance

        function showTestimonial(index) {
            currentTesti = (index + testiSlides.length) % testiSlides.length;

            testiSlides.forEach((slide, idx) => {
                const isActive = idx === currentTesti;
                slide.classList.toggle('active', isActive);
            });

            testiDots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentTesti);
            });
        }

        function nextTestimonial() {
            showTestimonial(currentTesti + 1);
        }

        function prevTestimonial() {
            showTestimonial(currentTesti - 1);
        }

        if (testiNextBtn) {
            testiNextBtn.addEventListener('click', () => {
                nextTestimonial();
                resetTestiTimer();
            });
        }

        if (testiPrevBtn) {
            testiPrevBtn.addEventListener('click', () => {
                prevTestimonial();
                resetTestiTimer();
            });
        }

        testiDots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
                if (!isNaN(targetIdx)) {
                    showTestimonial(targetIdx);
                    resetTestiTimer();
                }
            });
        });

        // Touch swipe support for mobile devices
        if (testiCard) {
            let touchStartX = 0;
            let touchEndX = 0;

            testiCard.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            testiCard.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDiff = touchEndX - touchStartX;
                if (Math.abs(swipeDiff) > 40) {
                    if (swipeDiff < 0) {
                        nextTestimonial();
                    } else {
                        prevTestimonial();
                    }
                    resetTestiTimer();
                }
            }, { passive: true });

            // Pause autoplay on mouse hover
            testiCard.addEventListener('mouseenter', () => {
                if (testiAutoTimer) clearInterval(testiAutoTimer);
            });

            testiCard.addEventListener('mouseleave', () => {
                startTestiTimer();
            });
        }

        function startTestiTimer() {
            if (testiAutoTimer) clearInterval(testiAutoTimer);
            testiAutoTimer = setInterval(nextTestimonial, testiIntervalTime);
        }

        function resetTestiTimer() {
            if (testiAutoTimer) clearInterval(testiAutoTimer);
            startTestiTimer();
        }

        // Initialize autoplay
        startTestiTimer();
    }

    // ==========================================================================
    // Home Contact Form — handled by js/formspree.js
    // ==========================================================================

    // ==========================================================================
    // Light / Dark Theme Controller (Universal Across All Pages)
    // ==========================================================================
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn, #themeToggleBtn');
    if (themeToggleBtns.length > 0) {
        let savedTheme = null;
        try {
            savedTheme = localStorage.getItem('roboyuwa-theme');
        } catch (e) {
            console.warn('LocalStorage not accessible for theme persistence:', e);
        }

        // Default to 'light' if not explicitly saved as 'dark'
        const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

        function applyTheme(theme) {
            if (theme === 'dark') {
                document.body.classList.add('dark-theme');
                document.body.classList.remove('light-theme');
                themeToggleBtns.forEach(btn => {
                    btn.setAttribute('title', 'Switch to Light Mode');
                    btn.setAttribute('aria-label', 'Switch to Light Mode');
                });
            } else {
                document.body.classList.remove('dark-theme');
                document.body.classList.add('light-theme');
                themeToggleBtns.forEach(btn => {
                    btn.setAttribute('title', 'Switch to Dark Mode');
                    btn.setAttribute('aria-label', 'Switch to Dark Mode');
                });
            }
        }

        applyTheme(initialTheme);

        themeToggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const isCurrentlyDark = document.body.classList.contains('dark-theme');
                const newTheme = isCurrentlyDark ? 'light' : 'dark';
                applyTheme(newTheme);
                try {
                    localStorage.setItem('roboyuwa-theme', newTheme);
                } catch (err) {
                    console.error('Could not save theme preference:', err);
                }
            });
        });
    }

    // ==========================================================================
    // Team Page Category Filtering Logic
    // ==========================================================================
    const teamFilterNav = document.getElementById('teamFilterNav');
    if (teamFilterNav) {
        const filterBtns = teamFilterNav.querySelectorAll('.team-filter-btn');
        const teamCards = document.querySelectorAll('.team-card-ref');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active state on buttons
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                // Filter cards with smooth fade transition
                teamCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filter === 'all' || cardCategory === filter) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 20);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ==========================================================================
    // Programs Page Category Filtering Logic
    // ==========================================================================
    const progFilterNav = document.getElementById('progFilterNav');
    if (progFilterNav) {
        const filterBtns = progFilterNav.querySelectorAll('.prog-filter-btn');
        const progCards = document.querySelectorAll('.prog-card-ref');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                progCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filter === 'all' || cardCategory === filter) {
                        card.classList.remove('hidden');
                        card.classList.add('visible');
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(12px)';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 20);
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ==========================================================================
    // Syllabus Modal Handlers
    // ==========================================================================
    const openSyllabusBtns = document.querySelectorAll('.open-syllabus-btn, #openSyllabusBtn');
    const syllabusModal = document.getElementById('syllabusModal');
    const closeSyllabusModal = document.getElementById('closeSyllabusModal');

    if (syllabusModal) {
        openSyllabusBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                syllabusModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeSyllabusModal) {
            closeSyllabusModal.addEventListener('click', () => {
                syllabusModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        syllabusModal.addEventListener('click', (e) => {
            if (e.target === syllabusModal) {
                syllabusModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});
