# DocCollab - Collaborative Document Editing Platform

A modern, feature-rich collaborative document editing platform built with React, TypeScript, and Supabase. DocCollab enables teams to create, edit, and share documents with real-time collaboration, advanced privacy controls, and comprehensive version tracking.

## ⚠️ **IMPORTANT: Supabase Configuration Required**

**This application will NOT work without proper Supabase configuration.** You must:

1. ✅ Create a Supabase project
2. ✅ Set up environment variables with your Supabase URL and anon key
3. ✅ Run the database migration script
4. ✅ Configure authentication settings

**Without these steps, the application will fail to start with the error: "supabaseUrl is required"**

## 🚀 Features

### Core Functionality
- **Rich WYSIWYG Editor**: Powered by Tiptap with full formatting capabilities
- **Real-time Collaboration**: Live editing with multiple users
- **User Authentication**: Secure email/password authentication with Supabase Auth
- **Document Management**: Create, edit, delete, and organize documents
- **Advanced Search**: Full-text search across document titles and content
- **Auto-save**: Automatic saving with visual feedback

### Collaboration Features
- **@Mentions**: Tag users in documents with auto-notifications
- **Document Sharing**: Share documents with granular permission controls
- **Privacy Controls**: Public/private document visibility settings
- **Permission Management**: View-only or edit access for shared documents

### Advanced Features
- **Version History**: Complete document version tracking with timestamps
- **User Profiles**: Customizable user profiles with avatars
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Clean, professional interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Editor**: Tiptap (extensible rich text editor)
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- **Supabase account (REQUIRED)**

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/doccollab.git
cd doccollab
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Supabase Setup (CRITICAL - REQUIRED FOR APP TO WORK)

