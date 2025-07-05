/**
 * Interactive Terminal Module
 * Main terminal site - misbahwebsite.com
 */

export class InteractiveTerminal {
    constructor(config = {}) {
        this.container = config.container || document.getElementById('terminalContent');
        this.input = config.input || document.getElementById('terminalInput');
        this.output = config.output || document.getElementById('terminalOutput');
        this.animContainer = config.animContainer || document.getElementById('terminalAnimations');
        
        this.history = [];
        this.historyIndex = -1;
        this.commands = this.initializeCommands();
        
        this.init();
    }
    
    init() {
        if (this.input) {
            this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
            this.input.focus();
        }
        
        if (this.container) {
            this.container.addEventListener('click', () => {
                if (this.input) this.input.focus();
            });
        }
    }
    
    initializeCommands() {
        return {
            help: {
                output: `<span class="success-message">Available Commands:</span>
<span class="info-message">• help</span> - Show this help menu
<span class="info-message">• about</span> - Learn about Misbah
<span class="info-message">• portfolio</span> - Visit portfolio site
<span class="info-message">• games</span> - Play retro games
<span class="info-message">• skills</span> - View technical skills
<span class="info-message">• experience</span> - View work experience
<span class="info-message">• contact</span> - Get contact information
<span class="info-message">• projects</span> - See featured projects
<span class="info-message">• android</span> - Show Android animation
<span class="info-message">• matrix</span> - Enter the Matrix
<span class="info-message">• clear</span> - Clear terminal
<span class="info-message">• date</span> - Show current date
<span class="info-message">• weather</span> - Check the weather
<span class="info-message">• joke</span> - Tell a developer joke
<span class="info-message">• coffee</span> - Brew some coffee
<span class="info-message">• hack</span> - Initiate hacking sequence
<span class="info-message">• secret</span> - ???
<span class="info-message">• linkedin</span> - Open LinkedIn profile
<span class="info-message">• github</span> - Open GitHub profile
<span class="info-message">• email</span> - Send an email
<span class="info-message">• resume</span> - Download resume
<span class="info-message">• whoami</span> - Who are you?
<span class="info-message">• fortune</span> - Get your fortune`,
                animation: null
            },
            about: {
                output: `<span class="success-message">About Misbah ul Haque:</span>
Innovative Android Developer with 2+ years of experience
Specializing in Kotlin, Jetpack Compose, and Android TV applications
Currently working at Viacom Media (JioCinema) as SDE II

<span class="info-message">Fun fact: I optimize apps that handle 50M+ concurrent users!</span>`,
                animation: 'bounce',
                action: () => this.logAnalytics('command_about')
            },
            portfolio: {
                output: `<span class="success-message">Opening portfolio...</span>
<span class="info-message">Redirecting to portfolio.misbahwebsite.com</span>`,
                animation: 'redirect',
                action: () => {
                    this.logAnalytics('navigate_portfolio');
                    setTimeout(() => {
                        window.location.href = 'https://portfolio.misbahwebsite.com';
                    }, 1000);
                }
            },
            games: {
                output: `<span class="success-message">Launching retro games...</span>
<span class="info-message">Redirecting to games.misbahwebsite.com</span>`,
                animation: 'icons',
                icons: ['🎮', '🕹️', '👾', '🎯'],
                action: () => {
                    this.logAnalytics('navigate_games');
                    setTimeout(() => {
                        window.location.href = 'https://games.misbahwebsite.com';
                    }, 1000);
                }
            },
            skills: {
                output: `<span class="success-message">Technical Skills:</span>
<span class="info-message">Languages:</span> Kotlin, Java
<span class="info-message">Frameworks:</span> Jetpack Compose, Android Leanback, ExoPlayer
<span class="info-message">Architecture:</span> MVVM, MVI, Clean Architecture
<span class="info-message">Tools:</span> Android Studio, Firebase, Git
<span class="info-message">Platforms:</span> Android Mobile, Android TV, Fire TV`,
                animation: 'icons',
                icons: ['🔧', '📱', '💻', '🚀'],
                action: () => this.logAnalytics('command_skills')
            },
            experience: {
                output: `<span class="success-message">Work Experience:</span>
<span class="info-message">SDE II - Android @ JioCinema (June 2024 - Present)</span>
• Optimized app startup time by 60%
• Maintained 99.9% crash-free rate during IPL 2024
• Handled 50M+ concurrent users

<span class="info-message">SDE I - Android @ JioCinema (July 2022 - May 2024)</span>
• Redesigned Android TV Player Skin
• Built Login with QR Code feature
• Improved rendering time by 40%`,
                animation: 'bounce',
                action: () => this.logAnalytics('command_experience')
            },
            contact: {
                output: `<span class="success-message">Contact Information:</span>
<span class="info-message">Email:</span> misbahul8@gmail.com
<span class="info-message">Phone:</span> +91-8376069521
<span class="info-message">LinkedIn:</span> linkedin.com/in/misbahhaque
<span class="info-message">GitHub:</span> github.com/Misbah542
<span class="info-message">Location:</span> Bengaluru, India`,
                animation: 'icons',
                icons: ['📧', '📱', '🔗', '💻', '📍'],
                action: () => this.logAnalytics('command_contact')
            },
            projects: {
                output: `<span class="success-message">Featured Projects:</span>
<span class="info-message">• JioCinema Android TV</span> - Streaming app with 50M+ users
<span class="info-message">• Tetris Game</span> - MVVM + Jetpack Compose
<span class="info-message">• Weather App</span> - Dynamic UI with OpenWeather API
<span class="info-message">• Portfolio Website</span> - Interactive 3D experience

Type 'portfolio' to see more projects!`,
                animation: 'icons',
                icons: ['📺', '🎮', '🌤️', '🌐'],
                action: () => this.logAnalytics('command_projects')
            },
            android: {
                output: `<span class="success-message">Launching Android animation...</span>`,
                animation: 'android',
                action: () => this.logAnalytics('command_android')
            },
            matrix: {
                output: `<span class="success-message">Welcome to the Matrix, Neo...</span>
<span class="info-message">Follow the white rabbit 🐰</span>`,
                animation: 'matrix',
                action: () => this.logAnalytics('command_matrix')
            },
            clear: {
                output: 'CLEAR',
                animation: null,
                action: () => this.logAnalytics('command_clear')
            },
            date: {
                output: () => `<span class="info-message">Current Date:</span> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
                animation: null
            },
            weather: {
                output: `<span class="info-message">Current Weather in Bengaluru:</span>
<span class="success-message">🌤️ Partly Cloudy, 25°C</span>
<span class="info-message">Perfect coding weather!</span>`,
                animation: 'icons',
                icons: ['☀️', '⛅', '🌤️']
            },
            joke: {
                output: () => {
                    const jokes = [
                        "Why do programmers prefer dark mode? Because light attracts bugs!",
                        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
                        "Why do Java developers wear glasses? Because they don't C#!",
                        "What's a programmer's favorite place? The Foo Bar!",
                        "Why did the developer go broke? Because he used up all his cache!",
                        "Why did the programmer quit his job? Because he didn't get arrays!",
                        "What's the object-oriented way to become wealthy? Inheritance!",
                        "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
                        "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
                        "How do you comfort a JavaScript bug? You console it!"
                    ];
                    const joke = jokes[Math.floor(Math.random() * jokes.length)];
                    this.logAnalytics('command_joke', { joke });
                    return `<span class="success-message">${joke}</span>`;
                },
                animation: 'icons',
                icons: ['😄', '😂', '🤣']
            },
            coffee: {
                output: `<span class="success-message">☕ Brewing coffee...</span>
<span class="info-message">while(true) { code(); sip(); }</span>
<span class="system-message">Coffee ready! Productivity +100%</span>`,
                animation: 'icons',
                icons: ['☕', '☕', '☕', '☕'],
                action: () => this.logAnalytics('command_coffee')
            },
            hack: {
                output: `<span class="success-message">Initiating hacking sequence...</span>
<span class="info-message">[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% Complete</span>
<span class="error-message">Access Denied! Just kidding 😄</span>
<span class="system-message">Remember: With great power comes great electricity bills!</span>`,
                animation: 'matrix',
                action: () => this.logAnalytics('command_hack')
            },
            secret: {
                output: `<span class="success-message">🎉 You found the secret command!</span>
<span class="info-message">Here's a cookie for you: 🍪</span>
<span class="system-message">Fun fact: This terminal has ${Object.keys(this.commands).length} commands!</span>
<span class="info-message">Try: konami (↑↑↓↓←→←→BA)</span>`,
                animation: 'icons',
                icons: ['🎉', '🎊', '✨', '🍪', '🏆'],
                action: () => this.logAnalytics('command_secret')
            },
            linkedin: {
                output: `<span class="success-message">Opening LinkedIn profile...</span>`,
                animation: 'icons',
                icons: ['🔗', '💼'],
                action: () => {
                    this.logAnalytics('social_linkedin');
                    window.open('https://linkedin.com/in/misbahhaque', '_blank');
                }
            },
            github: {
                output: `<span class="success-message">Opening GitHub profile...</span>`,
                animation: 'icons',
                icons: ['💻', '🐙'],
                action: () => {
                    this.logAnalytics('social_github');
                    window.open('https://github.com/Misbah542', '_blank');
                }
            },
            email: {
                output: `<span class="success-message">Opening email client...</span>
<span class="info-message">Email: misbahul8@gmail.com</span>`,
                animation: 'icons',
                icons: ['📧', '✉️'],
                action: () => {
                    this.logAnalytics('contact_email');
                    window.location.href = 'mailto:misbahul8@gmail.com';
                }
            },
            resume: {
                output: `<span class="success-message">Downloading resume...</span>
<span class="info-message">Opening Misbah_ul_Haque_Resume.pdf</span>`,
                animation: 'icons',
                icons: ['📄', '⬇️'],
                action: () => {
                    this.logAnalytics('download_resume');
                    window.open('https://portfolio.misbahwebsite.com/resume/Misbah_ul_Haque_Resume.pdf', '_blank');
                }
            },
            whoami: {
                output: `<span class="info-message">You are a curious visitor exploring Misbah's terminal!</span>
<span class="success-message">Welcome, fellow developer! 👋</span>
<span class="system-message">Your IP has been logged... just kidding! 😄</span>`,
                animation: 'bounce',
                action: () => this.logAnalytics('command_whoami')
            },
            fortune: {
                output: () => {
                    const fortunes = [
                        "Your code will compile on the first try today!",
                        "A great debugging session awaits you.",
                        "You will find the missing semicolon within 5 minutes.",
                        "Your pull request will be approved without changes.",
                        "Coffee will taste extra good today.",
                        "You will solve that bug you've been chasing.",
                        "Your app will go viral!",
                        "Stack Overflow will have the exact answer you need.",
                        "Today's commits will be bug-free.",
                        "You will discover a new favorite framework."
                    ];
                    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
                    this.logAnalytics('command_fortune');
                    return `<span class="success-message">🔮 ${fortune}</span>`;
                },
                animation: 'icons',
                icons: ['🔮', '✨', '🌟']
            }
        };
    }
    
    handleKeyDown(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.processCommand(command);
                this.history.push(command);
                this.historyIndex = this.history.length;
            }
            this.input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autocomplete();
        }
    }
    
    autocomplete() {
        const input = this.input.value.toLowerCase();
        if (!input) return;
        
        const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(input));
        if (matches.length === 1) {
            this.input.value = matches[0];
        } else if (matches.length > 1) {
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-line';
            outputLine.innerHTML = `<span class="info-message">Suggestions: ${matches.join(', ')}</span>`;
            this.output.appendChild(outputLine);
            this.container.scrollTop = this.container.scrollHeight;
        }
    }
    
    processCommand(command) {
        // Add command to output
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="prompt">$</span> <span>${command}</span>`;
        this.output.appendChild(commandLine);
        
        // Log command to analytics
        this.logAnalytics('terminal_command', { command: command.toLowerCase() });
        
        if (command.toLowerCase() === 'clear') {
            this.output.innerHTML = '';
            return;
        }
        
        // Check for easter eggs
        if (command.toLowerCase() === 'konami') {
            this.konamiCode();
            return;
        }
        
        const cmd = this.commands[command.toLowerCase()];
        if (cmd) {
            // Add output
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-line';
            outputLine.innerHTML = typeof cmd.output === 'function' ? cmd.output() : cmd.output;
            this.output.appendChild(outputLine);
            
            // Trigger animation
            if (cmd.animation) {
                this.triggerAnimation(cmd.animation, cmd);
            }
            
            // Execute action
            if (cmd.action) {
                cmd.action();
            }
        } else {
            // Command not found
            const errorLine = document.createElement('div');
            errorLine.className = 'terminal-line';
            errorLine.innerHTML = `<span class="error-message">Command not found: ${command}</span>
<span class="info-message">Type 'help' for available commands.</span>`;
            this.output.appendChild(errorLine);
        }
        
        // Scroll to bottom
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    konamiCode() {
        const outputLine = document.createElement('div');
        outputLine.className = 'terminal-line';
        outputLine.innerHTML = `<span class="success-message">🎮 KONAMI CODE ACTIVATED! 🎮</span>
<span class="info-message">You've unlocked god mode! Just kidding... or am I? 😉</span>`;
        this.output.appendChild(outputLine);
        
        // Trigger special animation
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const icon = document.createElement('div');
                icon.className = 'terminal-icon';
                icon.textContent = ['🎮', '⬆️', '⬇️', '⬅️', '➡️', '🅰️', '🅱️'][Math.floor(Math.random() * 7)];
                icon.style.left = Math.random() * window.innerWidth + 'px';
                icon.style.top = Math.random() * window.innerHeight + 'px';
                icon.style.fontSize = '30px';
                this.animContainer.appendChild(icon);
                setTimeout(() => icon.remove(), 2000);
            }, i * 50);
        }
        
        this.logAnalytics('easter_egg_konami');
        this.container.scrollTop = this.container.scrollHeight;
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
                androidIcon.style.fontSize = '100px';
                androidIcon.style.marginLeft = '-50px';
                androidIcon.style.marginTop = '-50px';
                this.animContainer.appendChild(androidIcon);
                setTimeout(() => androidIcon.remove(), 2000);
                break;
                
            case 'matrix':
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ';
                for (let i = 0; i < 50; i++) {
                    setTimeout(() => {
                        const matrixChar = document.createElement('div');
                        matrixChar.className = 'matrix-rain';
                        matrixChar.textContent = chars[Math.floor(Math.random() * chars.length)];
                        matrixChar.style.left = Math.random() * window.innerWidth + 'px';
                        matrixChar.style.animationDelay = Math.random() * 3 + 's';
                        this.animContainer.appendChild(matrixChar);
                        setTimeout(() => matrixChar.remove(), 3000);
                    }, i * 50);
                }
                break;
                
            case 'bounce':
                const terminal = document.querySelector('.terminal-container');
                terminal.style.animation = 'none';
                setTimeout(() => {
                    terminal.style.animation = 'terminalBounce 0.5s ease-out';
                }, 10);
                break;
        }
    }
    
    logAnalytics(eventName, parameters = {}) {
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, eventName, parameters);
        }
    }
}