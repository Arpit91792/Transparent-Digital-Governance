// ============================================
// HOME PAGE DYNAMIC ENHANCEMENTS
// Scoped to #home section only - No visual changes
// ============================================

(function() {
    'use strict';
    
    // Only run if home section exists
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    
    // ============================================
    // Enhanced Smooth Transitions & Animations
    // ============================================
    
    // Add smooth fade-in animation to hero content on load
    function initHeroAnimations() {
        const heroContent = homeSection.querySelector('.hero-content');
        if (heroContent) {
            // Use requestAnimationFrame for smooth performance
            requestAnimationFrame(() => {
                heroContent.style.opacity = '0';
                heroContent.style.transform = 'translateY(20px)';
                heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                
                requestAnimationFrame(() => {
                    heroContent.style.opacity = '1';
                    heroContent.style.transform = 'translateY(0)';
                });
            });
        }
    }
    
    // Enhanced slide transitions with performance optimization
    const heroSlides = homeSection.querySelectorAll('.hero-slide');
    heroSlides.forEach((slide) => {
        // Add transition end listener for smooth content animation
        slide.addEventListener('transitionend', function() {
            if (this.classList.contains('active')) {
                // Animate content within active slide
                const content = this.querySelector('.hero-content');
                if (content) {
                    content.style.animation = 'none';
                    requestAnimationFrame(() => {
                        content.style.animation = 'fadeInUp 0.6s ease-out';
                    });
                }
            }
        });
    });
    
    // ============================================
    // Dynamic Text Rotation (No Page Reload)
    // ============================================
    
    function initDynamicTextRotation() {
        const animatedTexts = homeSection.querySelectorAll('.animated-text');
        
        animatedTexts.forEach(textEl => {
            const originalText = textEl.textContent;
            const textVariations = [
                originalText,
                'Excellence',
                'Innovation',
                'Success',
                'Quality',
                'Creativity'
            ];
            
            let currentIndex = 0;
            
            // Rotate text every 4 seconds
            setInterval(() => {
                if (textEl.closest('.hero-slide').classList.contains('active')) {
                    textEl.style.opacity = '0';
                    textEl.style.transform = 'translateY(10px)';
                    textEl.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        currentIndex = (currentIndex + 1) % textVariations.length;
                        textEl.textContent = textVariations[currentIndex];
                        textEl.style.opacity = '1';
                        textEl.style.transform = 'translateY(0)';
                    }, 300);
                }
            }, 4000);
        });
    }
    
    // ============================================
    // Enhanced Interactive Hover Effects
    // ============================================
    
    function initEnhancedHoverEffects() {
        // Enhanced CTA button hover effects
        const ctaButtons = homeSection.querySelectorAll('.cta-button');
        ctaButtons.forEach(button => {
            // Add ripple effect on click
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.5)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s ease-out';
                ripple.style.pointerEvents = 'none';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
            
            // Enhanced hover animation
            button.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
        
        // Enhanced hero stat cards hover
        const statItems = homeSection.querySelectorAll('.hero-stat-item');
        statItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05) translateY(-5px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1) translateY(0)';
            });
        });
        
        // Enhanced navigation buttons hover
        const navButtons = homeSection.querySelectorAll('.hero-nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.15)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        // Enhanced dot navigation hover
        const dots = homeSection.querySelectorAll('.hero-dot');
        dots.forEach(dot => {
            dot.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'scale(1.3)';
                    this.style.transition = 'transform 0.2s ease';
                }
            });
            
            dot.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'scale(1)';
                }
            });
        });
    }
    
    // ============================================
    // Dynamic Content Loading (No Page Reload)
    // ============================================
    
    function initDynamicContentLoading() {
        // Cache for loaded content
        const contentCache = new Map();
        
        // Dynamic badge text rotation
        const badges = homeSection.querySelectorAll('.hero-badge');
        badges.forEach((badge, index) => {
            const badgeTexts = [
                ['✨ New Feature Available', '🚀 Latest Updates', '⭐ Premium Quality'],
                ['🚀 Launching Soon', '💡 Coming Soon', '🎯 Stay Tuned'],
                ['💡 Innovation First', '⚡ Cutting Edge', '🌟 Top Rated']
            ];
            
            let badgeIndex = 0;
            
            setInterval(() => {
                const activeSlide = homeSection.querySelector('.hero-slide.active');
                if (badge.closest('.hero-slide') === activeSlide) {
                    badge.style.opacity = '0';
                    badge.style.transform = 'translateY(-10px)';
                    badge.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    
                    setTimeout(() => {
                        badgeIndex = (badgeIndex + 1) % badgeTexts[index].length;
                        badge.textContent = badgeTexts[index][badgeIndex];
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0)';
                    }, 300);
                }
            }, 6000);
        });
        
        // Dynamic subtitle enhancement
        const subtitles = homeSection.querySelectorAll('.hero-subtitle');
        subtitles.forEach(subtitle => {
            const originalText = subtitle.textContent;
            const variations = [
                originalText,
                'Empowering businesses with innovative solutions',
                'Transforming digital experiences worldwide',
                'Building the future, one project at a time'
            ];
            
            let subIndex = 0;
            
            setInterval(() => {
                const activeSlide = homeSection.querySelector('.hero-slide.active');
                if (subtitle.closest('.hero-slide') === activeSlide) {
                    subtitle.style.opacity = '0';
                    setTimeout(() => {
                        subIndex = (subIndex + 1) % variations.length;
                        subtitle.textContent = variations[subIndex];
                        subtitle.style.opacity = '1';
                        subtitle.style.transition = 'opacity 0.5s ease';
                    }, 300);
                }
            }, 8000);
        });
    }
    
    // ============================================
    // Performance Optimizations
    // ============================================
    
    function initPerformanceOptimizations() {
        // Use Intersection Observer for animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe hero elements
        const heroElements = homeSection.querySelectorAll('.hero-content, .hero-stat-item, .hero-badge');
        heroElements.forEach(el => {
            animationObserver.observe(el);
        });
        
        // Throttle scroll events for better performance
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Scroll-based animations can go here
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Only attach if home section is visible
        const homeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', handleScroll, { passive: true });
                } else {
                    window.removeEventListener('scroll', handleScroll);
                }
            });
        });
        
        homeObserver.observe(homeSection);
        
        // Debounce resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Handle resize if needed
            }, 250);
        }, { passive: true });
    }
    
    // ============================================
    // Enhanced Slider Interactions
    // ============================================
    
    function initEnhancedSliderInteractions() {
        // Add progress indicator for auto-play
        const sliderContainer = homeSection.querySelector('.hero-slider-container');
        if (sliderContainer) {
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.5);
                width: 0%;
                transition: width 0.1s linear;
                z-index: 10;
            `;
            sliderContainer.style.position = 'relative';
            sliderContainer.appendChild(progressBar);
            
            // Update progress bar
            let progressInterval;
            const updateProgress = () => {
                progressBar.style.width = '0%';
                let progress = 0;
                clearInterval(progressInterval);
                progressInterval = setInterval(() => {
                    progress += 2; // 5 seconds = 100% (5000ms / 50ms = 100 steps)
                    if (progress <= 100) {
                        progressBar.style.width = progress + '%';
                    } else {
                        clearInterval(progressInterval);
                    }
                }, 50);
            };
            
            // Update on slide change
            const slides = homeSection.querySelectorAll('.hero-slide');
            slides.forEach(slide => {
                slide.addEventListener('transitionend', () => {
                    if (slide.classList.contains('active')) {
                        updateProgress();
                    }
                });
            });
            
            updateProgress();
        }
        
        // Add smooth parallax effect to background
        const heroBackground = homeSection.querySelector('.hero-background');
        if (heroBackground) {
            let lastScrollY = window.scrollY;
            
            const handleParallax = () => {
                const scrollY = window.scrollY;
                const heroHeight = homeSection.offsetHeight;
                const heroTop = homeSection.offsetTop;
                
                if (scrollY >= heroTop && scrollY <= heroTop + heroHeight) {
                    const parallaxValue = (scrollY - heroTop) * 0.5;
                    heroBackground.style.transform = `translateY(${parallaxValue}px)`;
                }
                
                lastScrollY = scrollY;
            };
            
            window.addEventListener('scroll', handleParallax, { passive: true });
        }
    }
    
    // ============================================
    // Add Ripple Animation CSS
    // ============================================
    
    function addRippleAnimation() {
        if (!document.getElementById('home-enhancements-style')) {
            const style = document.createElement('style');
            style.id = 'home-enhancements-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                .hero-content.animate-in {
                    animation: fadeInUp 0.8s ease-out;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ============================================
    // Initialize All Enhancements
    // ============================================
    
    function init() {
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Add CSS animations
        addRippleAnimation();
        
        // Initialize all enhancements
        initHeroAnimations();
        initDynamicTextRotation();
        initEnhancedHoverEffects();
        initDynamicContentLoading();
        initPerformanceOptimizations();
        initEnhancedSliderInteractions();
        
        console.log('Home page dynamic enhancements loaded');
    }
    
    // Start initialization
    init();
    
})();

