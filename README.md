# Space Math Drill 🚀

A fun, space-themed arithmetic practice app for elementary students. Practice addition, subtraction, multiplication, and division while exploring the solar system!

## Features

### 🎯 Learning Modes
- **Practice Mode**: Customize your practice session with:
  - Choose operations (➕ ➖ ✖️ ➗)
  - Select difficulty (Easy, Normal, Hard)
  - Set question count (5-50 questions)
- **Daily Challenge**: Quick 10-question session to maintain your streak

### 🚀 Gamification
- **XP & Levels**: Earn experience points and level up
- **Coins**: Collect coins for completing problems
- **Badges**: Unlock 12+ achievements
- **Streak System**: Track consecutive days of practice
- **Planet Journey**: Watch your rocket travel through the solar system

### 👥 Multi-Profile Support
- Create multiple profiles (perfect for siblings)
- Each profile has independent progress tracking
- No login required - all data stored locally

### 📊 Progress Tracking
- Detailed stats by operation type
- Session history
- Accuracy tracking
- Streak calendar

### 🎨 Child-Friendly Design
- Colorful space theme
- Large, readable fonts and buttons
- Touch-friendly interface
- Positive reinforcement (no penalties)
- Immediate feedback with animations

## Installation & Running

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## PWA Features

This app is a Progressive Web App (PWA), which means:
- ✅ Install to home screen on mobile devices
- ✅ Works offline after first load
- ✅ Fast loading with caching
- ✅ App-like experience

## Technology Stack

- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - Lightweight, no framework overhead
- **IndexedDB** - Local data storage with localStorage fallback
- **PWA** - Progressive Web App capabilities
- **CSS Custom Properties** - Themable design system

## Project Structure

```
space-math-drill/
├── public/
│   └── icons/              # PWA icons
├── src/
│   ├── screens/            # UI screens
│   │   ├── ProfileSelectScreen.js
│   │   ├── HomeScreen.js
│   │   ├── SettingsScreen.js
│   │   ├── QuestionScreen.js
│   │   ├── ResultScreen.js
│   │   ├── ProgressScreen.js
│   │   └── RewardsScreen.js
│   ├── services/           # Core logic
│   │   ├── storageService.js      # Data persistence
│   │   ├── problemGenerator.js    # Math problem generation
│   │   └── gamificationService.js # XP, levels, badges
│   ├── utils/
│   │   └── router.js       # Client-side routing
│   ├── style.css           # Design system & styles
│   └── main.js             # App entry point
├── index.html
├── vite.config.js
└── package.json
```

## Problem Generation

### Difficulty Levels

**Easy**
- Addition: 1-digit + 1-digit (0-10)
- Subtraction: 1-digit - 1-digit (no negatives)
- Multiplication: Times tables (1-9)
- Division: Simple divisors (e.g., 56 ÷ 7)

**Normal**
- Addition: 2-digit + 1/2-digit (with carrying)
- Subtraction: 2-digit - 1/2-digit (with borrowing)
- Multiplication: 1-digit × 2-digit
- Division: 2-digit ÷ 1-digit (even division)

**Hard**
- Addition: 3-digit + 2/3-digit
- Subtraction: 3-digit - 2/3-digit
- Multiplication: 2-digit × 1/2-digit
- Division: 3-digit ÷ 1-digit (even division)

### Operations
- All problems are generated dynamically
- Division uses `dividend = divisor × quotient` to ensure even division
- No hardcoded problems - infinite variety

## Data Storage

All data is stored locally on the device:
- **IndexedDB** for modern browsers
- **localStorage** fallback for compatibility
- No server, no accounts, no tracking
- Safe for children (no external data collection)

### Data Models

**Profile**
- ID, name, avatar color
- XP, level, coins
- Streak count and last played date
- Earned badges
- Customizations

**Session**
- Profile ID
- Mode (practice/daily)
- Operations, difficulty, question count
- Problems with answers
- Time spent, accuracy
- Rewards earned

## Gamification System

### XP & Levels
- Base: 10 XP per problem
- Difficulty multipliers: Easy (1x), Normal (1.5x), Hard (2x)
- Accuracy bonus: up to 1.5x for perfect scores
- Daily challenge bonus: 1.2x
- 100+ levels with increasing XP requirements

### Badges (12 Total)
- 🚀 Lift Off - Complete first session
- 🔥 Streaks (3, 7, 30 days)
- 💯 Perfect session
- 📝 Problem milestones (50, 100, 500)
- ➕✖️ Operation mastery
- 🌟 Level milestones (10, 25)

### Planet Journey
Your rocket travels through the solar system as you level up:
1. Earth Orbit (Level 1-4)
2. The Moon (Level 5-9)
3. Mars (Level 10-14)
4. Asteroid Belt (Level 15-19)
5. Jupiter (Level 20-29)
6. Saturn (Level 30-39)
7. Uranus (Level 40-49)
8. Neptune (Level 50-74)
9. Deep Space (Level 75+)

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 11.3+)
- Mobile browsers with PWA support

## Privacy & Safety

- ✅ No user accounts required
- ✅ No personal data collected
- ✅ No external tracking
- ✅ No advertisements
- ✅ 100% offline capable
- ✅ All data stays on device

## Recommended Usage

For best results:
- **Daily practice**: 10-15 minutes per day
- **Start easy**: Build confidence before increasing difficulty
- **Mix operations**: Practice all four operations regularly
- **Use daily challenges**: Maintain streak motivation
- **Review mistakes**: Learn from incorrect answers

## Future Enhancements

Potential additions:
- Time attack mode
- Fraction operations
- Word problems
- Parent dashboard
- Adaptive difficulty
- More customization options
- Sound effects (optional)

## License

This project is created for educational purposes.

## Support

For issues or questions, please check:
1. Browser console for error messages
2. Clear browser cache/data if experiencing issues
3. Try in a different browser
4. Check that JavaScript is enabled

---

**Made with ❤️ for young mathematicians exploring the cosmos!** 🌟🚀
