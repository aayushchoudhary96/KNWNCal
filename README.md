# KnwnCal - Project Management System

A full-stack project management application built with NestJS (API) and React (Web).

## 🏗️ Architecture

- **Backend**: NestJS + Prisma + SQLite (dev) / PostgreSQL (prod)
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Database**: SQLite for development (easy setup)
- **Authentication**: JWT with role-based access control

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Development Servers

```bash
# Start both API and Web (in parallel)
pnpm dev

# Or start individually:
pnpm api:dev    # API on http://localhost:4000
pnpm web:dev    # Web on http://localhost:5173
```

### 3. Database Setup (First Time)

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

### 4. Open in Browser

- **Web App**: [http://localhost:5173](http://localhost:5173)
- **API Health**: [http://localhost:4000/api/health](http://localhost:4000/api/health)

## 🔐 Test Users

After seeding, you can login with:

- **CEO**: `ceo@demo.local` / `Passw0rd!`
- **Manager**: `manager@demo.local` / `Passw0rd!`
- **Member**: `member@demo.local` / `Passw0rd!`
- **Client**: `client@demo.local` / `Passw0rd!`

## 📁 Project Structure

```
KnwnCal/
├── apps/
│   ├── api/          # NestJS Backend
│   │   ├── src/
│   │   ├── prisma/   # Database schema & migrations
│   │   └── package.json
│   └── web/          # React Frontend
│       ├── src/
│       └── package.json
├── package.json      # Root workspace
└── pnpm-workspace.yaml
```

## 🛠️ Development Commands

```bash
# Database
pnpm db:generate    # Generate Prisma client
pnpm db:migrate     # Run migrations
pnpm db:seed        # Seed database
pnpm db:studio      # Open Prisma Studio

# Build
pnpm build          # Build all apps
pnpm api:build      # Build API only
pnpm web:build      # Build Web only

# Lint & Format
pnpm lint           # Lint all apps
pnpm format         # Format all apps
```

## 🔧 Environment Variables

### API (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_ACCESS_SECRET="your-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
PORT=4000
CORS_ORIGIN=http://localhost:5173
```

### Web (.env)
```env
VITE_API_URL=http://localhost:4000/api
```

## 📊 Features (MVP)

- ✅ **Authentication** - JWT-based login with roles
- ✅ **RBAC** - CEO, Manager, Member, Client roles
- ✅ **Clients** - Manage client organizations
- ✅ **Projects** - Organize work by client
- ✅ **Tasks** - Track work items with stages
- ✅ **Formats** - Predefined workflow templates
- ✅ **Calendar** - Month view of task due dates
- ✅ **Board** - Kanban-style task management
- ✅ **List View** - Filterable task list

## 🎯 Next Steps

1. **Database & Auth** - Set up Prisma schema and authentication
2. **CRUD Operations** - Implement basic CRUD for all entities
3. **UI Components** - Build the main application interface
4. **Role-based Views** - Implement role-specific data access
5. **Advanced Features** - Calendar, board, and reporting

## 🐛 Troubleshooting

### API won't start
- Check if port 4000 is available
- Verify `.env` file exists in `apps/api/`
- Run `pnpm install` in `apps/api/`

### Web won't start  
- Check if port 5173 is available
- Verify `.env` file exists in `apps/web/`
- Run `pnpm install` in `apps/web/`

### Database issues
- Run `pnpm db:generate` to create Prisma client
- Check `DATABASE_URL` in API `.env`
- Run `pnpm db:migrate` to create tables

## 📝 License

MIT