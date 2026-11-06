#Deployed Link : https://client-git-main-amishkumarjhas-projects.vercel.app/

# TaskFlow – Project & Task Management System

TaskFlow is a full-stack project and task management application built using the MERN stack. It allows users to manage multiple projects, organize tasks, track progress, and monitor productivity through an interactive dashboard.

## Features

### Authentication & Security
- User registration and login.
- JWT-based authentication.
- Password hashing using bcrypt.
- Protected routes and user-specific data access.
- Secure HTTP headers using Helmet.
- API rate limiting.

### Project Management
- Create, view, update, and delete projects.
- Each project belongs to its authenticated owner.
- Automatically deletes associated tasks when a project is deleted.
- Search projects by title or description.

### Task Management
- Create, edit, and delete tasks.
- Assign tasks to projects.
- Set task priority: Low, Medium, or High.
- Track task status: To Do, In Progress, or Done.
- Set task due dates.
- Filter tasks by status and priority.
- Search tasks by title.
- Update task status directly.
- Kanban board with drag-and-drop task management.

### Dashboard
- Total project count.
- Total task count.
- Task counts by status.
- Overdue task tracking.
- Project overview and progress information.

### User Interface
- Responsive dashboard layout.
- Mobile-friendly navigation with a slide-out sidebar.
- Toast notifications for user feedback.
- Loading indicators and error handling.
- List and Kanban task views.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Routing | React Router |
| HTTP Client | Axios |
| Icons | Lucide React |
| Drag and Drop | dnd-kit |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Validation | express-validator |
| Security | Helmet, express-rate-limit |
| Development | Nodemon, ESLint |

## Project Structure

```text
taskflow/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v20.19+ or v22.12+ recommended)
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/AmishKumarJha/HSR-TaskFlow.git

cd HSR-TaskFlow
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Replace the MongoDB URI and JWT secret with your own values.

Start the backend:

```bash
npm run dev
```

The backend will run at:

`http://localhost:5000`

### 3. Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at:

`http://localhost:5173`

### 4. Production Build

To check the frontend production build:

```bash
cd client
npm run build
```

To run ESLint:

```bash
npm run lint
```

## API Documentation

Base URL:

```text
http://localhost:5000/api
```

Protected endpoints require a JWT token:

```http
Authorization: Bearer <your_jwt_token>
```

### Authentication APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get authenticated user | Protected |

### Project APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/projects` | Get user's projects | Protected |
| POST | `/projects` | Create a project | Protected |
| PUT | `/projects/:id` | Update a project | Protected |
| DELETE | `/projects/:id` | Delete a project | Protected |

### Task APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/projects/:id/tasks` | Get tasks for a project | Protected |
| POST | `/projects/:id/tasks` | Create a task | Protected |
| PUT | `/tasks/:id` | Update a task | Protected |
| PATCH | `/tasks/:id/status` | Update task status | Protected |
| DELETE | `/tasks/:id` | Delete a task | Protected |

Task listing supports status, priority, and title search filters.

### Dashboard API

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/dashboard` | Get dashboard statistics | Protected |

## Database Models

### User
- Name
- Email
- Password (hashed)
- Role
- Timestamps

### Project
- Title
- Description
- Owner reference
- Timestamps

### Task
- Title
- Description
- Status
- Priority
- Due date
- Project reference
- Owner reference
- Timestamps

## Security & Validation

- Passwords are hashed before being stored.
- JWT authentication protects private API endpoints.
- Users can only access and modify their own projects and tasks.
- Request validation is implemented using express-validator.
- Invalid resource IDs and unauthorized requests are handled.
- Helmet adds security-related HTTP headers.
- Rate limiting helps protect API endpoints from excessive requests.
- JSON request body size is restricted.

## Screenshots

Add your application screenshots to a `screenshots/` directory and include them here.

Suggested screenshots:

1. Login and Registration
2. Dashboard
3. Projects Overview
4. Project Details and Task List
5. Kanban Board
6. Mobile Responsive View

Example:

```markdown
![Dashboard](screenshots/dashboard.png)
![Projects](screenshots/projects.png)
![Kanban Board](screenshots/kanban.png)
```

## Testing & Verification

The following checks were performed during development:

- Authentication API verification.
- Protected route and unauthorized access checks.
- Project CRUD operations.
- Task CRUD operations.
- Task status and priority filtering.
- Task search functionality.
- Dashboard statistics verification.
- Kanban drag-and-drop status updates.
- Frontend ESLint check.
- Frontend production build.

Frontend verification commands:

```bash
npm run lint
npm run build
```

## AI Usage Declaration

AI tools were used as development assistance during the project.

The assistance included:
- Understanding implementation approaches and architecture.
- Debugging development issues.
- Reviewing code and resolving lint errors.
- Improving documentation and setup instructions.

The application was implemented, integrated, and tested by the developer. AI assistance was used as a supporting tool, and the final implementation was reviewed and verified.

## Author

**Amish Kumar Jha**

- GitHub: [AmishKumarJha](https://github.com/AmishKumarJha)
- Project Repository: [HSR-TaskFlow](https://github.com/AmishKumarJha/HSR-TaskFlow)

---

Built with React, Node.js, Express.js, and MongoDB.
