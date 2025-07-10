# Misbah's Interactive Portfolio Ecosystem

A multi-site portfolio project featuring an interactive terminal, 3D portfolio showcase, and retro gaming platform.

## 🌐 Live Sites

- **Terminal**: [https://buildwithmisbah.cc](https://buildwithmisbah.cc)
- **Portfolio**: [https://portfolio.buildwithmisbah.cc](https://portfolio.buildwithmisbah.cc)
- **Games**: [https://games.buildwithmisbah.cc](https://games.buildwithmisbah.cc)

## 🚀 Features

### Terminal Site (Main)
- Interactive command-line interface with 25+ commands
- Fun animations and Easter eggs
- 3D vector background with interactive mode
- Quick navigation to portfolio and games

### Portfolio Site
- Professional showcase with 3D elements
- Dynamic project gallery
- Integrated resume download
- Smooth animations and transitions

### Games Site
- Collection of retro pixel games
- Classic games: Snake, Tetris, Pong, Space Invaders, Breakout
- Responsive design for all devices
- High score tracking

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, React (for games)
- **3D Graphics**: Three.js
- **Analytics**: Firebase Analytics
- **Hosting**: Render , Vercel
- **Domain**: Cloudflare

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-project.git
cd portfolio-project
```

2. Install dependencies for games site:
```bash
cd games
npm install
```

3. Set up Firebase Analytics:
   - Create a Firebase project
   - Add your Firebase configuration to each `firebase-analytics.js` file
   - Update the Firebase config in `.env` files

## 🔧 Development

### Terminal Site
```bash
cd terminal
# Open index.html in a local server
python -m http.server 8000
```

### Portfolio Site
```bash
cd portfolio
# Open index.html in a local server
python -m http.server 8001
```

### Games Site
```bash
cd games
npm start
# Runs on http://localhost:3000
```

## 🚀 Deployment

### Using Render

1. Create three static sites on Render
2. Connect your GitHub repository
3. Set build commands:
   - Terminal: No build command (static files)
   - Portfolio: No build command (static files)
   - Games: `npm run build`
4. Set publish directories:
   - Terminal: `terminal`
   - Portfolio: `portfolio`
   - Games: `games/build`

### Domain Configuration (Cloudflare)

1. Add CNAME records:
   - `@` → terminal.render.com
   - `portfolio` → portfolio.render.com
   - `games` → games.render.com

## 📊 Analytics

Firebase Analytics is integrated across all sites to track:
- Page views
- User engagement
- Command usage (terminal)
- Game plays and scores
- Navigation patterns

## 🎮 Terminal Commands

- `help` - Show all commands
- `about` - Learn about Misbah
- `portfolio` - Navigate to portfolio
- `games` - Navigate to games
- `skills` - View technical skills
- `matrix` - Enter the Matrix
- `hack` - Initiate hacking sequence
- And many more fun commands!

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Misbah ul Haque**
- Email: misbahul8@gmail.com
- LinkedIn: [misbahhaque](https://linkedin.com/in/misbahhaque)
- GitHub: [Misbah542](https://github.com/Misbah542)

## 🙏 Acknowledgments

- Three.js community for amazing 3D graphics
- Firebase for analytics
- Render for hosting
- All the open-source contributors