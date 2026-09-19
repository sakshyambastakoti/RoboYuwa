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
    // Footer Newsletter & Back-to-Top Handlers
    // ==========================================================================
    const newsletterForm = document.getElementById('footerNewsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletterEmailInput');
            const submitBtn = document.getElementById('newsletterSubmitBtn');
            if (emailInput && emailInput.value) {
                const originalHtml = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                submitBtn.style.background = '#10b981';
                emailInput.value = '';
                setTimeout(() => {
                    submitBtn.innerHTML = originalHtml;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

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
    // Executive Contact Form Submission Handler
    // ==========================================================================
    const execContactForm = document.getElementById('executiveContactForm');
    const contactFormStatus = document.getElementById('contactFormStatus');
    const execSubmitBtn = document.getElementById('execSubmitBtn');

    if (execContactForm) {
        execContactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const projectType = document.getElementById('projectType');
            const firstName = document.getElementById('firstName');
            const lastName = document.getElementById('lastName');
            const emailAddr = document.getElementById('emailAddr');
            const messageText = document.getElementById('messageText');

            if (!projectType?.value || !firstName?.value || !lastName?.value || !emailAddr?.value || !messageText?.value) {
                if (contactFormStatus) {
                    contactFormStatus.className = 'form-status-msg error';
                    contactFormStatus.textContent = 'Please fill in all required fields before submitting.';
                }
                return;
            }

            if (execSubmitBtn) {
                const origBtnHtml = execSubmitBtn.innerHTML;
                execSubmitBtn.disabled = true;
                execSubmitBtn.innerHTML = '<span>TRANSMITTING...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

                setTimeout(() => {
                    execContactForm.reset();
                    execSubmitBtn.disabled = false;
                    execSubmitBtn.innerHTML = '<span>SENT</span> <i class="fa-solid fa-check" style="color: #34D399;"></i>';

                    if (contactFormStatus) {
                        contactFormStatus.className = 'form-status-msg success';
                        contactFormStatus.textContent = 'Thank you! Your message has been routed to our leadership team. We will be in touch shortly.';
                    }

                    setTimeout(() => {
                        execSubmitBtn.innerHTML = origBtnHtml;
                        if (contactFormStatus) {
                            contactFormStatus.className = 'form-status-msg';
                            contactFormStatus.textContent = '';
                        }
                    }, 5000);
                }, 750);
            }
        });
    }

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
    // Home Contact Form Submission Handler (Matching Reference Design)
    // ==========================================================================
    const homeContactForm = document.getElementById('homeContactForm');
    const homeContactStatus = document.getElementById('homeContactStatus');
    const homeContactSubmitBtn = document.getElementById('homeContactSubmitBtn');

    if (homeContactForm) {
        homeContactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const fullName = document.getElementById('homeContactName');
            const email = document.getElementById('homeContactEmail');
            const message = document.getElementById('homeContactMessage');
            const terms = document.getElementById('homeContactTerms');

            if (!fullName?.value.trim() || !email?.value.trim() || !message?.value.trim()) {
                if (homeContactStatus) {
                    homeContactStatus.className = 'form-status-msg error';
                    homeContactStatus.textContent = 'Please complete all required fields before submitting.';
                }
                return;
            }

            if (terms && !terms.checked) {
                if (homeContactStatus) {
                    homeContactStatus.className = 'form-status-msg error';
                    homeContactStatus.textContent = 'Please agree to the terms of service to continue.';
                }
                return;
            }

            if (homeContactSubmitBtn) {
                const originalHtml = homeContactSubmitBtn.innerHTML;
                homeContactSubmitBtn.disabled = true;
                homeContactSubmitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

                setTimeout(() => {
                    homeContactForm.reset();
                    homeContactSubmitBtn.disabled = false;
                    homeContactSubmitBtn.innerHTML = '<span>Sent!</span> <i class="fa-solid fa-check" style="color: #10B981;"></i>';

                    if (homeContactStatus) {
                        homeContactStatus.className = 'form-status-msg success';
                        homeContactStatus.textContent = 'Thank you! Your message has been received. Our team will reach out to you shortly.';
                    }

                    setTimeout(() => {
                        homeContactSubmitBtn.innerHTML = originalHtml;
                        if (homeContactStatus) {
                            homeContactStatus.className = 'form-status-msg';
                            homeContactStatus.textContent = '';
                        }
                    }, 5000);
                }, 800);
            }
        });
    }

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
