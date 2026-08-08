# finance-dashboard-backend
A modern, full-stack financial tracking application with real-time expense management, interactive visualizations, and secure authentication. Built with React, Firebase, and Spring Boot.

Finance Tracker Firebase TailwindCSS Vite

✨ Features
🔐 Authentication & Security
Firebase Google OAuth: Real Google sign-in with account selection popup
Username/Password Auth: Local registration and login with encrypted storage
Role-Based Access Control (RBAC): Admin and user role management
Protected Routes: Secure navigation with authentication guards
Session Persistence: Auto-login with localStorage
📊 Financial Management
Expense Tracking: Add, view, and categorize expenses
Interactive Dashboard: Real-time statistics and insights
Category Management: 5 predefined categories (Food, Utilities, Transport, Entertainment, Other)
Transaction History: Sortable table with all transactions
Budget Analytics: Track total expenses and daily averages
📈 Data Visualization
Doughnut Chart: Visual expense breakdown by category
Bar Chart: Daily spending trends
Stat Cards: Quick overview of total expenses, transaction count, and averages
Color-Coded Categories: Easy identification with vibrant colors
🎨 Modern UI/UX
Dark Theme: Sleek gradient design with glassmorphism effects
Responsive Design: Works seamlessly on desktop, tablet, and mobile
Animated Backgrounds: Dynamic gradient animations
Smooth Transitions: Polished hover effects and interactions
Modern Icons: Lucide React icons throughout
🛠️ Tech Stack
Frontend
Technology	Version	Purpose
React	19.2.0	Core UI library for building interactive components
Vite	7.2.4	Lightning-fast build tool and dev server
TailwindCSS	4.1.17	Utility-first CSS framework for rapid styling
React Router	6.x	Client-side routing and navigation
Chart.js	4.5.1	Powerful charting library for data visualization
React-Chartjs-2	5.3.1	React wrapper for Chart.js integration
Lucide React	Latest	Modern icon library with 1000+ icons
Axios	1.13.2	HTTP client for API requests
Authentication & Backend Services
Technology	Purpose
Firebase Auth	Real Google OAuth 2.0 authentication with popup flow
Firebase SDK	Client-side Firebase integration and auth state management
LocalStorage API	Client-side data persistence for user sessions and registered users
Backend (Original)
Technology	Purpose
Java	Backend programming language
Spring Boot	RESTful API framework
Maven	Build automation and dependency management
H2/MySQL	Database options for data persistence
Development Tools
Tool	Purpose
ESLint	Code quality and consistency enforcement
PostCSS	CSS processing and optimization
Autoprefixer	Automatic vendor prefix addition
Git	Version control and collaboration
🚀 Getting Started
Prerequisites
Node.js 18+ and npm
Java Development Kit (JDK) 17+ (for backend)
Maven 3.6+ (for backend)
Firebase Account (free tier works)
Frontend Setup
Clone the repository:


Install dependencies:

npm install
Configure Firebase (Required for Google OAuth):

Follow instructions in FIREBASE_SETUP.md
Update src/config/firebase.js with your Firebase credentials
Run the development server:

npm run dev
The app will be available at http://localhost:5173

Backend Setup (Optional)
Navigate to project root:

cd Automated-Finance-Tracker
Build the project:

mvn clean install
Run the Spring Boot application:

mvn spring-boot:run
The API will start on http://localhost:8080

