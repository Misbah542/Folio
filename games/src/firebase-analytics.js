/**
 * Firebase Analytics Configuration
 * Shared across all subdomains
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAnalytics, logEvent, setUserProperties } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Firebase configuration
// IMPORTANT: Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export for use in other modules
export { analytics, logEvent, setUserProperties };

// Common analytics functions
export const trackEvent = (eventName, parameters = {}) => {
    logEvent(analytics, eventName, {
        ...parameters,
        timestamp: new Date().toISOString(),
        subdomain: window.location.hostname.split('.')[0] || 'main',
        page_path: window.location.pathname,
        page_title: document.title
    });
};

// Track page views
export const trackPageView = (pageName) => {
    logEvent(analytics, 'page_view', {
        page_title: pageName || document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        subdomain: window.location.hostname.split('.')[0] || 'main'
    });
};

// Track user engagement time
let engagementStartTime = Date.now();
let totalEngagementTime = 0;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // User left the page
        totalEngagementTime += Date.now() - engagementStartTime;
        trackEvent('user_engagement', {
            engagement_time_msec: totalEngagementTime
        });
    } else {
        // User returned to the page
        engagementStartTime = Date.now();
    }
});

// Track before user leaves
window.addEventListener('beforeunload', () => {
    totalEngagementTime += Date.now() - engagementStartTime;
    trackEvent('user_engagement', {
        engagement_time_msec: totalEngagementTime,
        total_time_seconds: Math.floor(totalEngagementTime / 1000)
    });
});

// Track scroll depth
let maxScrollDepth = 0;
let scrollTimeout;

window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollDepth = Math.round((window.scrollY / scrollHeight) * 100);
        
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // Track at 25%, 50%, 75%, and 100%
            if ([25, 50, 75, 100].includes(scrollDepth)) {
                trackEvent('scroll_depth', {
                    percent_scrolled: scrollDepth
                });
            }
        }
    }, 100);
});

// Track external link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.hostname !== window.location.hostname) {
        trackEvent('external_link_click', {
            link_url: link.href,
            link_text: link.textContent || 'No text'
        });
    }
});

// Device and browser information
const deviceInfo = {
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    viewport_size: `${window.innerWidth}x${window.innerHeight}`,
    device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    browser: navigator.userAgent
};

// Set user properties
setUserProperties(analytics, {
    device_type: deviceInfo.device_type,
    screen_resolution: deviceInfo.screen_resolution
});

// Initial page view
trackPageView();

// Log device info
trackEvent('device_info', deviceInfo);

// Make functions available globally
window.firebaseAnalytics = {
    trackEvent,
    trackPageView,
    analytics
};