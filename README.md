# Next.js TailwindCSS + shadcn/ui Boilerplate

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/shadcn/ui-latest-000000?style=for-the-badge" alt="shadcn/ui" />
</div>

<p align="center">
  A modern, production-ready Next.js boilerplate with TailwindCSS, shadcn/ui, internationalization, and comprehensive development tools.
</p>

## ✨ Features

- 🚀 **Next.js 15** with App Router and React 19
- 🎨 **TailwindCSS 4** for modern styling
- 🧩 **shadcn/ui** components for beautiful UI
- 🌍 **Internationalization** with next-intl
- 🌗 **Dark/Light theme** support
- 📱 **Fully responsive** design
- 🔧 **TypeScript** for type safety
- 🧪 **Jest & Testing Library** for testing
- 📏 **ESLint & Prettier** for code quality
- 🗃️ **Prisma** ORM ready
- 🔄 **Redux Toolkit** for state management
- 📊 **Statsig** analytics integration
- 🎯 **Form handling** with React Hook Form + Zod
- 🎵 **Toast notifications** with Sonner
- 📁 **Well-organized** project structure

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Xjectro/nextjs-tailwindcss-shadcn-boilerplate.git
   cd nextjs-tailwindcss-shadcn-boilerplate
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── layout.tsx     # Locale-specific layout
│   │   │   └── page.tsx       # Home page
│   │   ├── layout.tsx         # Root layout
│   │   ├── robots.ts          # Robots.txt generation
│   │   └── sitemap.ts         # Sitemap generation
│   ├── components/            # Reusable components
│   │   ├── layout/           # Layout components
│   │   ├── providers/        # Context providers
│   │   └── ui/               # UI components
│   │       ├── primitives/   # shadcn/ui primitives
│   │       └── react/        # Custom React components
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization config
│   ├── lib/                  # Utility libraries
│   ├── modules/              # Feature modules
│   ├── styles/               # Global styles
│   └── utils/                # Utility functions
├── messages/                 # Translation files
├── __tests__/               # Test files
└── public/                  # Static assets
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests with Jest
```

## 🎨 UI Components

This boilerplate includes a comprehensive set of shadcn/ui components:

- **Form Components**: Input, Select, Button, Label
- **Layout Components**: Card, Dialog, Sheet, Sidebar
- **Feedback Components**: Alert, Toast (Sonner), Skeleton
- **Navigation**: Pagination
- **Data Display**: Badge, Separator
- **Utility**: Tooltip, Spinner

## 🌍 Internationalization

The project supports multiple languages using `next-intl`:

- 🇺🇸 English (`en`)
- 🇹🇷 Turkish (`tr`)

### Adding New Languages

1. Create a new message file in `messages/[locale].json`
2. Update the `src/i18n/routing.ts` configuration
3. Add translations to your message files

## 🌗 Theme Support

Built-in dark/light theme switching with:

- System preference detection
- Manual theme toggle
- Persistent theme storage
- TailwindCSS dark mode classes

## 🧪 Testing

The boilerplate includes a complete testing setup:

- **Jest** for test runner
- **Testing Library** for component testing
- **jsdom** environment for browser simulation
- Pre-configured test utilities

## 📊 Analytics & Monitoring

Integrated analytics tools:

- **Statsig** for feature flags and analytics
- **Session Replay** for user behavior tracking
- **Web Analytics** for performance monitoring

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - TailwindCSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration
- `jest.config.ts` - Jest testing configuration
- `components.json` - shadcn/ui configuration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

The project works with any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Xjectro">Xjectro</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
