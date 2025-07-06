/**
 * Main JavaScript for Terminal Site - Enhanced
 * buildwithmisbah.cc
 */

import { InteractiveTerminal } from './terminal.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading
    const loader = document.getElementById('loader');
    const loaderStatus = document.getElementById('loaderStatus');
    const sceneControl = document.getElementById('sceneControl');
    
    // Loading sequence
    const loadingSteps = [
        'Loading resources...',
        'Initializing terminal...',
        'Connecting to matrix...',
        'Preparing 3D environment...',
        'Almost ready...',
        'Welcome!'
    ];
    
    let loadStep = 0;
    const loadInterval = setInterval(() => {
        if (loadStep < loadingSteps.length && loaderStatus) {
            loaderStatus.textContent = loadingSteps[loadStep];
            loadStep++;
        } else {
            clearInterval(loadInterval);
        }
    }, 300);
    
    // Initialize terminal
    const terminal = new InteractiveTerminal();
    
    // Scene interaction state
    let isSceneInteractive = false;
    
    // Hide loader after everything is ready
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Show welcome message
        showWelcomeMessage();
        
        // Log page load to analytics
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'terminal_loaded', {
                load_time: performance.now()
            });
        }
    }, 2000);
    
    // Welcome message
    function showWelcomeMessage() {
        const messages = [
            "Welcome to Misbah's Terminal!",
            "Type 'help' to get started",
            "Try 'matrix' for some fun!"
        ];
        
        messages.forEach((msg, index) => {
            setTimeout(() => {
                const notification = createNotification(msg, 'success');
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);
            }, index * 1000);
        });
    }
    
    // Create notification element
    function createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff00;
            padding: 15px 25px;
            border-radius: 8px;
            color: #00ff00;
            font-size: 14px;
            z-index: 1001;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
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
        `;
        if (!document.querySelector('#notificationStyles')) {
            style.id = 'notificationStyles';
            document.head.appendChild(style);
        }
        
        return notification;
    }
    
    // Scene control toggle
    sceneControl.addEventListener('click', () => {
        isSceneInteractive = !isSceneInteractive;
        
        if (isSceneInteractive) {
            sceneControl.classList.add('active');
            window.dispatchEvent(new CustomEvent('sceneInteractionEnabled'));
            createNotification('3D interaction enabled! Drag to rotate.', 'success');
            
            // Log to analytics
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, '3d_interaction_enabled');
            }
        } else {
            sceneControl.classList.remove('active');
            window.dispatchEvent(new CustomEvent('sceneInteractionDisabled'));
            createNotification('3D interaction disabled.', 'info');
            
            // Log to analytics
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, '3d_interaction_disabled');
            }
        }
    });
    
    // Terminal window controls
    const minimizeBtn = document.getElementById('minimizeBtn');
    const maximizeBtn = document.getElementById('maximizeBtn');
    const closeBtn = document.getElementById('closeBtn');
    const terminalContainer = document.getElementById('terminalContainer');
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            terminalContainer.classList.toggle('minimized');
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'terminal_minimize');
            }
        });
    }
    
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', () => {
            terminalContainer.classList.toggle('maximized');
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'terminal_maximize');
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            createNotification("You can't close the terminal! Try 'exit' command instead.", 'error');
            // Shake effect
            terminalContainer.style.animation = 'shake 0.5s';
            setTimeout(() => {
                terminalContainer.style.animation = '';
            }, 500);
        });
    }
    
    // Add shake animation
    if (!document.querySelector('#shakeAnimation')) {
        const shakeStyle = document.createElement('style');
        shakeStyle.id = 'shakeAnimation';
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(shakeStyle);
    }
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.querySelector('span:not(.nav-icon)').textContent.toLowerCase();
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'nav_click', {
                    destination: destination
                });
            }
        });
    });
    
    // Track quick action clicks
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.classList.contains('portfolio-btn') ? 'portfolio' : 'games';
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'quick_action_click', {
                    action: action
                });
            }
        });
    });
    
    // Add hover effects to action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            createButtonParticles(e);
            // Add glow effect
            btn.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.6)';
        });
        
        btn.addEventListener('mouseleave', (e) => {
            btn.style.boxShadow = '';
        });
    });
    
    // Create particle effects for buttons
    function createButtonParticles(e) {
        const button = e.target.closest('.action-btn');
        const rect = button.getBoundingClientRect();
        const animationType = button.dataset.animation;
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = rect.left + Math.random() * rect.width + 'px';
                particle.style.top = rect.top + rect.height / 2 + 'px';
                particle.style.fontSize = '20px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9999';
                particle.style.animation = 'particleFloat 1s ease-out forwards';
                
                if (animationType === 'portfolio') {
                    particle.textContent = ['💼', '📄', '🚀', '✨'][Math.floor(Math.random() * 4)];
                } else {
                    particle.textContent = ['🎮', '👾', '🕹️', '🎯'][Math.floor(Math.random() * 4)];
                }
                
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }, i * 100);
        }
    }
    
    // Add particle animation style if not exists
    if (!document.querySelector('#particleStyles')) {
        const style = document.createElement('style');
        style.id = 'particleStyles';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) scale(0);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-30px) scale(1.2);
                }
                100% {
                    transform: translateY(-60px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus terminal
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const terminalInput = document.getElementById('terminalInput');
            if (terminalInput) {
                terminalInput.focus();
                terminalInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                createNotification('Terminal focused!', 'info');
            }
        }
        
        // Escape to disable 3D interaction
        if (e.key === 'Escape' && isSceneInteractive) {
            sceneControl.click();
        }
        
        // Ctrl/Cmd + L to clear terminal
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            const terminalInput = document.getElementById('terminalInput');
            if (terminalInput) {
                terminalInput.value = 'clear';
                terminalInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
            }
        }
    });
    
    // Add floating particles background effect
    function createFloatingParticles() {
        const particleCount = 20;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 2px;
                height: 2px;
                background: #00ff00;
                border-radius: 50%;
                opacity: 0.3;
                pointer-events: none;
                z-index: 0;
            `;
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.top = Math.random() * window.innerHeight + 'px';
            document.body.appendChild(particle);
            
            particles.push({
                element: particle,
                x: parseFloat(particle.style.left),
                y: parseFloat(particle.style.top),
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
        
        // Animate particles
        function animateParticles() {
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                // Wrap around screen
                if (p.x < 0) p.x = window.innerWidth;
                if (p.x > window.innerWidth) p.x = 0;
                if (p.y < 0) p.y = window.innerHeight;
                if (p.y > window.innerHeight) p.y = 0;
                
                p.element.style.left = p.x + 'px';
                p.element.style.top = p.y + 'px';
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }
    
    // Initialize floating particles
    createFloatingParticles();
    
    // Performance monitoring
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (window.logEvent && window.analytics) {
                    window.logEvent(window.analytics, 'performance_metric', {
                        metric_name: entry.name,
                        metric_value: entry.startTime,
                        metric_duration: entry.duration
                    });
                }
            }
        });
        
        perfObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
    }
    
    // Error tracking
    window.addEventListener('error', (e) => {
        console.error('Error caught:', e);
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'javascript_error', {
                error_message: e.error?.message || 'Unknown error',
                error_stack: e.error?.stack || '',
                error_filename: e.filename,
                error_line: e.lineno,
                error_column: e.colno
            });
        }
    });
    
    // Page visibility tracking
    let pageVisibleTime = Date.now();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            const timeSpent = Date.now() - pageVisibleTime;
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'page_visibility_change', {
                    visible_time_ms: timeSpent,
                    action: 'hidden'
                });
            }
        } else {
            pageVisibleTime = Date.now();
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'page_visibility_change', {
                    action: 'visible'
                });
            }
        }
    });
    
    // Terminal input focus tracking
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput) {
        terminalInput.addEventListener('focus', () => {
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'terminal_focus');
            }
        });
        
        terminalInput.addEventListener('blur', () => {
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, 'terminal_blur');
            }
        });
    }
    
    // Add console art
    console.log('%c' + `
 __  __ _     _           _     
|  \\/  (_)   | |         | |    
| \\  / |_ ___| |__   __ _| |__  
| |\\/| | / __| '_ \\ / _\` | '_ \\ 
| |  | | \\__ \\ |_) | (_| | | | |
|_|  |_|_|___/_.__/ \\__,_|_| |_|
    `, 'color: #00ff00; font-family: monospace;');
    
    console.log('%cWelcome to my terminal! 🚀', 'color: #00ff00; font-size: 16px;');
    console.log('%cTry typing "help" in the terminal for available commands.', 'color: #00cc00; font-size: 14px;');
    console.log('%cLooking for the source code? Check out github.com/Misbah542', 'color: #00aa00; font-size: 12px;');
});