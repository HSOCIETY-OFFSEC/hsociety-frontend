<div align="center">

# 🛡️ Hsociety OffSec

<img src="public/hsociety-logo-white.png" alt="Hsociety Logo" width="200"/>

### Elite Offensive Security Solutions Platform

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://hsociety.vercel.app)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

**Hsociety OffSec** is a cutting-edge platform designed for **offensive security professionals**, **ethical hackers**, and **cybersecurity enthusiasts**. We provide comprehensive penetration testing services, security assessments, and hands-on training experiences.

[Live Demo](https://hsociety.vercel.app) · [Report Bug](https://github.com/your-username/hsociety-offsec/issues) · [Request Feature](https://github.com/your-username/hsociety-offsec/issues)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Landing Page
<img src="docs/screenshots/landing.png" alt="Landing Page" width="800"/>

### 📊 Dashboard
<img src="docs/screenshots/dashboard.png" alt="Dashboard" width="800"/>

### 🔐 Authentication
<img src="docs/screenshots/auth.png" alt="Authentication" width="800"/>

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Core Features
- 🔒 **Penetration Testing Services**
  - Web Application Security
  - Network Security Assessments
  - API Security Testing
- 🚨 **Red Team Operations**
  - Advanced Threat Simulation
  - Social Engineering Tests
  - Physical Security Assessments
- 📝 **Security Audits**
  - Compliance Reviews
  - Code Security Analysis
  - Infrastructure Hardening

</td>
<td width="50%">

### 💻 Platform Features
- ⚡ **Lightning Fast Performance**
  - Built with Vite for optimal speed
  - React 18 with latest features
  - Optimized bundle sizes
- 🎨 **Modern UI/UX**
  - Dark/Light theme toggle
  - Fully responsive design
  - Smooth animations
- 🔐 **Secure Authentication**
  - JWT-based auth (ready)
  - Password strength validation
  - Form validation

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![React Icons](https://img.shields.io/badge/React_Icons-Latest-E91E63?style=for-the-badge&logo=react&logoColor=white)

### Styling
![CSS3](https://img.shields.io/badge/CSS3-Custom-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Responsive](https://img.shields.io/badge/Design-Responsive-00D9FF?style=for-the-badge)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js

### Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/your-username/hsociety-offsec.git
cd hsociety-offsec
```

2️⃣ **Install dependencies**
```bash
npm install
# or
yarn install
```

3️⃣ **Add logo files**

Place your logo files in the `public` directory:
- `public/hsociety-logo-white.png` (for dark theme)
- `public/hsociety-logo-black.png` (for light theme)

4️⃣ **Start development server**
```bash
npm run dev
# or
yarn dev
```

5️⃣ **Open your browser**

Navigate to [http://localhost:5173](http://localhost:5173) to see the app in action! 🎉

---

## 📁 Project Structure
```
hsociety-offsec/
├── public/
│   ├── hsociety-logo-white.png    # Logo for dark theme
│   └── hsociety-logo-black.png    # Logo for light theme
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   ├── Footer.jsx         # Footer component
│   │   │   └── ThemeToggle.jsx    # Theme switcher
│   │   ├── Logo.jsx               # Logo component
│   │   └── ui/                    # UI components
│   ├── context/
│   │   └── ThemeContext.jsx       # Theme management
│   ├── data/
│   │   ├── pentests.json          # Mock pentest data
│   │   ├── tasks.json             # Mock task data
│   │   └── users.json             # Mock user data
│   ├── pages/
│   │   ├── Landing.jsx            # Home page
│   │   ├── Login.jsx              # Login page
│   │   ├── Signup.jsx             # Signup page
│   │   └── Dashboard.jsx          # Dashboard
│   ├── styles/
│   │   └── theme.css              # Theme variables
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # App styles
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── index.html                     # HTML template
├── package.json                   # Dependencies
└── vite.config.js                 # Vite configuration
```

---

## 🎯 Usage

### Development

Run the development server with hot reload:
```bash
npm run dev
```

### Build for Production

Create an optimized production build:
```bash
npm run build
```

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

---

## 🎨 Customization

### Changing Theme Colors

Edit `src/styles/theme.css` to customize the color scheme:
```css
/* Dark theme colors */
.dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --accent-primary: #00ff88;  /* Change this for different accent */
  /* ... */
}
```

### Adding New Pages

1. Create a new component in `src/pages/`
2. Import and add route in `src/App.jsx`:
```jsx
import NewPage from './pages/NewPage';

// Inside Routes
<Route path="/new-page" element={<NewPage />} />
```

### Modifying Mock Data

Update JSON files in `src/data/` to change:
- Penetration test projects (`pentests.json`)
- Security tasks (`tasks.json`)
- Team members (`users.json`)

---

## 🌐 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/hsociety-offsec)

Or manually:

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/hsociety-offsec)

### Other Platforms

This app can be deployed to any static hosting service:
- **GitHub Pages**
- **Cloudflare Pages**
- **Firebase Hosting**
- **AWS S3 + CloudFront**

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Steps to Contribute

1. **Fork the repository**
   
   Click the "Fork" button at the top right of this page.

2. **Clone your fork**
```bash
   git clone https://github.com/YOUR-USERNAME/hsociety-offsec.git
   cd hsociety-offsec
```

3. **Create a feature branch**
```bash
   git checkout -b feature/AmazingFeature
```

4. **Make your changes**
   
   Follow our code style and conventions.

5. **Commit your changes**
```bash
   git commit -m 'Add some AmazingFeature'
```

6. **Push to your branch**
```bash
   git push origin feature/AmazingFeature
```

7. **Open a Pull Request**
   
   Go to the original repository and click "New Pull Request"

### Code Style Guidelines

- Use **functional components** with hooks
- Follow **React best practices**
- Write **clean, readable code** with comments
- Use **meaningful variable names**
- Test your changes before submitting

---

## 📝 Roadmap

- [ ] Backend API integration
- [ ] User authentication system
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered vulnerability detection
- [ ] Collaborative penetration testing tools
- [ ] Integration with popular security tools (Burp Suite, Metasploit, etc.)

---

## 🐛 Known Issues

- Mock data is currently used for all content
- Authentication is UI-only (no backend)
- Some animations may lag on older devices

See [open issues](https://github.com/your-username/hsociety-offsec/issues) for a full list of known issues and feature requests.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
```
MIT License

Copyright (c) 2026 Hsociety OffSec

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 👥 Team

<table>
<tr>
<td align="center">
<a href="https://github.com/your-username">
<img src="https://github.com/your-username.png" width="100px;" alt=""/>
<br />
<sub><b>Your Name</b></sub>
</a>
<br />
<a href="#" title="Code">💻</a>
<a href="#" title="Design">🎨</a>
<a href="#" title="Ideas">🤔</a>
</td>
<!-- Add more team members -->
</tr>
</table>

---

## 🙏 Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/) for the beautiful icon library
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [Vercel](https://vercel.com/) for seamless deployment
- All our contributors and supporters!

---

## 📞 Contact & Support

<div align="center">

**Have questions or need support?**

[![Email](https://img.shields.io/badge/Email-contact@hsociety.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:contact@hsociety.com)
[![Twitter](https://img.shields.io/badge/Twitter-@hsociety-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/hsociety)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Hsociety-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/company/hsociety)

---

**Made with ❤️ by the Hsociety team**

⭐ **Star this repo if you find it helpful!** ⭐

</div>