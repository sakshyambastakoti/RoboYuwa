document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle for Mobile
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-links a.nav-item');
    const sections = document.querySelectorAll('section[id]');
    const header = document.getElementById('header');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            toggleBtn.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks && toggleBtn) {
                navLinks.classList.remove('active');
                toggleBtn.classList.remove('active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Header Scroll Effect & Parallax
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Subtle parallax depth on active hero background image
        const activeHeroImage = document.querySelector('.hero-slide.active .hero-bg img');
        if (activeHeroImage && window.scrollY < window.innerHeight) {
            const offset = window.scrollY * 0.12;
            activeHeroImage.style.transform = `scale(1.02) translateY(${offset}px)`;
        }
    });

    // ==========================================================================
    // Hero Slider Carousel (Reference Circular Arrows & Impact Card Sync)
    // ==========================================================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderPrevBtn = document.getElementById('sliderPrevBtn');
    const sliderNextBtn = document.getElementById('sliderNextBtn');
    const impactLabel = document.getElementById('impactCardLabel');
    const impactValue = document.getElementById('impactCardValue');
    const heroSlider = document.getElementById('heroSlider');

    let currentSlide = 0;
    let slideTimer = null;
    const slideDuration = 6500; // 6.5s auto advance

    function showSlide(index) {
        if (!heroSlides.length) return;

        // Wrap index around
        currentSlide = (index + heroSlides.length) % heroSlides.length;

        heroSlides.forEach((slide, idx) => {
            const isActive = idx === currentSlide;
            slide.classList.toggle('active', isActive);

            // Trigger smooth content animation on entering active slide
            if (isActive) {
                const animatedElements = slide.querySelectorAll('.hero-eyebrow, .title-line, .hero-desc, .hero-actions');
                animatedElements.forEach((el) => {
                    el.style.animation = 'none';
                    void el.offsetWidth; // Trigger reflow
                    el.style.animation = '';
                });

                // Update bottom-right Sage Green Impact Card
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
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

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

    if (sliderNextBtn && sliderPrevBtn && heroSlides.length > 1) {
        sliderNextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoSlide();
        });

        sliderPrevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoSlide();
        });

        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', stopAutoSlide);
            heroSlider.addEventListener('mouseleave', startAutoSlide);
            heroSlider.addEventListener('touchstart', stopAutoSlide, { passive: true });
        }

        // Keyboard navigation for carousel
        document.addEventListener('keydown', (e) => {
            if (window.scrollY < window.innerHeight) {
                if (e.key === 'ArrowRight') {
                    nextSlide();
                    startAutoSlide();
                } else if (e.key === 'ArrowLeft') {
                    prevSlide();
                    startAutoSlide();
                }
            }
        });

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
    // Active navigation link based on current section in viewport
    // ==========================================================================
    const setActiveNavLink = () => {
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
            const target = item.getAttribute('href')?.replace('#', '');
            item.classList.toggle('active', target === currentId);
        });
    };

    window.addEventListener('scroll', setActiveNavLink);
    setActiveNavLink();

    // Smooth Scrolling for Anchor Links (Accessibility improvements)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

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
});