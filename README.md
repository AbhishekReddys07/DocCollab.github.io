# DocCollab - Collaborative Document Editing Platform

A modern, feature-rich collaborative document editing platform built with React, TypeScript, and Supabase. DocCollab enables teams to create, edit, and share documents with real-time collaboration, advanced privacy controls, and comprehensive version tracking.

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
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/doccollab.git
cd doccollab
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for the project to be fully set up

2. **Get Your Supabase Credentials**
   - In your Supabase dashboard, go to Settings > API
   - Copy your Project URL and anon/public key

3. **Run Database Migration**
   - In your Supabase dashboard, go to the SQL Editor
   - Copy the contents of `supabase/migrations/20250628105344_dark_bar.sql`
   - Paste and run the SQL script to create all necessary tables and policies

### 4. Environment Configuration
```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

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

**Supabase Connection Error**
- Ensure your `.env` file has the correct Supabase URL and anon key
- Verify your Supabase project is active and accessible

**Database Schema Issues**
- Make sure you've run the migration script in your Supabase SQL Editor
- Check that all tables and RLS policies are properly created

**Authentication Problems**
- Verify email confirmation is disabled in Supabase Auth settings (for development)
- Check that your Supabase project allows sign-ups

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: Comprehensive setup and usage guide above
- **Supabase**: [supabase.com](https://supabase.com)
- **Tiptap Editor**: [tiptap.dev](https://tiptap.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the Supabase dashboard for any configuration issues
3. Ensure all environment variables are properly set
4. Verify the database migration was successful

---

Built with ❤️ using React, TypeScript, Tailwind CSS, and Supabase