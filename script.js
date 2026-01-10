// ============================================
// Wait for DOM to be fully loaded
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Mobile Menu Toggle
    // ============================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Animate hamburger icon
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translateY(8px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-8px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinkElements = document.querySelectorAll('.nav-link');
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const spans = mobileMenuToggle.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        });
    });
    
    
    // ============================================
    // Navbar Scroll Effect
    // ============================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    
    // ============================================
    // Active Navigation Link on Scroll
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinkElements.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    
    
    // ============================================
    // Smooth Scrolling for Navigation Links
    // ============================================
    navLinkElements.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    
    // ============================================
    // Dynamic Hero Slider Structure
    // ============================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const heroPrevBtn = document.getElementById('heroPrevBtn');
    const heroNextBtn = document.getElementById('heroNextBtn');
    let currentSlide = 0;
    let slideInterval;
    
    // Function to show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        heroSlides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });
        heroDots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Add active class to current slide and dot
        heroSlides[index].classList.add('active');
        heroDots[index].classList.add('active');
        
        // Animate statistics for the active slide
        animateHeroStats(index);
        
        currentSlide = index;
    }
    
    // Function to go to next slide
    function nextSlide() {
        const next = (currentSlide + 1) % heroSlides.length;
        showSlide(next);
    }
    
    // Function to go to previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
        showSlide(prev);
    }
    
    // Event listeners for navigation buttons
    if (heroNextBtn) {
        heroNextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }
    
    if (heroPrevBtn) {
        heroPrevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }
    
    // Dot navigation
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });
    
    // Auto-play slides
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetAutoPlay() {
        clearInterval(slideInterval);
        startAutoPlay();
    }
    
    // Start auto-play
    startAutoPlay();
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        heroSection.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    }
    
    // Keyboard navigation for hero slider
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoPlay();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        heroSection.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            resetAutoPlay();
        }
    }
    
    
    // ============================================
    // Animated Particles in Hero Background
    // ============================================
    const particlesContainer = document.getElementById('particles');
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        const startX = Math.random() * 100;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 5;
        
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = startX + '%';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, (duration + delay) * 1000);
    }
    
    // Create particles continuously
    function generateParticles() {
        createParticle();
        setTimeout(generateParticles, 300);
    }
    
    // Start generating particles
    if (particlesContainer) {
        generateParticles();
    }
    
    
    // ============================================
    // Animated Statistics in Hero Section
    // ============================================
    function animateHeroStats(slideIndex) {
        const activeSlide = heroSlides[slideIndex];
        const statNumbers = activeSlide.querySelectorAll('.hero-stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            // Reset to 0
            stat.textContent = '0';
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // Animate stats for initial slide
    animateHeroStats(0);
    
    
    // ============================================
    // Dynamic Time-based Greeting
    // ============================================
    const heroGreeting = document.getElementById('heroGreeting');
    
    function updateGreeting() {
        const hour = new Date().getHours();
        let greeting;
        
        if (hour >= 5 && hour < 12) {
            greeting = '☀️ Good Morning!';
        } else if (hour >= 12 && hour < 17) {
            greeting = '🌤️ Good Afternoon!';
        } else if (hour >= 17 && hour < 21) {
            greeting = '🌅 Good Evening!';
        } else {
            greeting = '🌙 Good Night!';
        }
        
        if (heroGreeting) {
            heroGreeting.textContent = greeting;
        }
    }
    
    updateGreeting();
    setInterval(updateGreeting, 60000); // Update every minute
    
    
    // ============================================
    // Dynamic Content Update Buttons (No Page Reload)
    // ============================================
    // Handle CTA buttons for each slide
    const ctaButtons = {
        primary: [
            document.getElementById('primaryCTA1'),
            document.getElementById('primaryCTA2'),
            document.getElementById('primaryCTA3')
        ],
        secondary: [
            document.getElementById('secondaryCTA1'),
            document.getElementById('secondaryCTA2'),
            document.getElementById('secondaryCTA3')
        ]
    };
    
    const ctaContent = {
        primary: [
            ['Get Started', 'Start Your Journey', 'Join Us Today'],
            ['Explore Now', 'Discover More', 'View Portfolio'],
            ['Join Us', 'Sign Up Now', 'Get Started']
        ],
        secondary: [
            ['Learn More', 'Discover More', 'Explore Features'],
            ['View Portfolio', 'See Our Work', 'Learn More'],
            ['Contact Us', 'Get In Touch', 'Learn More']
        ]
    };
    
    // Add click handlers to all CTA buttons
    ctaButtons.primary.forEach((btn, slideIndex) => {
        if (btn) {
            let clickCount = 0;
            btn.addEventListener('click', function() {
                // Update button text dynamically
                clickCount = (clickCount + 1) % ctaContent.primary[slideIndex].length;
                this.textContent = ctaContent.primary[slideIndex][clickCount];
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const offsetTop = contactSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    ctaButtons.secondary.forEach((btn, slideIndex) => {
        if (btn) {
            let clickCount = 0;
            btn.addEventListener('click', function() {
                // Update button text dynamically
                clickCount = (clickCount + 1) % ctaContent.secondary[slideIndex].length;
                this.textContent = ctaContent.secondary[slideIndex][clickCount];
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Scroll to about section
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    const offsetTop = aboutSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
    
    
    // ============================================
    // Animate On Scroll (AOS) Implementation
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Handle delay attribute
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.transitionDelay = `${delay}ms`;
                }
            }
        });
    }, observerOptions);
    
    // Observe all elements with data-aos attribute
    const aosElements = document.querySelectorAll('[data-aos]');
    aosElements.forEach(element => {
        observer.observe(element);
    });
    
    
    // ============================================
    // Animated Statistics Counter
    // ============================================
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    }
    
    // Create observer for stats section
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    if (stat.textContent === '0') {
                        animateCounter(stat);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        statsObserver.observe(aboutSection);
    }
    
    
    // ============================================
    // Testimonials Slider
    // ============================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const dots = document.querySelectorAll('.dot');
    
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        // Hide all testimonials
        testimonialCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show selected testimonial
        testimonialCards[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextTestimonial);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevTestimonial);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });
    
    // Auto-play testimonials
    setInterval(nextTestimonial, 5000);
    
    
    // ============================================
    // Contact Form Handling
    // ============================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission (in real app, this would send to server)
            showFormMessage('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                formMessage.style.display = 'none';
            }, 3000);
        });
    }
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    
    // ============================================
    // Back to Top Button
    // ============================================
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    
    // ============================================
    // Service Card Interactive Effects
    // ============================================
    const serviceButtons = document.querySelectorAll('.service-button');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get parent service card
            const serviceCard = this.closest('.service-card');
            const serviceTitle = serviceCard.querySelector('h3').textContent;
            
            // Update button text dynamically
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            
            setTimeout(() => {
                this.textContent = originalText;
                // In a real app, this would navigate to a service page
                console.log(`Navigating to ${serviceTitle} details`);
            }, 1000);
        });
    });
    
    
    // ============================================
    // Smooth Scroll Animation Enhancement
    // ============================================
    // Add smooth scroll behavior for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    
    // ============================================
    // Performance Optimization: Lazy Loading Images
    // ============================================
    // If you add images later, use this pattern:
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
    
    
    // ============================================
    // Dynamic Time-based Greeting (Optional Enhancement)
    // ============================================
    function getTimeBasedGreeting() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        if (hour >= 17 && hour < 21) return 'Good Evening';
        return 'Good Night';
    }
    
    // You can use this greeting in the hero section if desired
    // const greeting = getTimeBasedGreeting();
    
    
    // ============================================
    // Console Welcome Message (Development)
    // ============================================
    console.log('%cWelcome to the Modern Dynamic Website!', 'color: #6366f1; font-size: 20px; font-weight: bold;');
    console.log('%cAll features are working correctly.', 'color: #10b981; font-size: 14px;');
    
});
