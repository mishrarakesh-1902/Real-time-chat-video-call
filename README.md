# 🚀 Real-Time Chat Application

A full-stack real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) featuring instant messaging, video calls, and a modern responsive UI.

![ChatFlow](https://img.shields.io/badge/ChatFlow-v1.0.0-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-000000)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4)

![Chat App Screenshot](frontend/public/screenshot-for-readme.png)

## ✨ Features

### Core Features
- 🔐 **User Authentication** - Secure signup/login with JWT tokens and bcrypt password hashing
- 💬 **Real-Time Messaging** - Instant message delivery using Socket.io
- 👥 **Contact Management** - Add and manage contacts
- 🔍 **Search Functionality** - Search through conversations and contacts
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices

### Communication Features
- 📹 **Video Calls** - High-quality video calls using WebRTC
- 🖼️ **Media Sharing** - Share images in conversations
- 📄 **Document Sharing** - Share documents/files with contacts
- 😀 **Emoji Support** - Built-in emoji picker with categorized emojis
- 🔔 **Sound Notifications** - Customizable notification sounds

### UI/UX Features
- 🎨 **Modern Design** - Beautiful, modern interface with Tailwind CSS
- 🌙 **Smooth Animations** - Fluid transitions and interactions
- 📱 **Mobile-First** - Responsive design for all screen sizes
- ⚡ **Fast Loading** - Optimized for performance

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Zustand** - Lightweight state management
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.io** - WebSocket implementation
- **JWT** - JSON Web Tokens
- **Bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Arcjet** - Security & rate limiting
- **Resend** - Email service

## 📋 Prerequisites

Before running the application, make sure you have:

- Node.js 20.x or higher
- MongoDB account (MongoDB Atlas)
- Cloudinary account (for image storage)
- Resend account (for emails)
- Arcjet account (for security)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd real-time-chat
```

### 2. Environment Setup

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL (for CORS and cookies)
CLIENT_URL=http://localhost:5173

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email@example.com
EMAIL_FROM_NAME=Your App Name

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Arcjet (Security)
ARCJET_KEY=your_arcjet_key
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run the Application

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 📁 Project Structure

```
real-time-chat/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── emails/         # Email templates
│   │   ├── lib/           # Utilities & configs
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── public/            # Static assets
│   ├── package.json
│   └── .env.example
│
├── package.json
├── README.md
└── render.yaml            # Deployment config
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/check` | Check auth status |
| PUT | `/api/auth/update-profile` | Update user profile |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:userId` | Get messages with user |
| POST | `/api/messages/send` | Send message |
| GET | `/api/messages/users` | Get chat users |

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- HTTP-only cookies
- CORS protection
- Rate limiting (Arcjet)
- Input validation
- XSS protection

## 🌐 Deployment

### Render (Recommended)
1. Connect your GitHub repository to Render
2. Create a Web Service for backend
3. Set environment variables
4. Deploy!

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_secret
CLIENT_URL=https://your-frontend.onrender.com
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Socket.io](https://socket.io/) for real-time communication
- [MongoDB](https://www.mongodb.com/) for database
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Cloudinary](https://cloudinary.com/) for image management
- [Resend](https://resend.com/) for email delivery

## 📧 Support

For support, email rakeshkumar@gmail.com or create an issue in the repository.

---

<p align="center">Made with ❤️ by Rakesh Kumar</p>
