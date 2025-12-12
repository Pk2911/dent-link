# 🦷 DentLink - Appointment Management System

![Status](https://img.shields.io/badge/Status-Live-success)
![Tech](https://img.shields.io/badge/Stack-FullStack-blue)

**DentLink** is a lightweight, full-stack web application designed to help dental clinics streamline patient appointment scheduling. It provides a real-time dashboard for receptionists to book, view, edit, and cancel appointments efficiently.

## 🚀 Live Demo
**[Click here to view the Live Application](https://dent-link.onrender.com)**
*(Note: The app is hosted on Render's free tier. Please allow 30-60 seconds for the server to wake up on the first load.)*

---

## ✨ Key Features
* **Create Appointments:** Simple form to capture patient name, email, phone number, and appointment date.
* **Real-Time Dashboard:** View all upcoming appointments in a clean, organized list.
* **Update Records:** "Edit" button functionality allows for modifying patient details (PUT requests).
* **Cancel/Delete:** Ability to remove completed or cancelled appointments (DELETE requests).
* **Secure Backend:** Protection against SQL injection and secured database initialization routes.
* **Responsive UI:** Optimized for both desktop and tablet views.

---

## 🛠️ Tech Stack

### Frontend
* **HTML5 & CSS3:** For structure and responsive styling.
* **JavaScript (Vanilla):** Handles DOM manipulation and async API calls (Fetch API).

### Backend
* **Node.js:** Runtime environment.
* **Express.js:** Web framework for handling API routes.
* **PostgreSQL:** Relational database for persistent data storage.
* **pg (node-postgres):** Client for connecting Node.js to PostgreSQL.
* **CORS:** Middleware for handling Cross-Origin Resource Sharing.

### Deployment
* **Render:** Hosting for both the Web Service and the PostgreSQL Database.

---

## 📂 Project Structure

```text
dent-link/
├── backend/
│   ├── public/              # Frontend Assets (Served statically)
│   │   ├── index.html       # Main UI
│   │   ├── style.css        # Styling
│   │   └── script.js        # Frontend logic & API calls
│   ├── server.js            # Main Application Entry Point
│   ├── package.json         # Dependencies & Scripts
│   └── .env                 # Environment variables (Not shared)
├── .gitignore
└── README.md
````

-----

## ⚙️ Local Installation & Setup

If you want to run this project locally on your machine:

### 1\. Clone the Repository

```bash
git clone [https://github.com/Pk2911/dent-link.git](https://github.com/Pk2911/dent-link.git)
cd dent-link
```

### 2\. Install Dependencies

Navigate to the backend folder and install the required Node modules.

```bash
cd backend
npm install
```

### 3\. Configure Environment Variables

Create a `.env` file inside the `backend` folder and add your database configuration:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/your_database_name
NODE_ENV=development
```

### 4\. Run the Server

```bash
npm start
# OR
node server.js
```

The application will be available at: `http://localhost:5000`

-----

## 📡 API Endpoints

The backend exposes the following RESTful API endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/patients` | Retrieve list of all appointments. |
| `POST` | `/patients` | Create a new appointment. |
| `PUT` | `/patients/:id` | Update an existing appointment by ID. |
| `DELETE` | `/patients/:id` | Remove an appointment by ID. |

-----

## 🔒 Security Measures

1.  **Parameterized Queries:** All SQL queries use parameterized inputs to prevent SQL Injection attacks.
2.  **Route Locking:** The `/initdb` route (used to reset the table) is commented out/secured in production to prevent accidental data loss.
3.  **Environment Variables:** Sensitive credentials are stored in `.env` files and never pushed to GitHub.

-----

## 🔮 Future Improvements

  * [ ] **Authentication:** Admin login for staff members.
  * [ ] **Email Notifications:** Automated confirmation emails using Nodemailer.
  * [ ] **Date Filtering:** Sort appointments by Today, Tomorrow, or specific ranges.

-----

### Author

**Pankaj Krishna**
*Full Stack Developer*

```
```
