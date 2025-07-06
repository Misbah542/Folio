/**
 * Main JavaScript for Portfolio Site
 * portfolio.misbahwebsite.com
 */

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loader = document.getElementById('loader');
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('backToTop');
    const sections = document.querySelectorAll('section');
    const skillItems = document.querySelectorAll('.skill-item');
    const androidRobot = document.getElementById('androidRobot');
    const contactForm = document.getElementById('contactForm');
    
    // Hide loader
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Log page load to analytics
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'portfolio_loaded', {
                load_time: performance.now()
            });
        }
        
        // Trigger initial animations
        observeElements();
    }, 2000);
    
    // Navigation scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
        
        // Show/hide back to top button
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Update active nav link
        updateActiveNavLink();
    });
    
    // Mobile navigation toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate toggle button
        const spans = navToggle.querySelectorAll('span');
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Smooth scrolling for navigation links
    navLinksItems.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                
                // Log navigation click
                if (window.logEvent && window.analytics) {
                    window.logEvent(window.analytics, 'nav_click', {
                        section: targetId
                    });
                }
            }
        });
    });
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Back to top button
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Log button click
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'back_to_top_click');
        }
    });
    
    // Intersection Observer for animations
    function observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Animate skill bars
                    if (entry.target.classList.contains('skill-item')) {
                        const progress = entry.target.querySelector('.skill-progress');
                        if (progress) {
                            setTimeout(() => {
                                progress.style.width = entry.target.getAttribute('data-level') + '%';
                            }, 200);
                        }
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        skillItems.forEach(skill => observer.observe(skill));
    }
    
    // Add fade-in class to elements
    document.querySelectorAll('.about-content, .skill-category, .timeline-item, .project-card, .contact-content').forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Android robot interaction
    if (androidRobot) {
        androidRobot.addEventListener('mouseenter', () => {
            androidRobot.style.animation = 'float 1s ease-in-out infinite, spin 2s linear infinite';
        });
        
        androidRobot.addEventListener('mouseleave', () => {
            androidRobot.style.animation = 'float 3s ease-in-out infinite';
        });
        
        // Click interaction
        androidRobot.addEventListener('click', () => {
            androidEasterEgg();
        });
    }
    
    // Android easter egg
    function androidEasterEgg() {
        const messages = [
            'Beep boop! 🤖',
            'Android developer mode activated!',
            'Hello, human! Want to build an app?',
            'Kotlin > Java (but both are great!)',
            'Jetpack Compose is the future!'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        showNotification(message);
        
        // Log easter egg
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'android_easter_egg_clicked');
        }
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: var(--bg-primary);
            padding: 15px 25px;
            border-radius: 30px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Contact form handling
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                message: contactForm.message.value
            };
            
            // Log form submission
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'contact_form_submitted', formData);
            }
            
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.');
            
            // Reset form
            contactForm.reset();
            
            // In a real implementation, you would send the form data to a server
            console.log('Form data:', formData);
        });
    }
    
    // Typing animation for code block
    const codeBlock = document.querySelector('.code-animation pre');
    if (codeBlock) {
        const originalText = codeBlock.textContent;
        let index = 0;
        
        function typeCode() {
            if (index < originalText.length) {
                codeBlock.textContent = originalText.slice(0, index + 1);
                index++;
                setTimeout(typeCode, 50);
            } else {
                // Reset and start again
                setTimeout(() => {
                    index = 0;
                    typeCode();
                }, 3000);
            }
        }
        
        // Start typing when visible
        const codeObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeCode();
                codeObserver.disconnect();
            }
        });
        
        codeObserver.observe(codeBlock);
    }
    
    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.animation = 'projectFloat 1s ease-in-out infinite, rotate 2s linear infinite';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.project-icon');
            if (icon) {
                icon.style.animation = 'projectFloat 3s ease-in-out infinite';
            }
        });
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification {
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
    `;
    document.head.appendChild(style);
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
        const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        
        if (scrollPercentage > maxScrollDepth) {
            maxScrollDepth = scrollPercentage;
            
            // Track milestones
            if ([25, 50, 75, 100].includes(Math.round(maxScrollDepth))) {
                if (window.logEvent && window.analytics) {
                    window.logEvent(window.analytics, 'scroll_depth', {
                        depth: Math.round(maxScrollDepth)
                    });
                }
            }
        }
    });
    
    // Performance monitoring
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'performance_metrics', {
                    page_load_time: pageLoadTime,
                    dom_ready_time: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                    first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0
                });
            }
        }
    });
});