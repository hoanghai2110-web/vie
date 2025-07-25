# VieMind - AI Competition Platform

## Overview

VieMind is a Vietnamese AI competition platform that connects the local and international AI community through real-world competitions. It's a full-stack web application built with modern technologies, featuring a React frontend, Express backend, PostgreSQL database with Drizzle ORM, and comprehensive authentication and competition management systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for logging and error handling
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Uploads**: Multer for handling file submissions
- **Database Provider**: Neon Database (serverless PostgreSQL)

### Database Design
The system uses a PostgreSQL database with the following key entities:
- **Users**: Core user accounts with roles (user, organization, admin)
- **Organizations**: Company/partner accounts that can create competitions
- **Competitions**: AI competitions with categories, prizes, and deadlines
- **Participants**: User participation in competitions with team information
- **Submissions**: File submissions with scoring and ranking data
- **Sessions**: User session management

## Key Components

### Authentication System
- JWT-based authentication with secure token storage
- Role-based access control (users, organizations, admins)
- Password hashing with bcrypt
- User registration and login flows
- Session management

### Competition Management
- Competition creation and management for organizations
- Multiple competition categories (Computer Vision, NLP, Tabular)
- Prize management with multiple currency support
- Deadline and status tracking
- Public/private leaderboard options

### File Upload System
- Submission handling for notebooks and prediction files
- Support for CSV, ZIP, and other formats
- File storage and management
- Submission history tracking

### Multilingual Support
- Vietnamese and English language support
- Context-based translation system
- Localized content and UI elements

### UI/UX Features
- Responsive design for desktop and mobile
- Modern component library with consistent theming
- Dark/light mode support
- Interactive leaderboards and competition cards
- Profile management with social links

## Data Flow

1. **User Authentication**: JWT tokens stored in localStorage, validated on each API request
2. **Competition Discovery**: Users browse competitions with filtering and search
3. **Participation**: Users join competitions and submit files
4. **Scoring**: Submissions are processed and scored automatically
5. **Leaderboards**: Real-time ranking updates based on submission scores
6. **Rewards**: Prize distribution system for winners

## External Dependencies

### Core Technologies
- **Database**: Neon Database (PostgreSQL)
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with PostCSS
- **File Processing**: Multer for uploads

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast production builds
- **Vite**: Development server with hot reload
- **Drizzle Kit**: Database migrations and schema management

## Deployment Strategy

### Development Environment
- Vite dev server for frontend hot reloading
- tsx for TypeScript execution in development
- Shared schema between frontend and backend for type safety

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with ESBuild as single Node.js application
- Database migrations handled via Drizzle Kit
- Environment variables for database connection and JWT secrets

### Infrastructure Requirements
- PostgreSQL database (Neon serverless recommended)
- Node.js runtime environment
- File storage for competition datasets and submissions
- SSL certificates for secure JWT token transmission

The application follows a monorepo structure with shared TypeScript schemas, enabling type-safe communication between frontend and backend while maintaining clear separation of concerns.