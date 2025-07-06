/**
 * Interactive Terminal Module - Enhanced
 * Main terminal site - buildwithmisbah.cc
 */

export class InteractiveTerminal {
    constructor(config = {}) {
        this.container = config.container || document.getElementById('terminalContent');
        this.input = config.input || document.getElementById('terminalInput');
        this.output = config.output || document.getElementById('terminalOutput');
        this.animContainer = config.animContainer || document.getElementById('terminalAnimations');
        this.suggestionsEl = config.suggestions || document.getElementById('autocompleteSuggestions');
        
        this.history = [];
        this.historyIndex = -1;
        this.commands = this.initializeCommands();
        this.currentSuggestionIndex = -1;
        this.isAutocompleting = false;
        
        // Sound effects
        this.soundEnabled = true;
        this.typingSound = document.getElementById('typingSound');
        
        // Konami code tracking
        this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.konamiProgress = 0;
        
        this.init();
    }
    
    init() {
        if (this.input) {
            this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
            this.input.addEventListener('input', (e) => this.handleInput(e));
            this.input.focus();
        }
        
        if (this.container) {
            this.container.addEventListener('click', () => {
                if (this.input) this.input.focus();
            });
        }
        
        // Track Konami code
        document.addEventListener('keydown', (e) => this.trackKonamiCode(e));
        
        // Add welcome animation
        setTimeout(() => this.welcomeAnimation(), 500);
    }
    
