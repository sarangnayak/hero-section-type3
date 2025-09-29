// Portfolio Website Script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP
    initAnimations();
    
    // Initialize performance optimizations
    initPerformance();
    
    // Initialize error handling
    initErrorHandling();
});

// GSAP Animations
function initAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP not loaded, falling back to basic animations');
        initFallbackAnimations();
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const heroSection = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');

    // Hero section parallax animation
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            end: "+=150%",
            scrub: 1,
            pin: true,
            pinSpacing: true,
            markers: false, // Set to true for debugging
        }
    });

    tl.fromTo(heroContent, 
        { 
            y: "80vh", 
            autoAlpha: 0 
        },
        { 
            y: "-40vh", 
            autoAlpha: 1, 
            ease: "power2.out",
            duration: 1.5
        }
    );

    // Social links animation
    gsap.from(".social-links a", {
        autoAlpha: 0,
        y: -20,
        duration: 1,
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out"
    });
    
    // Project cards animation
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        gsap.from(card, {
            autoAlpha: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out',
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            }
        });
    });

    // Section header animation
    gsap.from('.section-header h2', {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.section-header',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
        }
    });

    // Footer animation
    gsap.from('.main-footer', {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.main-footer',
            start: 'top 90%',
            toggleActions: 'play none none reverse',
        }
    });
}

// Fallback animations if GSAP fails to load
function initFallbackAnimations() {
    const projectCards = document.querySelectorAll('.project-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        observer.observe(card);
    });

    // Animate social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach((link, index) => {
        link.style.opacity = '1';
        link.style.transform = 'translateY(0)';
    });
}

// Performance Optimizations
function initPerformance() {
    // Lazy load background image
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        const bgImage = new Image();
        bgImage.src = 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
        bgImage.onload = () => {
            heroBackground.style.backgroundImage = `url(${bgImage.src})`;
            document.body.classList.add('loaded');
        };
        
        bgImage.onerror = () => {
            console.warn('Background image failed to load, using gradient fallback');
            heroBackground.style.backgroundImage = 'none';
            document.body.classList.add('loaded');
        };
    }

    // Add loading state
    document.body.classList.add('loading');

    // Remove loading state after a timeout (fallback)
    setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
    }, 3000);
}

// Error Handling
function initErrorHandling() {
    // Handle broken images
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            console.warn('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
        }
    }, true);

    // Handle external link security
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.rel = 'noopener noreferrer';
    });

    // Log GSAP errors
    if (typeof gsap !== 'undefined') {
        gsap.config({
            nullTargetWarn: false
        });
    }
}

// Resize handler with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any layout-dependent animations
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }, 250);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
});
