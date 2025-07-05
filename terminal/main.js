/**
 * Main JavaScript for Terminal Site
 * misbahwebsite.com
 */

import { InteractiveTerminal } from './terminal.js';

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading
    const loader = document.getElementById('loader');
    const sceneControl = document.getElementById('sceneControl');
    
    // Initialize terminal
    const terminal = new InteractiveTerminal();
    
    // Scene interaction state
    let isSceneInteractive = false;
    
    // Hide loader after everything is ready
    setTimeout(() => {
        loader.classList.add('hidden');
        
        // Log page load to analytics
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'terminal_loaded', {
                load_time: performance.now()
            });
        }
    }, 2000);
    
    // Scene control toggle
    sceneControl.addEventListener('click', () => {
        isSceneInteractive = !isSceneInteractive;
        
        if (isSceneInteractive) {
            sceneControl.classList.add('active');
            window.dispatchEvent(new CustomEvent('sceneInteractionEnabled'));
            
            // Log to analytics
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, '3d_interaction_enabled');
            }
        } else {
            sceneControl.classList.remove('active');
            window.dispatchEvent(new CustomEvent('sceneInteractionDisabled'));
            
            // Log to analytics
            if (window.logEvent && window.analytics) {
                window.logEvent(window.analytics, '3d_interaction_disabled');
            }
        }
    });
    
    // Track navigation clicks
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const destination = link.textContent.toLowerCase();
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
        btn.addEventListener('mouseenter', createButtonParticles);
    });
    
    // Create particle effects for buttons
    function createButtonParticles(e) {
        const button = e.target.closest('.action-btn');
        const rect = button.getBoundingClientRect();
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = rect.left + Math.random() * rect.width + 'px';
                particle.style.top = rect.top + rect.height / 2 + 'px';
                particle.style.fontSize = '20px';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9999';
                particle.style.animation = 'particleFloat 1s ease-out forwards';
                
                if (button.classList.contains('portfolio-btn')) {
                    particle.textContent = ['💼', '📄', '🚀'][Math.floor(Math.random() * 3)];
                } else {
                    particle.textContent = ['🎮', '👾', '🕹️'][Math.floor(Math.random() * 3)];
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
            }
        }
        
        // Escape to disable 3D interaction
        if (e.key === 'Escape' && isSceneInteractive) {
            sceneControl.click();
        }
    });
    
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
});