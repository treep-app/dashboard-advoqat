# Advoqat Admin Dashboard

A production-ready admin dashboard for the Advoqat legal tech platform.

## Features

- **User Management**: View and manage all platform users
- **Barristers Management**: Monitor barrister accounts and verification status
- **Freelancers Management**: View and manage freelancer lawyer accounts
- **Cases Management**: Track all cases across the platform
- **Documents Management**: View AI-generated legal documents
- **Role-Based Access Control**: Super Admin and Admin roles
- **Real-time Statistics**: Dashboard overview with key metrics

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Authentication**: JWT-based

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend folder)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL:
```
NEXT_PUBLIC_API_URL=http://localhost:5001
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
dashboard-advoqat/
├── app/
│   ├── auth/              # Authentication pages
│   │   └── login/
│   ├── dashboard/          # Dashboard pages
│   │   ├── overview/      # Dashboard overview
│   │   ├── users/         # Users management
│   │   ├── barristers/    # Barristers management
│   │   ├── freelancers/   # Freelancers management
│   │   ├── cases/         # Cases management
│   │   ├── documents/     # Documents management
│   │   ├── settings/      # Settings page
│   │   └── admin-users/   # Admin user management (Super Admin only)
│   └── layout.tsx         # Root layout
├── components/
│   ├── layout/            # Layout components (Sidebar, DashboardLayout)
│   ├── providers/         # Context providers
│   └── ui/                # ShadCN UI components
├── contexts/              # React contexts (AuthContext)
├── services/              # API service layer
├── lib/                   # Utilities and config
├── types/                 # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Authentication

The dashboard uses JWT-based authentication. Admin users need to be created with `admin` or `super_admin` roles.

### Creating Admin Users

1. Super Admins can create new admin users through the Admin Users page
2. Or create them directly in the database with role `admin` or `super_admin`

## Backend Integration

The dashboard integrates with the existing backend API. Some endpoints may need to be created for admin-specific functionality:

- Admin user management endpoints
- Admin-specific data aggregation endpoints
- Enhanced statistics endpoints

## Development

### Adding New Pages

1. Create a new page in `app/dashboard/[page-name]/page.tsx`
2. Use the `DashboardLayout` component
3. Add navigation link in `components/layout/Sidebar.tsx`

### Adding New Services

1. Create service file in `services/[name].service.ts`
2. Use the `api` instance from `services/api.ts`
3. Define types in `types/index.ts`

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Backend API base URL
- `NEXT_PUBLIC_SITE_URL`: Frontend site URL (for production)

## Notes

- The dashboard currently uses existing backend endpoints
- Some admin-specific endpoints may need to be created in the backend
- Authentication uses the existing auth system - admin-specific auth endpoints can be added later
