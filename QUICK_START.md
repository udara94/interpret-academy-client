# Quick Start Guide - Interpret Academy Client

## Initial Setup

1. **Install Dependencies**
   ```bash
   cd interpret-academy-client
   npm install
   ```

2. **Create Environment File**
   Create `.env.local` in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/local/api
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```
   
   Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
interpret-academy-client/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes (NextAuth)
│   ├── dashboard/           # Dashboard pages
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   └── layout.tsx          # Root layout
├── lib/
│   ├── api/                # API client functions
│   ├── routes.ts          # Route constants
│   └── store/             # Redux store
├── types/                 # TypeScript types
├── auth.ts               # NextAuth configuration
└── middleware.ts         # Route protection
```

## Features

✅ User authentication (login, register, password reset)
✅ Protected dashboard routes
✅ Redux state management
✅ API integration with backend
✅ Responsive design with dark mode
✅ TypeScript support

## Next Steps

1. **Test Authentication**
   - Register a new account
   - Log in with credentials
   - Access protected dashboard

2. **Customize Dashboard**
   - Add dialog practice pages
   - Create profile management
   - Add practice sessions

3. **Connect to Backend**
   - Ensure backend is running
   - Verify API URL in `.env.local`
   - Test API endpoints

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/local/api` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL | `http://localhost:3000` |

## Troubleshooting

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your app URL
- Ensure backend is running and accessible

### API Connection Issues
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running on the specified port
- Verify CORS is configured on backend

### Build Errors
- Run `npm run type-check` to check TypeScript errors
- Run `npm run lint` to check code quality
- Clear `.next` folder and rebuild

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```



