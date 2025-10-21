# 🍅 Gabes Pomo - Pomodoro Timer

A beautiful, modern Pomodoro timer web application to help you stay focused and productive. Built with React and Firebase, this fully serverless app helps you manage your time effectively using the Pomodoro Technique.

[![View Live App](https://img.shields.io/badge/View%20Live%20App-368CE7?style=for-the-badge&logo=google-chrome&logoColor=white)](https://gabegaglio.github.io/pomotimer/)

## 📸 Screenshots

### Main Timer Interface

![Pomotimer Main Screen](docs/screenshots/timer-interface.png)
_Clean, distraction-free timer interface with customizable work and break periods_

### Task Management

![Task Management](docs/screenshots/task-management.png)
_Built-in task manager to keep track of what you're working on_

## ✨ Features

- **⏱️ Customizable Timers**: Set your own durations for Pomodoro sessions, short breaks, and long breaks
- **📝 Task Management**: Create and manage tasks with notes to stay organized
- **🎨 Personalization**:
  - Choose custom background colors
  - Upload your own background images
  - Settings persist across sessions
- **🔐 User Authentication**:
  - Sign in with email/password
  - Google OAuth integration
  - Guest mode for quick access (uses localStorage)
- **☁️ Cloud Sync**: Your settings and tasks automatically sync across devices when logged in
- **⚡ Real-time Updates**: Changes sync instantly using Firebase Firestore
- **🎯 Focus-Friendly Design**: Beautiful, minimalist UI that helps you stay focused
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🚀 Tech Stack

- **Frontend**: React 19
- **Styling**: Tailwind CSS 4
- **Backend**: Firebase (Firestore + Authentication)
- **Routing**: React Router v7
- **UI Components**: Radix UI
- **Hosting**: GitHub Pages

## 🏗️ Architecture

This is a **fully serverless application** that uses:

- **Firebase Firestore** for data persistence (direct client connection)
- **Firebase Authentication** for user management
- **localStorage** as a fallback for guest users
- **Security Rules** running on Firebase servers for data protection

No traditional backend or API server needed!

## 📁 Project Structure

```
src/
├── pages/              # Route components (Home, Login)
├── components/
│   ├── layout/        # Header, Settings, Navigation
│   ├── timer/         # Timer display and controls
│   ├── tasks/         # Task management components
│   └── ui/            # Reusable UI components
├── hooks/             # Custom React hooks
├── assets/            # Images, fonts, sounds
├── firebase.js        # Firebase configuration
└── App.js            # Main application component
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account (for backend services)

### Installation

1. Clone the repository

```bash
git clone https://github.com/gabegaglio/pomotimer.git
cd pomotimer
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory with your Firebase credentials

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Start the development server

```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 🚀 Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

## 🎯 How to Use

1. **Choose a timer mode**: Click on "pomodoro", "short break", or "long break"
2. **Start working**: Hit the "start" button and focus on your task
3. **Take breaks**: When the timer ends, you'll hear a notification sound
4. **Manage tasks**: Add tasks at the bottom to keep track of what you're working on
5. **Customize**: Click the settings icon to adjust timer durations and appearance

### The Pomodoro Technique

1. Work for 25 minutes (one Pomodoro)
2. Take a 5-minute short break
3. After 4 Pomodoros, take a 15-minute long break
4. Repeat!

## 🔒 Privacy & Data

- Your data is stored securely in Firebase Firestore
- Each user can only access their own data (enforced by security rules)
- Guest mode stores data locally in your browser
- No tracking or analytics beyond Firebase's default services

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Gabe Gaglio**

- GitHub: [@gabegaglio](https://github.com/gabegaglio)
- Website: [gabegaglio.github.io/pomotimer](https://gabegaglio.github.io/pomotimer/)


