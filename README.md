# 🚀 MERN Stack Task Manager

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🏗️ Project Structure

```
├── backend/          # Express.js API server
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── index.js      # Server entry point
│   └── package.json  # Backend dependencies
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── App.js       # Main app component
│   └── package.json     # Frontend dependencies
└── README.md
```

## 🚀 Live Demo

- **Frontend:** https://mern-task-manager-frontend-u45r.onrender.com
- **Backend API:** https://mern-task-manager-backend-mz7i.onrender.com

## 🛠️ Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Modern, responsive UI
- ✅ Real-time updates
- ✅ MongoDB Atlas integration
- ✅ RESTful API

## 🏃‍♂️ Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account

### Backend Setup
```bash
cd backend
npm install
# Create .env file with your MongoDB URI
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority&appName=<appname>
PORT=5000
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000
```

## 🚀 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
5. Deploy

### Frontend (Render)
1. Push code to GitHub
2. Create new Static Site on Render
3. Connect your GitHub repository
4. Set environment variables:
   - `REACT_APP_API_URL`: Your deployed backend URL
5. Deploy

## 📚 API Endpoints

- `GET /health` - Health check
- `GET /api/items` - Get all tasks
- `POST /api/items` - Create new task
- `GET /api/items/:id` - Get single task
- `PUT /api/items/:id` - Update task
- `DELETE /api/items/:id` - Delete task

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, Axios, CSS3
- **Database:** MongoDB Atlas
- **Deployment:** Render (Backend & Frontend)

## 📝 License

MIT License 