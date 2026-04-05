# SB Works — Freelancing Platform

A full-stack MERN-style freelancing marketplace built with React + localStorage.

## Features
- 3 role-based dashboards: Freelancer, Client, Admin
- Project posting, bidding, acceptance flow
- Real-time chat (4-second polling)
- Work submission & review system
- Funds auto-credit on project completion
- Admin oversight panel

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm start

# App opens at http://localhost:3000
```

## Default Admin Login
- Email: `admin@sbworks.com`
- Password: `Admin@123`

## Test Flow
1. Register as **Freelancer** → explore dashboard
2. Register as **Client** → post a project
3. Login as Freelancer → apply to the project
4. Login as Client → accept the application
5. Both can now **chat** in real-time
6. Freelancer submits work → Client accepts → funds credited
7. Login as Admin → view all data

## Tech Stack
- React 18
- React Router v6
- localStorage (simulates database)
- Plain CSS (no UI library)
- No backend required
