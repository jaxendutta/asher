# 🌿 Asher Kim - Research Portfolio

A beautiful, garden-themed portfolio website showcasing plant biology research with playful cat elements.

![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

---

## 🌟 Features

- 🌱 **Garden Theme** - Nature-inspired design with plant animations
- 🐱 **Cat Elements** - Custom cursor, loading spinner, and companion
- 📱 **Fully Responsive** - Works beautifully on all devices
- ⚡ **Fast & Modern** - Built with Next.js 15 and React 19
- 🎨 **Unique Design** - Artistic and professional
- ♿ **Accessible** - WCAG compliant components

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## 📄 Pages

- **/** - Home with hero section
- **/about** - Research interests and skills
- **/education** - Academic timeline
- **/research** - Research experience
- **/publications** - Publications and papers
- **/talks** - Presentations and talks
- **/outreach** - Teaching and community work
- **/contact** - Get in touch

---

## 📁 Project Structure

```
asher-portfolio/
├── src/
│   ├── app/           # Pages (Next.js App Router)
│   ├── components/    # Reusable components
│   ├── data/          # Content (easy to update!)
│   ├── lib/           # Utilities
│   └── types/         # TypeScript definitions
├── public/            # Static assets
└── ...config files
```

---

## ✏️ Updating Content

All content is in `/src/data/` - just edit these files:

- **education.ts** - Degrees and awards
- **research.ts** - Research positions
- **publications.ts** - Papers and publications
- **talks.ts** - Presentations
- **outreach.ts** - Teaching experience
- **skills.ts** - Skills and interests

No code changes needed! 🎉

---

## 🎨 Customization

### Colors
Edit `/src/lib/constants.ts`:
```typescript
COLORS.forest = '#2D5F3F'  // Primary green
COLORS.sage = '#9DB8A1'     // Secondary green
COLORS.lavender = '#967BB6' // Accent purple
```

### Animations
Adjust timing in `/src/lib/constants.ts`:
```typescript
ANIMATION.bloomDuration = 600    // Bloom effect
ANIMATION.growthDuration = 1000  // Growth animation
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Icons**: react-icons
- **Animations**: CSS + PixiJS ready

---

## 📦 Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # TypeScript check
```

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Other Platforms
- Netlify
- GitHub Pages
- Any Node.js hosting

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started fast
- **[BUILD_COMPLETE.md](BUILD_COMPLETE.md)** - Full features list
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Technical details

---

## 🎯 Special Features

### Cat Cursor
Custom paw cursor that follows your mouse with click animations.

### Cat Companion  
A friendly cat sits on the side and changes moods (sleeping, sitting, looking).

### Plant Animations
Decorative plants sway gently and bloom on hover.

### Responsive Design
Mobile-first design that looks great on all screen sizes.

---

## 🤝 Contributing

This is a personal portfolio, but feel free to:
- Report bugs
- Suggest improvements
- Use as a template (with attribution)

---

## 📝 License

Personal project - All rights reserved to Asher Kim

---

## 👤 About Asher

Biology student at the University of Waterloo specializing in:
- Plant physiological responses to abiotic stress
- Beneficial plant-microbe interactions  
- Molecular mechanisms of protein subcellular transport

---

## 📧 Contact

- Email: rkim070@uottawa.ca
- LinkedIn: [linkedin.com/in/kimasher](https://linkedin.com/in/kimasher)

---

Built with 🌱 and ❤️ by [Jaxen](https://github.com/jaxendutta)