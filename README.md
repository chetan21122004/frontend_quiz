# AIvalytics Frontend

A modern React frontend for the AIvalytics MCQ generation and test management platform.

## Features

- **Modern UI**: Built with React, Vite, and Bootstrap 5
- **Authentication**: Secure login/register for teachers and students
- **Teacher Dashboard**: Create tests, manage students, view analytics
- **Student Dashboard**: Take tests, view results, track performance
- **AI Integration**: Generate MCQs using AI through the Express backend
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic content updates and notifications

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Fetch API
- **Backend**: Express.js API with Supabase database

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Running Express backend (see `../backendQuiz/`)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
   
   Note: No Supabase configuration needed in frontend - all database operations go through the Express backend.

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── ui/             # Generic UI components
│   ├── teacher/        # Teacher-specific components
│   └── student/        # Student-specific components
├── pages/              # Page components
│   ├── auth/           # Login, Register pages
│   ├── teacher/        # Teacher dashboard, create test, etc.
│   └── student/        # Student dashboard, tests, etc.
├── lib/                # Utilities and configurations
│   ├── api/            # API client and endpoints
│   ├── AuthContext.jsx # Authentication context
│   └── supabase.js     # Supabase client configuration
├── App.jsx             # Main app component with routing
├── main.jsx            # App entry point
└── index.css           # Global styles with Bootstrap
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend communicates with the Express backend through the API client located at `src/lib/api/client.js`. The client handles:

- Authentication (login, register, logout)
- MCQ generation and management
- Test creation and management
- Student management
- Performance analytics

## Authentication Flow

1. **Teacher Registration**: Creates account in `profiles` table with role 'teacher'
2. **Student Login**: Quick login/register system for students
3. **Protected Routes**: Dashboard access requires authentication
4. **Role-based Access**: Different interfaces for teachers vs students
5. **Session Management**: Uses localStorage for session persistence

## Key Features

### For Teachers
- **Dashboard**: Overview of tests, students, and performance
- **Create Tests**: AI-powered MCQ generation with customizable parameters
- **Test Management**: Edit, publish, and manage tests
- **Student Analytics**: View student performance and insights
- **Class Management**: Manage student enrollments and progress

### For Students
- **Dashboard**: View available tests and personal progress
- **Test Taking**: Clean, distraction-free test interface
- **Results**: Detailed results with explanations and insights
- **Performance Tracking**: Progress analytics and improvement suggestions

## Styling and Theming

The application uses a custom theme built on Bootstrap 5:

- **Primary Color**: Emerald green (`#10b981`)
- **Secondary Color**: Blue (`#3b82f6`)
- **Custom Components**: Enhanced cards, buttons, and form elements
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Ready for dark mode implementation

## Environment Variables

Create a `.env` file with:

```env
# Express Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Environment
VITE_NODE_ENV=development
```

**Important**: The frontend communicates exclusively with the Express backend. No direct Supabase configuration is needed in the frontend.

## Development Guidelines

### Component Structure
- Use functional components with hooks
- Implement proper prop types and default values
- Follow consistent naming conventions
- Keep components focused and reusable

### State Management
- Use React Context for global state (authentication)
- Local state for component-specific data
- Custom hooks for reusable logic

### API Integration
- All API calls go through the centralized client
- Proper error handling and loading states
- Consistent response formatting

### Styling
- Use Bootstrap classes for layout and common styles
- Custom CSS for unique components
- Maintain responsive design principles

## Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Vercel/Netlify
1. Build the project
2. Upload the `dist/` folder
3. Configure environment variables
4. Set up redirects for SPA routing

## Contributing

1. Follow the existing code style and structure
2. Write meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check if backend server is running
   - Verify `VITE_API_BASE_URL` in `.env`
   - Check network connectivity

2. **Authentication Issues**
   - Clear localStorage and try again
   - Check backend authentication endpoints
   - Verify user role permissions

3. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check for TypeScript errors
   - Verify all imports are correct

## License

This project is part of the AIvalytics platform. See the main project README for license information.