🔑 Authentication Options
1. Google OAuth (Recommended)
Click "Google" button
Select your Google account
Instant login with profile data
2. Username/Password
Demo Account: admin / password
Sign Up: Create a new account with username, email, and password
Sign In: Use your registered credentials
3. GitHub OAuth (Simulated)
Account selection modal for demo purposes
Full OAuth flow can be implemented similarly to Google
📁 Project Structure
Automated-Finance-Tracker/
├── frontend/                           # React Frontend Application
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   └── AccountSelectionModal.jsx  # OAuth account picker modal
│   │   ├── config/                    # Configuration files
│   │   │   └── firebase.js            # Firebase authentication setup
│   │   ├── context/                   # React Context providers
│   │   │   └── AuthContext.jsx        # Authentication state management
│   │   ├── pages/                     # Page components
│   │   │   ├── Dashboard.jsx          # Main dashboard with charts
│   │   │   └── LoginPage.jsx          # Authentication page
│   │   ├── App.jsx                    # Root component with routing
│   │   ├── App.css                    # Global styles
│   │   ├── index.css                  # Tailwind directives
│   │   └── main.jsx                   # Application entry point
│   ├── public/                        # Static assets
│   ├── node_modules/                  # Dependencies
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.js                 # Vite configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── postcss.config.js              # PostCSS configuration
│   └── eslint.config.js               # ESLint rules
│
├── src/                               # Java Backend Application
│   └── main/
│       ├── java/org/fta/              # Java source code
│       │   ├── Main.java              # Spring Boot application entry
│       │   ├── dto/                   # Data Transfer Objects
│       │   │   └── ExpenseDto.java    # Expense data transfer object
│       │   ├── entities/              # JPA Entity classes
│       │   │   ├── Budgets.java       # Budget entity
│       │   │   ├── Categories.java    # Category entity
│       │   │   ├── Expenses.java      # Expense entity
│       │   │   ├── RefreshToken.java  # JWT refresh token entity
│       │   │   ├── UserRole.java      # User role entity
│       │   │   └── Users.java         # User entity
│       │   ├── enums/                 # Enumeration types
│       │   │   └── PaymentType.java   # Payment method enum
│       │   ├── exceptions/            # Custom exceptions
│       │   │   └── ResourceNotFoundException.java
│       │   ├── repositories/          # Spring Data JPA repositories
│       │   │   ├── ExpenseRepository.java
│       │   │   ├── RefreshTokenRepository.java
│       │   │   └── UserRepository.java
│       │   └── service/               # Business logic services
│       │       ├── CustomUserDetails.java
│       │       ├── JwtService.java    # JWT token management
│       │       ├── RefreshTokenService.java
│       │       └── UserDetailsServiceImpl.java
│       └── resources/                 # Application resources
│           └── application.properties # Spring Boot configuration
│
├── .git/                              # Git version control
├── .gitignore                         # Git ignore rules
├── .idea/                             # IntelliJ IDEA settings
├── pom.xml                            # Maven build configuration
├── FIREBASE_SETUP.md                  # Firebase setup instructions
├── README.md                          # This file
├── contribution_log.txt               # Development log
└── random_commits.ps1                 # Commit generation script
Key Directories Explained
Frontend (/frontend)
components/: Reusable React components like modals and widgets
config/: Configuration files for Firebase and other services
context/: React Context API for global state (auth, theme, etc.)
pages/: Full page components (Dashboard, Login, etc.)
Backend (/src/main/java/org/fta)
entities/: Database models mapped with JPA annotations
repositories/: Data access layer using Spring Data JPA
service/: Business logic and authentication services
dto/: Data transfer objects for API requests/responses
exceptions/: Custom exception classes for error handling
🎯 Key Features Explained
Firebase Google OAuth Integration
Real Authentication: Uses Firebase's signInWithPopup for genuine Google OAuth
Account Selection: Forces account picker with prompt: 'select_account'
Auto-Sync: User data (name, email, photo) automatically synced from Google
Secure: No credentials stored locally, managed by Firebase
Hybrid Authentication System
Multiple Auth Methods: Supports Google OAuth, username/password, and simulated GitHub
Seamless Switching: Users can use different methods without conflicts
Persistent Sessions: Auto-login on page refresh using localStorage and Firebase state
Modern UI Design
Glassmorphism: Frosted glass effect with backdrop blur
Gradient Animations: Pulsing background orbs for visual interest
Dark Theme: Easy on the eyes with purple/pink accent colors
Responsive: Mobile-first design that scales beautifully
🔧 Configuration
Firebase Configuration
Edit frontend/src/config/firebase.js:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ... other config
};
Customization
Categories: Edit categories array in Dashboard.jsx
Colors: Modify Tailwind classes or tailwind.config.js
Charts: Customize in Dashboard.jsx chart configurations
📝 Available Scripts
Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
Backend
mvn clean install     # Build project
mvn spring-boot:run   # Run application
mvn test             # Run tests
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Firebase for authentication services
Chart.js for beautiful visualizations
TailwindCSS for rapid UI development
Lucide for modern icons
Vite for blazing-fast development experience
⭐ Star this repo if you find it helpful!