#### Step 1: Create a Supabase Project
1. **Go to [supabase.com](https://supabase.com) and create a new project**
2. **Choose a project name and password**
3. **Wait for the project to be fully set up (this can take a few minutes)**

#### Step 2: Get Your Supabase Credentials
1. **In your Supabase dashboard, go to Settings > API**
2. **Copy your Project URL** (looks like: `https://your-project-id.supabase.co`)
3. **Copy your anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

#### Step 3: Run Database Migration
1. **In your Supabase dashboard, go to the SQL Editor**
2. **Copy the entire contents of `supabase/migrations/20250628105344_dark_bar.sql`**
3. **Paste and run the SQL script to create all necessary tables and policies**
4. **Verify that tables were created by checking the Table Editor**

#### Step 4: Configure Authentication
1. **Go to Authentication > Settings in your Supabase dashboard**
2. **Disable "Enable email confirmations" for development**
3. **Add your local development URL to "Site URL": `http://localhost:5173`**

### 4. Environment Configuration (REQUIRED)
```bash
cp .env.example .env
```

**Update `.env` with your actual Supabase credentials:**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

**⚠️ WARNING: Replace the placeholder values with your actual Supabase credentials. The app will not work with the example values.**

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

**If you see "supabaseUrl is required" error, check that:**
- ✅ Your `.env` file exists and has the correct values
- ✅ Your Supabase project is active
- ✅ You've restarted the development server after adding environment variables

## 🚀 Deployment Guide

### Deploying from VS Code

#### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from VS Code Terminal**
   ```bash
   # Build the project first
   npm run build
   
   # Deploy to Vercel
   vercel
   ```

4. **Configure Environment Variables (CRITICAL)**
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add environment variables:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

5. **Alternative: GitHub Integration**
   - Push your code to GitHub
   - Connect your GitHub repo to Vercel
   - Vercel will auto-deploy on every push

#### Option 2: Deploy to Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build and Deploy**
   ```bash
   # Build the project
   npm run build
   
   # Deploy to Netlify
   netlify deploy --prod --dir=dist
   ```

4. **Set Environment Variables (CRITICAL)**
   ```bash
   # Set environment variables via CLI
   netlify env:set VITE_SUPABASE_URL "your-supabase-url"
   netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
   ```

#### Option 3: Deploy to GitHub Pages

1. **Update package.json homepage**
   ```json
   {
     "homepage": "https://yourusername.github.io/doccollab"
   }
   ```

2. **Deploy**
   ```bash
   npm run deploy
   ```

3. **Configure GitHub Pages**
   - Go to your GitHub repository settings
   - Navigate to Pages section
   - Select "Deploy from a branch" and choose "gh-pages"

**⚠️ Note for GitHub Pages:** Since GitHub Pages doesn't support server-side environment variables, you'll need to build with environment variables set locally or use GitHub Actions.

#### Option 4: Deploy to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables (CRITICAL)**
   ```bash
   railway variables set VITE_SUPABASE_URL=your-url
   railway variables set VITE_SUPABASE_ANON_KEY=your-key
   ```

### VS Code Extensions for Deployment

Install these VS Code extensions to streamline deployment:

1. **Vercel** - Official Vercel extension
2. **Netlify** - Netlify integration
3. **GitHub Pull Requests and Issues** - GitHub integration
4. **GitLens** - Enhanced Git capabilities

### Deployment Checklist

Before deploying, ensure:

- [ ] **Supabase project is created and configured**
- [ ] **Database migration has been run successfully**
- [ ] **Environment variables are set correctly in deployment platform**
- [ ] **Supabase authentication settings allow your production domain**
- [ ] Build process completes without errors (`npm run build`)
- [ ] All dependencies are properly installed
- [ ] RLS policies are enabled and working

### Environment Variables for Production (CRITICAL)

**Your deployment will fail without these environment variables:**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Make sure to:**
- ✅ Set these in your deployment platform (Vercel, Netlify, etc.)
- ✅ Use your actual Supabase credentials, not placeholder values
- ✅ Verify the values are correct by checking your Supabase dashboard

### Post-Deployment Configuration

1. **Update Supabase Auth Settings**
   - Add your production domain to allowed origins in Supabase Auth settings
   - Update redirect URLs for password reset
   - Example: `https://your-app.vercel.app`

2. **Test Core Functionality**
   - User registration and login
   - Document creation and editing
   - Sharing and collaboration features
   - Search functionality

3. **Monitor Performance**
   - Check Supabase dashboard for usage
   - Monitor application performance
   - Set up error tracking if needed

## 🗄️ Database Schema

The application uses the following main tables:

### Core Tables
- **users**: User profiles and metadata (linked to Supabase auth.users)
- **documents**: Document storage with content and metadata
- **document_shares**: Document sharing and permissions
- **document_versions**: Version history tracking
- **mentions**: User mentions and notifications

### Key Features
- **Full-text Search**: Generated tsvector column for efficient document search
- **Row Level Security**: All tables protected with comprehensive RLS policies
- **Foreign Key Constraints**: Proper relationships with cascade deletes
- **Indexes**: Optimized for performance on common queries

All tables are protected with Row Level Security (RLS) policies for data security.

## 🚦 Usage Guide

### Getting Started
1. **Sign Up**: Create an account with email and password
2. **Create Document**: Click "New Document" to start writing
3. **Rich Editing**: Use the toolbar for formatting (bold, italic, headings, lists, etc.)
4. **Auto-save**: Your work is automatically saved as you type

### Collaboration
1. **Mention Users**: Type `@username` to mention and notify other users
2. **Share Documents**: Use the Share button to give others access
3. **Set Permissions**: Choose between view-only or edit access
4. **Privacy Controls**: Toggle between private and public visibility

### Advanced Features
1. **Search**: Use the search bar to find documents by title or content
2. **Version History**: View and compare previous versions of documents
3. **Document Management**: Filter by owned or shared documents

## 🔐 Security Features

- **Row Level Security**: Database-level security with Supabase RLS
- **JWT Authentication**: Secure token-based authentication
- **Permission Controls**: Granular document access permissions
- **Input Validation**: Comprehensive form validation with Zod
- **XSS Protection**: Sanitized content rendering

## 🎨 Design System

- **Color Palette**: Blue primary (#3B82F6), Indigo secondary (#6366F1), Green accent (#10B981)
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent 8px spacing system
- **Animations**: Subtle transitions and micro-interactions with Framer Motion
- **Responsive**: Mobile-first approach with breakpoints at 768px and 1024px

## 🧪 Demo Accounts

For testing purposes, you can create demo accounts or use these example credentials:

```
Email: demo@doccollab.com
Password: password123

Email: user2@doccollab.com  
Password: password123
```

*Note: You'll need to create these accounts through the sign-up process as they're not pre-seeded.*

## 📱 Mobile Support

DocCollab is fully responsive and optimized for:
- **Mobile phones**: 320px - 767px
- **Tablets**: 768px - 1023px  
- **Desktop**: 1024px and above

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication forms
│   ├── Dashboard/      # Dashboard components
│   ├── Editor/         # Document editor components
│   └── Layout/         # Layout components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

**❌ "supabaseUrl is required" Error**
- **Cause**: Missing or incorrect Supabase configuration
- **Solution**: 
  1. Ensure your `.env` file exists with correct values
  2. Verify your Supabase project URL and anon key are correct
  3. Restart the development server after adding environment variables
  4. Check that your Supabase project is active and accessible

**❌ Supabase Connection Error**
- Ensure your `.env` file has the correct Supabase URL and anon key
- Verify your Supabase project is active and accessible
- Check that you're using the correct project URL format: `https://your-project-id.supabase.co`

**❌ Database Schema Issues**
- Make sure you've run the migration script in your Supabase SQL Editor
- Check that all tables and RLS policies are properly created
- Verify the migration completed without errors

**❌ Authentication Problems**
- Verify email confirmation is disabled in Supabase Auth settings (for development)
- Check that your Supabase project allows sign-ups
- Ensure your site URL is configured correctly in Supabase Auth settings

**❌ Deployment Issues**
- Ensure all environment variables are set in your deployment platform
- Verify the build process completes successfully
- Check that your Supabase project allows requests from your production domain
- Make sure you're using the correct environment variable names (with VITE_ prefix)

### Environment Variable Checklist

If you're having issues, verify:
- [ ] `.env` file exists in the root directory
- [ ] `VITE_SUPABASE_URL` is set to your actual Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` is set to your actual anon key
- [ ] No extra spaces or quotes around the values
- [ ] Development server was restarted after adding variables
- [ ] For production: environment variables are set in your deployment platform

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: Comprehensive setup and usage guide above
- **Supabase**: [supabase.com](https://supabase.com)
- **Tiptap Editor**: [tiptap.dev](https://tiptap.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

## 📞 Support

If you encounter any issues or have questions:

1. **Check the troubleshooting section above**
2. **Verify your Supabase configuration is correct**
3. **Ensure all environment variables are properly set**
4. **Confirm the database migration was successful**
5. **Check your Supabase dashboard for any configuration issues**

**Remember: This application requires a properly configured Supabase project to function. Without it, you'll encounter the "supabaseUrl is required" error.**

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase
