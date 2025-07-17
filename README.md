# 🚀 MERN Stack Task Manager

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This project demonstrates modern DevOps practices, CI/CD, environment configuration, and monitoring for a production-ready deployment.

---

## 🌐 Live Demo
- **Frontend:** https://mern-task-manager-frontend-u45r.onrender.com
- **Backend API:** https://mern-task-manager-backend-mz7i.onrender.com

---

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

---

## 🛠️ Features
- ✅ User registration, login, and authentication
- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Responsive, modern UI
- ✅ MongoDB Atlas integration
- ✅ RESTful API
- ✅ Health check endpoint
- ✅ Logging and error handling

---

## 🚦 CI/CD Pipeline (GitHub Actions)
- **Automated tests, linting, and builds** for both backend and frontend on every push and pull request to `main`.
- **Continuous deployment** to Render (backend) and Vercel/Render (frontend) after successful tests.
- **Health checks** run after deployment to verify service availability.
- **Workflow files:** See `.github/workflows/` for details.

**Sample CI/CD Pipeline Screenshot:**
> _Add your own screenshot here_

---

## 📊 Monitoring & Health
- **Health check endpoint:** `/health` (backend)
- **Logging:** Console and error logs for backend
- **Uptime monitoring:** (Optional: integrate with UptimeRobot, Pingdom, or Sentry)

**Sample Monitoring Screenshot:**
> _Add your own screenshot here_

---

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
JWT_SECRET=your_jwt_secret
```

**Frontend (.env):**
```
REACT_APP_API_URL=http://localhost:5000
```

---

## 🚀 Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret
5. Deploy

### Frontend (Render or Vercel)
1. Push code to GitHub
2. Create new Static Site on Render or Vercel
3. Connect your GitHub repository
4. Set environment variables:
   - `REACT_APP_API_URL`: Your deployed backend URL
5. Deploy

---

## 📚 API Endpoints
- `GET /health` - Health check
- `GET /api/items` - Get all tasks
- `POST /api/items` - Create new task
- `GET /api/items/:id` - Get single task
- `PUT /api/items/:id` - Update task
- `DELETE /api/items/:id` - Delete task
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React.js, Axios, CSS3
- **Database:** MongoDB Atlas
- **Deployment:** Render (Backend & Frontend)
- **CI/CD:** GitHub Actions

---

## 📝 Maintenance & Rollback
- Regularly update dependencies and apply security patches
- Back up MongoDB Atlas data
- Use Render's dashboard for manual rollbacks if needed
- Document deployment and rollback procedures in this README

---

## 📝 License
MIT License 