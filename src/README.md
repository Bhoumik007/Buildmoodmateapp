# MoodMate – Your Daily Mood Journal & Tracker

Track your feelings. Understand yourself.

## 📖 About

MoodMate is a comprehensive mood tracking application that helps users build self-awareness through daily mood journaling. It provides a secure, user-friendly platform for tracking emotions, recognizing patterns, and improving mental wellbeing.

## ✨ Features

### 🎯 Core Functionality
- **User Authentication**
  - Secure signup with email and password
  - Login with session persistence
  - Password reset functionality
  - Automatic email confirmation

- **Mood Tracking (Full CRUD)**
  - ➕ Create mood entries with emoji selection
  - 👀 View all mood entries in chronological order
  - 🖊 Edit existing mood entries
  - ❌ Delete mood entries with confirmation
  - 🏷️ Tag entries for better organization
  - 🔍 Filter moods by tags

### 💡 Additional Features
- **Inspirational Quotes**: Rotating daily quotes on the landing page
- **Mood Improvement Tips**: Categorized tips to help boost your mood
- **Daily Mental Health Facts**: Educational content about mental health
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Instant synchronization of mood entries

### 🎨 User Experience
- Beautiful gradient design with purple and pink theme
- Smooth transitions and animations
- Toast notifications for user feedback
- Loading states for better UX
- Intuitive emoji-based mood selection
- Time-based entry sorting (most recent first)

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Database and authentication
- **Supabase Edge Functions** - Serverless API with Hono
- **Key-Value Store** - Data persistence

### Architecture
- Three-tier architecture (Frontend → Server → Database)
- RESTful API design
- Secure authentication with access tokens
- Row-level security (only users can access their own data)

## 🚀 Key Components

### Pages
1. **Landing Page** - Introduction and value proposition
2. **Signup Page** - New user registration
3. **Login Page** - Returning user authentication
4. **Forgot Password Page** - Password reset flow
5. **Dashboard** - Main application interface

### Dashboard Features
- Add new mood entries with modal form
- View mood history with cards
- Edit and delete functionality
- Tag-based filtering
- Tips section with refresh capability
- Daily facts with random rotation

## 🔐 Security Features

- Passwords hashed by Supabase Auth
- Access token-based authentication
- Protected API routes
- User-specific data isolation
- Automatic email confirmation

## 📱 Responsive Design

MoodMate is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🎯 Use Cases

- **Daily Journaling**: Track your emotional state every day
- **Pattern Recognition**: Identify triggers and patterns in your mood
- **Mental Health Awareness**: Learn about mental health through daily facts
- **Self-Improvement**: Use tips to actively improve your mood
- **Personal Growth**: Build self-awareness through consistent reflection

## 🌟 Future Enhancement Ideas

- Data visualization (mood charts and graphs)
- Export mood data
- Reminder notifications
- Dark mode toggle
- Social sharing (anonymous)
- AI-powered insights
- Mood statistics and analytics
- Multi-language support

## ⚠️ Important Notes

This application is built with Figma Make and is designed for prototyping and demos. It should not be used to collect personally identifiable information (PII) or secure sensitive health/mental health data in a production environment without proper security audits and compliance measures.

## 📄 License

This project is created for educational and demonstration purposes.

---

**Made with ❤️ for your mental wellbeing**
