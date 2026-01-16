# Ari's Study Room 📚

A cozy, minimalistic study blog for Computer Science notes and technical interview preparation. Built with Next.js 15, featuring a custom CMS with a block-based editor for creating and managing content through a beautiful admin interface.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)

## ✨ Features

### 🎨 Design & Aesthetic
- **Lavender-pink pastels** with soft, cozy vibes
- **Clean typography** using Inter font
- **Rounded corners** and subtle shadows for warm, inviting feel
- **Responsive design** for mobile and desktop
- **Cozy study space** aesthetic (not corporate or sterile)

### 📝 Content Management System (CMS)
- **Block-based editor** similar to Notion/Medium
- **9 content block types**:
  - Problem Statement - for coding challenges
  - Examples - input/output examples with explanations
  - Math/Approach - LaTeX equations and algorithm explanations
  - Code Block - syntax-highlighted code with language selection
  - Complexity Analysis - time and space complexity
  - Walkthrough - step-by-step explanations with optional code
  - Related Problems - links to similar problems
  - Tips List - tips, warnings, or notes with variants
  - Rich Text - general HTML content sections
- **Live preview** while editing
- **Draft/Published** status for articles
- **Article metadata** - difficulty, time/space complexity, approach

### 🗂️ Category Management
- **Dynamic categories** - create, edit, delete from admin UI
- **Nested subcategories** - organize content hierarchically
- **Customizable appearance** - icons, colors with preset themes
- **Color shuffle** - randomize colors with one click
- **Article counts** - see how many articles in each category

### 🔐 Authentication
- **Secure admin access** with NextAuth.js
- **Protected routes** - admin dashboard requires login
- **Session management** with JWT

### 📚 Content Display
- **Dynamic routing** - categories and articles from database
- **Breadcrumb navigation** - auto-generated from hierarchy
- **Coming Soon state** - for empty categories
- **SEO metadata** - dynamic titles and descriptions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB Atlas account (free tier works great)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd study-room
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```env
   # MongoDB connection string (from MongoDB Atlas)
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/studyroom"

   # NextAuth.js secret (generate with: openssl rand -base64 32)
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # Admin credentials for initial setup
   ADMIN_EMAIL="your-email@example.com"
   ADMIN_PASSWORD="your-secure-password"
   ```

4. **Set up the database**
   ```bash
   # Push schema to MongoDB
   npx prisma db push

   # Generate Prisma client
   npx prisma generate

   # Seed initial categories
   npm run seed
   ```

5. **Create admin user**
   ```bash
   npm run create-admin
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Styling**: Tailwind CSS with custom color palette
- **Icons**: Lucide React
- **Code Highlighting**: React Syntax Highlighter
- **Math Rendering**: KaTeX

## 📁 Project Structure

```
study-room/
├── src/
│   ├── app/
│   │   ├── [...slug]/          # Dynamic route (categories + articles)
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── articles/       # Article management
│   │   │   ├── categories/     # Category management
│   │   │   └── login/          # Admin login
│   │   ├── api/                # API routes
│   │   │   ├── articles/       # Article CRUD
│   │   │   ├── categories/     # Category CRUD
│   │   │   └── auth/           # NextAuth endpoints
│   │   ├── page.tsx            # Home page
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── admin/              # Admin UI components
│   │   │   ├── ArticleForm.tsx
│   │   │   ├── BlockEditor.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   └── block-editors/  # Individual block editors
│   │   ├── blocks/             # Block renderers for display
│   │   ├── Breadcrumb.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── auth.ts             # NextAuth configuration
│   └── types/
│       └── blocks.ts           # Block type definitions
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Category seeding script
├── scripts/
│   └── create-admin.ts         # Admin user creation
└── package.json
```

## 🎨 Customization

### Color Palette
The project uses a custom lavender-pink color scheme defined in `tailwind.config.ts`:

```typescript
colors: {
  lavender: {
    50: '#faf5ff',
    100: '#f3e8ff',
    // ... more shades
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    // ... more shades
  },
  warmGray: {
    50: '#fafaf9',
    100: '#f5f5f4',
    // ... more shades
  }
}
```

### Adding Content

1. **Login to admin** at `/admin`
2. **Create categories** - Go to Categories → New Category
3. **Create articles** - Go to Dashboard → New Article
4. **Add blocks** - Use the block editor to add content sections
5. **Publish** - Set status to "Published" when ready

### Block Types

| Block Type | Use Case |
|------------|----------|
| Problem Statement | Coding challenge descriptions |
| Examples | Input/output examples |
| Math/Approach | Equations and algorithm theory |
| Code Block | Syntax-highlighted code |
| Complexity Analysis | Big O notation |
| Walkthrough | Step-by-step explanations |
| Related Problems | Links to similar content |
| Tips List | Tips, warnings, notes |
| Rich Text | General HTML content |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
4. Deploy!

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Add `0.0.0.0/0` to Network Access (or Vercel's IPs)
4. Get your connection string and add to `DATABASE_URL`

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed initial categories |
| `npm run create-admin` | Create admin user |

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing | Yes |
| `NEXTAUTH_URL` | Base URL of your app | Yes |
| `ADMIN_EMAIL` | Email for admin user | For setup |
| `ADMIN_PASSWORD` | Password for admin user | For setup |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📋 Update Log

### January 2026

**Authentication & Security Fixes**
- Fixed admin route protection - `/admin` was accessible without authentication due to middleware matcher not covering the base route
- Updated middleware to use `getToken` from `next-auth/jwt` with proper secure cookie name (`__Secure-next-auth.session-token`)
- Fixed logout redirect issue caused by `NEXTAUTH_URL` in `.env.local` pointing to Vercel instead of localhost

**Admin Dashboard**
- Added logout button to admin dashboard header

**UI/UX Improvements**
- Redesigned landing page banner with cleaner, more academic aesthetic
  - Replaced animated blobs and bouncing emojis with subtle background elements
  - Added visual card component with topic pills
  - Two-column layout with welcome text and decorative card
- Simplified navbar design
  - Logo and name aligned to the left
  - Removed subtitle text
  - Clean gradient background with subtle border

**Code Cleanup**
- Removed debug console.log statements from auth configuration and middleware

**Caching & Data Refresh Fixes**
- Fixed category/article deletion not refreshing the page - replaced `router.refresh()` with `window.location.reload()` for reliable cache clearing
- Added `export const dynamic = 'force-dynamic'` to admin pages and landing page to prevent Next.js 15 aggressive caching

**Block Editor Improvements**
- Implemented drag-and-drop reordering for content blocks using native HTML5 Drag and Drop API
- Added visual feedback during drag operations (opacity change, highlighted drop target)
- Up/down arrow buttons retained as fallback option

**Article Editor UX**
- Changed save behavior: editing existing articles now stays on page with success message instead of redirecting to dashboard
- New articles redirect to their edit page after creation for continued editing
- Added auto-dismissing success notification (3 seconds)

---

## 👩‍💻 About

**Ari's Study Room** is a personal study blog created by Arundhati for organizing Computer Science notes and technical interview preparation materials. The goal is to create a warm, inviting space that makes studying feel cozy rather than corporate.

---

Made with 💜 by Arundhati