    initializeCommands() {
        return {
            help: {
                output: `
<span class="success-message">📚 Available Commands:</span>
<div class="help-grid">
  <div><span class="info-message">• help</span> - Show this help menu</div>
  <div><span class="info-message">• about</span> - Learn about Misbah</div>
  <div><span class="info-message">• portfolio</span> - Visit portfolio site</div>
  <div><span class="info-message">• games</span> - Play retro games</div>
  <div><span class="info-message">• skills</span> - View technical skills</div>
  <div><span class="info-message">• experience</span> - View work experience</div>
  <div><span class="info-message">• contact</span> - Get contact information</div>
  <div><span class="info-message">• projects</span> - See featured projects</div>
  <div><span class="info-message">• android</span> - Show Android animation</div>
  <div><span class="info-message">• matrix</span> - Enter the Matrix</div>
  <div><span class="info-message">• hack</span> - Initiate hacking sequence</div>
  <div><span class="info-message">• glitch</span> - Cause a glitch</div>
  <div><span class="info-message">• party</span> - Start a party! 🎉</div>
  <div><span class="info-message">• coffee</span> - Brew some coffee</div>
  <div><span class="info-message">• joke</span> - Tell a developer joke</div>
  <div><span class="info-message">• fortune</span> - Get your fortune</div>
  <div><span class="info-message">• weather</span> - Check the weather</div>
  <div><span class="info-message">• date</span> - Show current date</div>
  <div><span class="info-message">• calculator</span> - Quick math calculations</div>
  <div><span class="info-message">• color [hex]</span> - Change terminal color</div>
  <div><span class="info-message">• sound</span> - Toggle sound effects</div>
  <div><span class="info-message">• clear</span> - Clear terminal</div>
  <div><span class="info-message">• secret</span> - ???</div>
  <div><span class="info-message">• linkedin</span> - Open LinkedIn profile</div>
  <div><span class="info-message">• github</span> - Open GitHub profile</div>
  <div><span class="info-message">• email</span> - Send an email</div>
  <div><span class="info-message">• resume</span> - Download resume</div>
  <div><span class="info-message">• whoami</span> - Who are you?</div>
  <div><span class="info-message">• neofetch</span> - System information</div>
  <div><span class="info-message">• exit</span> - Exit terminal (just kidding!)</div>
</div>`,

                animation: null,
                description: 'Show all available commands'
            },
            about: {
                output: `<span class="success-message">👋 About Misbah ul Haque:</span>
<span class="info-message">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
🚀 Innovative Android Developer with 2+ years of experience
📱 Specializing in Kotlin, Jetpack Compose, and Android TV applications
💼 Currently working at Viacom Media (JioCinema) as SDE II
🎯 Building apps that handle 50M+ concurrent users

<span class="info-message">Fun fact: I optimize apps for India's largest streaming events!</span>`,
                animation: 'bounce',
                action: () => this.logAnalytics('command_about'),
                description: 'Learn about Misbah'
            },
            portfolio: {
                output: `<span class="success-message">🚀 Opening portfolio...</span>
<span class="info-message">Redirecting to portfolio.buildwithmisbah.cc in 3... 2... 1...</span>`,
                animation: 'redirect',
                action: () => {
                    this.logAnalytics('navigate_portfolio');
                    this.createPortal('portfolio');
                    setTimeout(() => {
                        window.location.href = 'https://misbah-portfolio.onrender.com';
                    }, 2000);
                },
                description: 'Visit portfolio site'
            },
            games: {
                output: `<span class="success-message">🎮 Launching retro games arcade...</span>
<span class="info-message">Get ready to play! Loading games.buildwithmisbah.cc..</span>`,
                animation: 'icons',
                icons: ['🎮', '🕹️', '👾', '🎯', '🏆'],
                action: () => {
                    this.logAnalytics('navigate_games');
                    this.createPortal('games');
                    setTimeout(() => {
                        window.location.href = 'https://games.buildwithmisbah.cc';
                    }, 2000);
                },
                description: 'Play retro games'
            },
            skills: {
                output: `<span class="success-message">💻 Technical Skills:</span>
<span class="info-message">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="info-message">📋 Languages:</span> Kotlin, Java, JavaScript
<span class="info-message">🛠️ Frameworks:</span> Jetpack Compose, Android Leanback, ExoPlayer
<span class="info-message">🏗️ Architecture:</span> MVVM, MVI, Clean Architecture
<span class="info-message">🔧 Tools:</span> Android Studio, Firebase, Git, Gradle
<span class="info-message">📱 Platforms:</span> Android Mobile, Android TV, Fire TV
<span class="info-message">🌐 Web:</span> HTML5, CSS3, React, Three.js`,
                animation: 'icons',
                icons: ['🔧', '📱', '💻', '🚀', '⚡'],
                action: () => this.logAnalytics('command_skills'),
                description: 'View technical skills'
            },
            experience: {
                output: `<span class="success-message">💼 Work Experience:</span>
<span class="info-message">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="info-message">🏢 SDE II - Android @ JioCinema (June 2024 - Present)</span>
   • Optimized app startup time by 60%
   • Maintained 99.9% crash-free rate during IPL 2024
   • Handled 50M+ concurrent users during live events
   • Led Android TV player redesign

<span class="info-message">🏢 SDE I - Android @ JioCinema (July 2022 - May 2024)</span>
   • Redesigned Android TV Player Skin
   • Built Login with QR Code feature
   • Improved rendering time by 40%
   • Implemented advanced caching strategies`,
                animation: 'bounce',
                action: () => this.logAnalytics('command_experience'),
                description: 'View work experience'
            },
            contact: {
                output: `<span class="success-message">📬 Contact Information:</span>
<span class="info-message">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="info-message">📧 Email:</span> misbahul8@gmail.com
<span class="info-message">📱 Phone:</span> +91-8376069521
<span class="info-message">🔗 LinkedIn:</span> linkedin.com/in/misbahhaque
<span class="info-message">💻 GitHub:</span> github.com/Misbah542
<span class="info-message">📍 Location:</span> Bengaluru, India
<span class="info-message">🌐 Website:</span> buildwithmisbah.cc`,
                animation: 'icons',
                icons: ['📧', '📱', '🔗', '💻', '📍'],
                action: () => this.logAnalytics('command_contact'),
                description: 'Get contact information'
            },
            projects: {
                output: `<span class="success-message">🚀 Featured Projects:</span>
<span class="info-message">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="info-message">📺 JioCinema Android TV</span> - Streaming app with 50M+ users
<span class="info-message">🎮 Retro Games Collection</span> - Classic games built with React
<span class="info-message">🧩 Tetris Game</span> - MVVM + Jetpack Compose implementation
<span class="info-message">🌤️ Weather App</span> - Dynamic UI with OpenWeather API
<span class="info-message">🌐 Portfolio Website</span> - Interactive 3D experience with Three.js
<span class="info-message">🤖 Android Components Library</span> - Reusable UI components

Type 'portfolio' to see detailed project information!`,
                animation: 'icons',
                icons: ['📺', '🎮', '🌤️', '🌐', '🤖'],
                action: () => this.logAnalytics('command_projects'),
                description: 'See featured projects'
            },
            android: {
                output: `<span class="success-message">🤖 Launching Android animation...</span>
<span class="info-message">Boot sequence initiated...</span>`,
                animation: 'android',
                action: () => {
                    this.logAnalytics('command_android');
                    this.playSound('powerup');
                },
                description: 'Show Android animation'
            },
            matrix: {
                output: `<span class="success-message">🟢 Welcome to the Matrix, Neo...</span>
<span class="info-message">There is no spoon. Follow the white rabbit 🐰</span>`,
                animation: 'matrix',
                action: () => {
                    this.logAnalytics('command_matrix');
                    this.playSound('matrix');
                },
                description: 'Enter the Matrix'
            },
            hack: {
                output: `<span class="success-message">💻 Initiating hacking sequence...</span>
<span class="info-message">[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% Complete</span>
<span class="error-message">Access Denied! Just kidding 😄</span>
<span class="system-message">Remember: With great power comes great electricity bills!</span>`,
                animation: 'hack',
                action: () => {
                    this.logAnalytics('command_hack');
                    this.playSound('hack');
                },
                description: 'Initiate hacking sequence'
            },
            glitch: {
                output: `<span class="error-message">⚠️ SYSTEM ERROR... GLITCH DETECTED...</span>`,
                animation: 'glitch',
                action: () => {
                    this.logAnalytics('command_glitch');
                    this.createGlitchEffect();
                },
                description: 'Cause a glitch effect'
            },
            party: {
                output: `<span class="success-message">🎉 PARTY MODE ACTIVATED! 🎉</span>
<span class="info-message">Let's celebrate your visit!</span>`,
                animation: 'party',
                action: () => {
                    this.logAnalytics('command_party');
                    this.startPartyMode();
                },
                description: 'Start a celebration'
            },
            coffee: {
                output: `<span class="success-message">☕ Brewing coffee...</span>
<span class="info-message">while(true) { code(); sip(); }</span>
<span class="system-message">Coffee ready! Productivity +100%</span>`,
                animation: 'icons',
                icons: ['☕', '☕', '☕', '☕', '☕'],
                action: () => this.logAnalytics('command_coffee'),
                description: 'Brew virtual coffee'
            },
            joke: {
                output: () => {
                    const jokes = [
                        "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
                        "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡",
                        "Why do Java developers wear glasses? Because they don't C#! 👓",
                        "What's a programmer's favorite place? The Foo Bar! 🍺",
                        "Why did the developer go broke? Because he used up all his cache! 💸",
                        "Why did the programmer quit his job? Because he didn't get arrays! 📊",
                        "What's the object-oriented way to become wealthy? Inheritance! 💰",
                        "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25! 🎃",
                        "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?' 🪑",
                        "How do you comfort a JavaScript bug? You console it! 🤗"
                    ];
                    const joke = jokes[Math.floor(Math.random() * jokes.length)];
                    this.logAnalytics('command_joke', { joke });
                    return `<span class="success-message">😄 ${joke}</span>`;
                },
                animation: 'icons',
                icons: ['😄', '😂', '🤣', '😆'],
                description: 'Tell a developer joke'
            },
            fortune: {
                output: () => {
                    const fortunes = [
                        "🔮 Your code will compile on the first try today!",
                        "✨ A great debugging session awaits you.",
                        "🌟 You will find the missing semicolon within 5 minutes.",
                        "💫 Your pull request will be approved without changes.",
                        "☕ Coffee will taste extra good today.",
                        "🐛 You will solve that bug you've been chasing.",
                        "📱 Your app will go viral!",
                        "🔍 Stack Overflow will have the exact answer you need.",
                        "🚀 Today's commits will be bug-free.",
                        "💡 You will discover a new favorite framework."
                    ];
                    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
                    this.logAnalytics('command_fortune');
                    return `<span class="success-message">${fortune}</span>`;
                },
                animation: 'icons',
                icons: ['🔮', '✨', '🌟', '💫'],
                description: 'Get your fortune'
            },
            weather: {
                output: `<span class="info-message">🌤️ Current Weather in Bengaluru:</span>
<span class="success-message">☀️ Partly Cloudy, 25°C (77°F)</span>
<span class="info-message">Humidity: 65% | Wind: 10 km/h</span>
<span class="system-message">Perfect coding weather!</span>`,
                animation: 'icons',
                icons: ['☀️', '⛅', '🌤️', '🌈'],
                description: 'Check the weather'
            },
            date: {
                output: () => {
                    const now = new Date();
                    const options = { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZone: 'Asia/Kolkata'
                    };
                    return `<span class="info-message">📅 Current Date & Time:</span>
<span class="success-message">${now.toLocaleDateString('en-IN', options)}</span>
<span class="info-message">Time Zone: Asia/Kolkata (IST)</span>`;
                },
                animation: null,
                description: 'Show current date and time'
            },
            calculator: {
                output: `<span class="info-message">🧮 Calculator Mode</span>
<span class="system-message">Usage: calc [expression]</span>
<span class="info-message">Example: calc 2 + 2</span>`,
                animation: null,
                description: 'Quick math calculations'
            },
            calc: {
                output: (args) => {
                    try {
                        const expression = args.join(' ');
                        // Safe evaluation for basic math
                        const result = Function('"use strict"; return (' + expression + ')')();
                        return `<span class="success-message">🧮 ${expression} = ${result}</span>`;
                    } catch (e) {
                        return `<span class="error-message">Invalid expression. Try: calc 2 + 2</span>`;
                    }
                },
                animation: null,
                hidden: true
            },
            color: {
                output: (args) => {
                    if (args.length === 0) {
                        return `<span class="info-message">Usage: color [hex]</span>
<span class="system-message">Example: color #00ff00</span>`;
                    }
                    const color = args[0];
                    if (/^#[0-9A-F]{6}$/i.test(color)) {
                        document.documentElement.style.setProperty('--primary-green', color);
                        return `<span class="success-message">✨ Terminal color changed to ${color}</span>`;
                    } else {
                        return `<span class="error-message">Invalid color format. Use hex: #00ff00</span>`;
                    }
                },
                animation: null,
                description: 'Change terminal color'
            },
            sound: {
                output: () => {
                    this.soundEnabled = !this.soundEnabled;
                    const status = this.soundEnabled ? 'ON 🔊' : 'OFF 🔇';
                    return `<span class="success-message">Sound effects: ${status}</span>`;
                },
                animation: null,
                description: 'Toggle sound effects'
            },
            clear: {
                output: 'CLEAR',
                animation: null,
                action: () => this.logAnalytics('command_clear'),
                description: 'Clear terminal screen'
            },
            // Replace the "secret" command inside initializeCommands() with this version:
            secret: {
                output: () => {
                    const commandCount = Object.keys(this.commands || {}).length;
                return `<span class="success-message">🎉 You found the secret command!</span>
        <span class="info-message">Here's a cookie for you: 🍪</span>
        <span class="system-message">Fun fact: This terminal has ${commandCount} commands!</span>
        <span class="info-message">Try the Konami code: ↑↑↓↓←→←→BA</span>
        <span class="warning-message">Easter eggs hidden: 5/10 found</span>`;
         },
         animation: 'icons',
         icons: ['🎉', '🎊', '✨', '🍪', '🏆', '🗝️'],
           action: () => this.logAnalytics('command_secret'),
         description: '???'
              },
            linkedin: {
                output: `<span class="success-message">🔗 Opening LinkedIn profile...</span>`,
                animation: 'icons',
                icons: ['🔗', '💼', '🌐'],
                action: () => {
                    this.logAnalytics('social_linkedin');
                    window.open('https://linkedin.com/in/misbahhaque', '_blank');
                },
                description: 'Open LinkedIn profile'
            },
            github: {
                output: `<span class="success-message">💻 Opening GitHub profile...</span>`,
                animation: 'icons',
                icons: ['💻', '🐙', '📦'],
                action: () => {
                    this.logAnalytics('social_github');
                    window.open('https://github.com/Misbah542', '_blank');
                },
                description: 'Open GitHub profile'
            },
            email: {
                output: `<span class="success-message">📧 Opening email client...</span>
<span class="info-message">Email: misbahul8@gmail.com</span>`,
                animation: 'icons',
                icons: ['📧', '✉️', '📮'],
                action: () => {
                    this.logAnalytics('contact_email');
                    window.location.href = 'mailto:misbahul8@gmail.com';
                },
                description: 'Send an email'
            },
            resume: {
                output: `<span class="success-message">📄 Downloading resume...</span>
<span class="info-message">Opening Misbah_ul_Haque_Resume.pdf</span>`,
                animation: 'icons',
                icons: ['📄', '⬇️', '📑'],
                action: () => {
                    this.logAnalytics('download_resume');
                    window.open('https://misbah-portfolio.onrender.com/resume/Misbah_ul_Haque_Resume.pdf', '_blank');
                },
                description: 'Download resume'
            },
            whoami: {
                output: `<span class="info-message">You are a curious visitor exploring Misbah's terminal!</span>
<span class="success-message">Welcome, fellow developer! 👋</span>
<span class="system-message">Your IP has been logged... just kidding! 😄</span>
<span class="info-message">User Agent: ${navigator.userAgent.substring(0, 50)}...</span>`,
                animation: 'bounce',
                action: () => this.logAnalytics('command_whoami'),
                description: 'Who are you?'
            },
            neofetch: {
                output: () => {
                    const uptime = Math.floor((Date.now() - performance.timing.navigationStart) / 1000);
                    return `<span class="ascii-art">
    .-.     
   (o o)    </span><span class="success-message">misbah@terminal</span>
   | O \\    <span class="info-message">---------------</span>
    \\   \\   <span class="info-message">OS:</span> MisbahOS v3.0
     \`~~~'  <span class="info-message">Host:</span> ${window.location.hostname}
            <span class="info-message">Kernel:</span> WebKit ${navigator.appVersion}
            <span class="info-message">Uptime:</span> ${uptime} seconds
            <span class="info-message">Shell:</span> msh 3.0
            <span class="info-message">Resolution:</span> ${window.screen.width}x${window.screen.height}
            <span class="info-message">Terminal:</span> Interactive Web Terminal
            <span class="info-message">CPU:</span> ${navigator.hardwareConcurrency || 'Unknown'} cores
            <span class="info-message">Memory:</span> ${navigator.deviceMemory || 'Unknown'} GB`;
                },
                animation: null,
                action: () => this.logAnalytics('command_neofetch'),
                description: 'System information'
            },
            exit: {
                output: `<span class="error-message">Error: Cannot exit from web terminal!</span>
<span class="info-message">Nice try though... You're stuck here forever! 😈</span>
<span class="system-message">Just kidding! Feel free to explore or close the tab.</span>`,
                animation: 'bounce',
                action: () => this.logAnalytics('command_exit'),
                description: 'Exit terminal (just kidding!)'
            }
        };
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const command = this.input.value.trim();
            if (command) {
                this.processCommand(command);
                this.history.push(command);
                this.historyIndex = this.history.length;
            }
            this.input.value = '';
            this.hideAutocomplete();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.isAutocompleting) {
                this.navigateSuggestions(-1);
            } else if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.isAutocompleting) {
                this.navigateSuggestions(1);
            } else if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        } else if (e.key === 'Escape') {
            this.hideAutocomplete();
        }
        
        // Play typing sound
        if (this.soundEnabled && this.typingSound && !['Enter', 'Tab', 'Escape'].includes(e.key)) {
            this.typingSound.currentTime = 0;
            this.typingSound.volume = 0.2;
            this.typingSound.play().catch(() => {});
        }
    }
    
    handleInput(e) {
        const input = this.input.value.toLowerCase();
        if (input.length > 0) {
            this.showAutocomplete(input);
        } else {
            this.hideAutocomplete();
        }
    }
    
    showAutocomplete(input) {
        const matches = Object.entries(this.commands)
            .filter(([cmd, data]) => cmd.startsWith(input) && !data.hidden)
            .slice(0, 5);
        
        if (matches.length > 0 && this.suggestionsEl) {
            this.suggestionsEl.innerHTML = '';
            matches.forEach(([cmd, data], index) => {
                const suggestion = document.createElement('div');
                suggestion.className = 'suggestion';
                if (index === this.currentSuggestionIndex) {
                    suggestion.classList.add('selected');
                }
                suggestion.innerHTML = `
                    <span class="suggestion-command">${cmd}</span>
                    <span class="suggestion-description">${data.description || ''}</span>
                `;
                suggestion.addEventListener('click', () => {
                    this.input.value = cmd;
                    this.hideAutocomplete();
                    this.input.focus();
                });
                this.suggestionsEl.appendChild(suggestion);
            });
            this.suggestionsEl.classList.add('show');
            this.isAutocompleting = true;
        } else {
            this.hideAutocomplete();
        }
    }
    
    hideAutocomplete() {
        if (this.suggestionsEl) {
            this.suggestionsEl.classList.remove('show');
            this.isAutocompleting = false;
            this.currentSuggestionIndex = -1;
        }
    }
    
    navigateSuggestions(direction) {
        const suggestions = this.suggestionsEl.querySelectorAll('.suggestion');
        if (suggestions.length === 0) return;
        
        this.currentSuggestionIndex += direction;
        if (this.currentSuggestionIndex < 0) {
            this.currentSuggestionIndex = suggestions.length - 1;
        } else if (this.currentSuggestionIndex >= suggestions.length) {
            this.currentSuggestionIndex = 0;
        }
        
        suggestions.forEach((s, i) => {
            s.classList.toggle('selected', i === this.currentSuggestionIndex);
        });
        
        const selectedCmd = suggestions[this.currentSuggestionIndex].querySelector('.suggestion-command').textContent;
        this.input.value = selectedCmd;
    }
    
    autocomplete() {
        const input = this.input.value.toLowerCase();
        if (!input) return;
        
        const matches = Object.keys(this.commands)
            .filter(cmd => cmd.startsWith(input) && !this.commands[cmd].hidden);
        
        if (matches.length === 1) {
            this.input.value = matches[0];
            this.hideAutocomplete();
        } else if (matches.length > 1) {
            this.showAutocomplete(input);
        }
    }
    
    processCommand(command) {
        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="prompt">$</span> <span>${this.escapeHtml(command)}</span>`;
        this.output.appendChild(commandLine);
        
        // Log command to analytics
        this.logAnalytics('terminal_command', { command: command.toLowerCase() });
        
        // Parse command and arguments
        const parts = command.toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        if (cmd === 'clear') {
            this.output.innerHTML = '';
            return;
        }
        
        // Check for easter eggs
        if (command.toLowerCase() === 'konami') {
            this.konamiCode();
            return;
        }
        
        if (command.toLowerCase() === 'sudo rm -rf /') {
            this.systemDestroy();
            return;
        }
        
        const commandData = this.commands[cmd];
        if (commandData) {
            // Add output
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-line';
            let output = commandData.output;
            if (typeof output === 'function') {
                output = output(args);
            }
            outputLine.innerHTML = output;
            this.output.appendChild(outputLine);
            
            // Trigger animation
            if (commandData.animation) {
                this.triggerAnimation(commandData.animation, commandData);
            }
            
            // Execute action
            if (commandData.action) {
                commandData.action();
            }
        } else {
            // Command not found
            const errorLine = document.createElement('div');
            errorLine.className = 'terminal-line';
            errorLine.innerHTML = `<span class="error-message">Command not found: ${this.escapeHtml(command)}</span>
<span class="info-message">Type 'help' for available commands.</span>`;
            this.output.appendChild(errorLine);
            
            // Suggest similar commands
            const similar = this.findSimilarCommands(cmd);
            if (similar.length > 0) {
                const suggestionLine = document.createElement('div');
                suggestionLine.className = 'terminal-line';
                suggestionLine.innerHTML = `<span class="info-message">Did you mean: ${similar.join(', ')}?</span>`;
                this.output.appendChild(suggestionLine);
            }
        }
        
        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    findSimilarCommands(input) {
        const commands = Object.keys(this.commands).filter(cmd => !this.commands[cmd].hidden);
        return commands
            .filter(cmd => {
                // Check if input is substring of command
                if (cmd.includes(input)) return true;
                // Check Levenshtein distance
                return this.levenshteinDistance(input, cmd) <= 2;
            })
            .slice(0, 3);
    }
    
    levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    welcomeAnimation() {
        const welcomeIcons = ['👋', '💻', '🚀', '✨'];
        welcomeIcons.forEach((icon, index) => {
            setTimeout(() => {
                const iconEl = document.createElement('div');
                iconEl.className = 'terminal-icon';
                iconEl.textContent = icon;
                iconEl.style.left = (20 + index * 20) + '%';
                iconEl.style.top = '20%';
                iconEl.style.fontSize = '60px';
                this.animContainer.appendChild(iconEl);
                setTimeout(() => iconEl.remove(), 2000);
            }, index * 200);
        });
    }
    
    trackKonamiCode(e) {
        if (e.key === this.konamiSequence[this.konamiProgress]) {
            this.konamiProgress++;
            if (this.konamiProgress === this.konamiSequence.length) {
                this.konamiCode();
                this.konamiProgress = 0;
            }
        } else {
            this.konamiProgress = 0;
        }
    }
    
    konamiCode() {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line';
        outputLine.innerHTML = `<span class="success-message">🎮 KONAMI CODE ACTIVATED! 🎮</span>
<span class="info-message">You've unlocked god mode! Just kidding... or am I? 😉</span>
<span class="warning-message">+30 lives added!</span>`;
        this.output.appendChild(outputLine);
        
        // Trigger special animation
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const icon = document.createElement('div');
                icon.className = 'terminal-icon';
                icon.textContent = ['🎮', '⬆️', '⬇️', '⬅️', '➡️', '🅰️', '🅱️', '❤️'][Math.floor(Math.random() * 8)];
                icon.style.left = Math.random() * window.innerWidth + 'px';
                icon.style.top = Math.random() * window.innerHeight + 'px';
                icon.style.fontSize = '40px';
                icon.style.animationDuration = '3s';
                this.animContainer.appendChild(icon);
                setTimeout(() => icon.remove(), 3000);
            }, i * 50);
        }
        
        this.logAnalytics('easter_egg_konami');
        this.playSound('powerup');
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    systemDestroy() {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line';
        outputLine.innerHTML = `<span class="error-message">⚠️ SYSTEM DESTRUCTION INITIATED...</span>`;
        this.output.appendChild(outputLine);
        
        setTimeout(() => {
            const glitch = document.createElement('div');
            glitch.className = 'glitch-effect';
            document.body.appendChild(glitch);
            
            setTimeout(() => {
                glitch.remove();
                const jokeLine = document.createElement('div');
                jokeLine.className = 'terminal-line';
                jokeLine.innerHTML = `<span class="success-message">Just kidding! This is a web browser, not Linux! 😄</span>
<span class="info-message">Nice try though, you rebel!</span>`;
                this.output.appendChild(jokeLine);
                this.container.scrollTop = this.container.scrollHeight;
            }, 300);
        }, 1000);
        
        this.logAnalytics('easter_egg_sudo');
    }
    
    createPortal(destination) {
        const portal = document.createElement('div');
        portal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, #00ff00, transparent);
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(portal);
        
        // Animate portal opening
        let size = 0;
        const expand = setInterval(() => {
            size += 50;
            portal.style.width = size + 'px';
            portal.style.height = size + 'px';
            if (size > Math.max(window.innerWidth, window.innerHeight) * 2) {
                clearInterval(expand);
            }
        }, 20);
    }
    
    createGlitchEffect() {
        const glitch = document.createElement('div');
        glitch.className = 'glitch-effect';
        document.body.appendChild(glitch);
        
        // Distort terminal briefly
        this.container.style.transform = 'skewX(5deg)';
        setTimeout(() => {
            this.container.style.transform = '';
            glitch.remove();
        }, 300);
        
        // Add glitch text
        const glitchText = ['01001000', '11010010', '00101110', '10110101'];
        glitchText.forEach((text, i) => {
            setTimeout(() => {
                const span = document.createElement('span');
                span.style.cssText = `
                    position: fixed;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    color: #00ff00;
                    font-family: monospace;
                    font-size: 20px;
                    z-index: 9999;
                    text-shadow: 0 0 10px #00ff00;
                `;
                span.textContent = text;
                document.body.appendChild(span);
                setTimeout(() => span.remove(), 500);
            }, i * 100);
        });
    }
    
    startPartyMode() {
        const partyEmojis = ['🎉', '🎊', '🎈', '🎆', '🎇', '✨', '🌟', '💫', '🥳', '🍾'];
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        // Disco lights effect
        let colorIndex = 0;
        const disco = setInterval(() => {
            document.documentElement.style.setProperty('--primary-green', colors[colorIndex]);
            colorIndex = (colorIndex + 1) % colors.length;
        }, 200);
        
        // Party emojis
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.className = 'terminal-icon';
                emoji.textContent = partyEmojis[Math.floor(Math.random() * partyEmojis.length)];
                emoji.style.left = Math.random() * window.innerWidth + 'px';
                emoji.style.top = Math.random() * window.innerHeight + 'px';
                emoji.style.fontSize = (20 + Math.random() * 40) + 'px';
                emoji.style.animationDuration = (2 + Math.random() * 3) + 's';
                this.animContainer.appendChild(emoji);
                setTimeout(() => emoji.remove(), 5000);
            }, i * 100);
        }
        
        // Stop disco after 5 seconds
        setTimeout(() => {
            clearInterval(disco);
            document.documentElement.style.setProperty('--primary-green', '#00ff00');
        }, 5000);
    }
    
    triggerAnimation(type, command) {
        if (!this.animContainer) return;
        
        switch (type) {
            case 'icons':
                if (command.icons) {
                    command.icons.forEach((icon, index) => {
                        setTimeout(() => {
                            const iconEl = document.createElement('div');
                            iconEl.className = 'terminal-icon';
                            iconEl.textContent = icon;
                            iconEl.style.left = Math.random() * window.innerWidth + 'px';
                            iconEl.style.top = window.innerHeight / 2 + 'px';
                            this.animContainer.appendChild(iconEl);
                            setTimeout(() => iconEl.remove(), 2000);
                        }, index * 200);
                    });
                }
                break;
                
            case 'android':
                const androidIcon = document.createElement('div');
                androidIcon.className = 'terminal-icon';
                androidIcon.textContent = '🤖';
                androidIcon.style.left = '50%';
                androidIcon.style.top = '50%';
                androidIcon.style.fontSize = '150px';
                androidIcon.style.marginLeft = '-75px';
                androidIcon.style.marginTop = '-75px';
                androidIcon.style.animation = 'androidBoot 3s ease-out forwards';
                this.animContainer.appendChild(androidIcon);
                
                // Add Android boot text
                const bootText = ['ANDROID', 'BOOTING...', 'SYSTEM READY'];
                bootText.forEach((text, i) => {
                    setTimeout(() => {
                        const textEl = document.createElement('div');
                        textEl.style.cssText = `
                            position: fixed;
                            top: 60%;
                            left: 50%;
                            transform: translateX(-50%);
                            color: #00ff00;
                            font-size: 24px;
                            text-shadow: 0 0 20px #00ff00;
                            z-index: 9999;
                        `;
                        textEl.textContent = text;
                        this.animContainer.appendChild(textEl);
                        setTimeout(() => textEl.remove(), 1000);
                    }, i * 800);
                });
                
                setTimeout(() => androidIcon.remove(), 3000);
                break;
                
            case 'matrix':
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ';
                for (let i = 0; i < 100; i++) {
                    setTimeout(() => {
                        const matrixChar = document.createElement('div');
                        matrixChar.className = 'matrix-rain';
                        matrixChar.textContent = chars[Math.floor(Math.random() * chars.length)];
                        matrixChar.style.left = Math.random() * window.innerWidth + 'px';
                        matrixChar.style.animationDelay = Math.random() * 3 + 's';
                        matrixChar.style.animationDuration = (2 + Math.random() * 3) + 's';
                        this.animContainer.appendChild(matrixChar);
                        setTimeout(() => matrixChar.remove(), 5000);
                    }, i * 30);
                }
                break;
                
            case 'bounce':
                const terminal = document.querySelector('.terminal-container');
                terminal.style.animation = 'none';
                setTimeout(() => {
                    terminal.style.animation = 'terminalBounce 0.5s ease-out';
                }, 10);
                break;
                
            case 'redirect':
                // Portal effect handled by createPortal method
                break;
                
            case 'hack':
                const hackText = ['ACCESSING MAINFRAME...', 'BYPASSING FIREWALL...', 'INJECTING PAYLOAD...', 'ACCESS GRANTED!'];
                hackText.forEach((text, i) => {
                    setTimeout(() => {
                        const hackEl = document.createElement('div');
                        hackEl.style.cssText = `
                            position: fixed;
                            top: ${20 + i * 15}%;
                            left: 50%;
                            transform: translateX(-50%);
                            color: #00ff00;
                            font-size: 20px;
                            font-family: monospace;
                            text-shadow: 0 0 10px #00ff00;
                            z-index: 9999;
                            opacity: 0;
                            animation: fadeIn 0.5s forwards;
                        `;
                        hackEl.textContent = text;
                        this.animContainer.appendChild(hackEl);
                        setTimeout(() => hackEl.remove(), 3000);
                    }, i * 500);
                });
                break;
        }
    }
    
    playSound(type) {
        // Placeholder for sound effects
        // In a real implementation, you would play actual sound files
        if (this.soundEnabled) {
            console.log(`Playing sound: ${type}`);
        }
    }
    
    logAnalytics(eventName, parameters = {}) {
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, eventName, parameters);
        }
    }
}

// Add additional CSS for new animations
const style = document.createElement('style');
style.textContent = `
@keyframes androidBoot {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.2) rotate(180deg);
        opacity: 1;
    }
    100% {
        transform: scale(1) rotate(360deg);
        opacity: 1;
    }
}
`;
document.head.appendChild(style);