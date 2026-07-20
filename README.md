# 🚗 RideMate 
**A Full-Stack, Real-Time Ride-Sharing Web Application**

RideMate is a comprehensive ride-sharing platform designed to help university students and commuters conveniently find and offer rides, reducing travel costs and promoting eco-friendly transit. It features a custom-built real-time WebSocket engine, secure third-party OAuth integrations, cloud-based media storage, and a fully containerized deployment pipeline.

---

## 🌐 Live Demo

- **Live Application:** [https://ridemate-57i0.onrender.com](https://ridemate-57i0.onrender.com)
- **GitHub Repository:** [https://github.com/DarshanVarpe/RideMate](https://github.com/DarshanVarpe/RideMate)

---

## 📸 Project Preview

| Home Page | About |
| --- | --- |
| ![Home](<img width="1470" height="956" alt="Screenshot 2026-07-20 at 5 15 22 PM" src="https://github.com/user-attachments/assets/77a725ef-f1b5-49d1-be4c-4c3e4ece4db3" />
) | ![About](<img width="1470" height="956" alt="Screenshot 2026-07-20 at 5 27 06 PM" src="https://github.com/user-attachments/assets/7c266fdf-1212-4b8e-9cea-493f641bd55c" />
) |

| Create Ride | Login Page |
| --- | --- |
| ![Create Ride](<img width="1470" height="956" alt="Screenshot 2026-07-20 at 5 18 38 PM" src="https://github.com/user-attachments/assets/c67d48d5-5767-4bb5-b0ae-16220625b851" />

) | ![Login](<img width="1470" height="956" alt="Screenshot 2026-07-20 at 5 19 08 PM" src="https://github.com/user-attachments/assets/98ed3424-a338-405f-9b32-71333d1ce1f7" />
) |

---

## 🚀 Key Features

- **🔐 Dual Authentication**: Secure login and signup system using traditional Email/Password (hashed via bcrypt + JWT) or seamless Single Sign-On (SSO) via **Google OAuth 2.0**.
- **🚘 Ride Management**: Drivers can create, offer, and manage rides. Passengers can search, filter, and join available rides in their area.
- **⚡ Real-Time Engine**: Built with **Socket.io** to instantly broadcast live seat availability, new ride creations, and passenger cancellations to active users without requiring HTTP page reloads.
- **☁️ Cloud Media Storage**: Integrated with **Cloudinary** (via Multer) to handle multipart-form image uploads for vehicles, keeping the database lightweight.
- **✉️ Secure Password Recovery**: Custom-built password reset flow using short-lived JWT tokens and the official **Google Gmail API** (bypassing strict SMTP cloud firewalls for 100% deliverability).
- **🛡️ Protected Routing**: Custom Express middleware to verify JWT signatures, ensuring private dashboards and API endpoints are strictly protected from unauthorized access.

---

## 🛠 Tech Stack & Architecture

RideMate is built on a modified **MERN** stack, adhering strictly to the **MVC (Model-View-Controller)** design pattern to ensure scalability and separation of concerns.

### Backend (Server & Logic)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) ![Zod](https://img.shields.io/badge/Zod-7C3AED.svg?style=for-the-badge&logo=zod&logoColor=white) 

### Database (Data Layer)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) 

### Frontend (Client UI)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![EJS](https://img.shields.io/badge/ejs-%23B4CA65.svg?style=for-the-badge&logo=ejs&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) 

### Cloud Services & DevOps
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white) ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

---

## 🏛️ Architecture & Structure

### High-Level Architecture
```text
Client Browser (UI + WebSockets)
       │
       ▼
Express.js Server (REST API + Socket.io)
       │
   ┌───┴───┐
   ▼       ▼
MongoDB  Google API
(Data)   (Emails)
```

### Folder Structure
```text
RideMate/
├── config/        # Passport.js and OAuth configuration
├── controllers/   # Route handlers and business logic
├── middlewares/   # JWT verification and route protection
├── models/        # Mongoose database schemas
├── routes/        # Express API routing definitions
├── services/      # External integrations (Gmail API)
├── public/        # Static assets (CSS, images)
├── views/         # EJS UI templates
└── server.js      # App entry point & WebSocket init
```

---

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DarshanVarpe/RideMate.git
   cd RideMate
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following keys (see `.env.example` for details):
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_cluster_uri
   CLIENT_URL=http://localhost:3000
   JWT_SECRET=your_secure_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GOOGLE_REFRESH_TOKEN=your_google_gmail_api_refresh_token
   GMAIL_USER=your_personal_gmail_address
   ```
4. **Run the Server:**
   ```bash
   npm start
   ```
   The application will be running live at `http://localhost:3000`.

---

## 🔌 Core API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/user/register` | Register a new user |
| **POST** | `/user/login` | Authenticate user & return JWT |
| **GET** | `/auth/google` | Trigger Google SSO login |
| **POST** | `/ride/create` | Publish a new ride offer |
| **POST** | `/ride/join` | Join an existing ride |
| **POST** | `/user/forget-password` | Send password reset via Gmail API |

---

## 🔒 Security Features

- **JWT Authentication:** Stateless, signed tokens stored securely in HTTP-only cookies.
- **Password Hashing:** Passwords are cryptographically hashed using `bcrypt` before database insertion.
- **Route Protection:** Custom middleware validates JWTs on all sensitive routes (Dashboard, Create Ride).
- **Zod Validation:** Strict runtime schema validation on all user inputs to prevent NoSQL injection.
- **Role-Based Rules:** Business logic prevents drivers from joining their own rides and prevents overbooking.

---

## 🧠 Engineering Challenges Solved

### 1. Bypassing Cloud SMTP Firewalls
When deploying to Render's free tier, standard outbound SMTP connections (ports 465/587) were entirely firewalled, completely breaking the Nodemailer password recovery system. To solve this without upgrading to a paid tier, the email service was completely re-architected. Nodemailer was replaced with the **official Google `googleapis` SDK**, enabling the backend to construct raw MIME emails and send them over standard HTTP (port 443) using OAuth 2.0 Refresh Tokens. This completely bypassed both the cloud firewall and modern 2024 DMARC spam rules, resulting in 100% email deliverability.

### 2. Zero-Trust Database Networking
Upon deployment, the application threw persistent 500 Internal Server errors during Google Login. By analyzing the connection logs, it was identified that MongoDB Atlas enforces a strict zero-trust network policy, blocking Render's dynamic IP addresses. This was resolved by meticulously configuring the MongoDB Network Access List to explicitly allow the appropriate traffic ranges.

---

## 🎓 Key Learnings

- **WebSockets vs HTTP:** Learned to transition from stateless request-response models to stateful, bi-directional event emission using Socket.io.
- **Cloud Deployments:** Gained hands-on experience debugging Docker containers and PaaS environments on Render.
- **Database Security:** Discovered the critical importance of Zero-Trust network configurations (IP whitelisting) in MongoDB Atlas.
- **OAuth Integration:** Successfully implemented third-party Single Sign-On (SSO) using Passport.js.

---

## 👨‍💻 Author

**Darshan Varpe**
- **GitHub:** [DarshanVarpe](https://github.com/DarshanVarpe)
- **LinkedIn:** [DarshanVarpe](https://www.linkedin.com/in/darshanvarpe/)

## 📄 License
This project is licensed under the MIT License.
