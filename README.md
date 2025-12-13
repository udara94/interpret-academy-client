# Interpret Academy Client Web App

This is the client-facing web application for Interpret Academy, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- User authentication (login, register, password reset)
- Dashboard for learning and practice
- Dialog practice sessions
- User profile management
- Responsive design with dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/local/api
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
interpret-academy-client/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   └── layout.tsx         # Root layout
├── components/            # React components
├── lib/                   # Utilities and helpers
│   ├── api/              # API client functions
│   ├── routes.ts         # Route constants
│   └── store/            # Redux store
├── types/                # TypeScript types
├── auth.ts               # NextAuth configuration
└── middleware.ts         # Next.js middleware
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXTAUTH_SECRET` - Secret key for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your app URL (for production, use your domain)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Authentication

The app uses NextAuth.js v5 for authentication. Users can:
- Sign up for a new account
- Log in with email and password
- Reset forgotten passwords
- Access protected dashboard routes

## API Integration

The app communicates with the backend API at `/app/*` endpoints for user-facing features and `/cms/auth/*` for authentication.

## Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Build the app: `npm run build`
3. Start the server: `npm start`

## License

Private - Interpret Academy

