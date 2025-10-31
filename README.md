# Pathlock Coding Assignments (October 2025)

This repository contains two mandatory home assignments for the **Pathlock Coding Assessment (October 2025)**.  
Both tasks demonstrate full-stack development skills using **C# (.NET 8)** for the backend and **React with TypeScript** for the frontend.

---

## 🧩 Home Assignment 1 – Basic Task Manager

### 🎯 Objective
A simple full-stack app demonstrating CRUD operations and frontend-backend communication.

### 🛠️ Features
- Display a list of tasks  
- Add new tasks with descriptions  
- Mark tasks as completed or uncompleted  
- Delete tasks  

### ⚙️ Tech Stack
- **Backend:** .NET 8 Core (C#), In-memory data storage  
- **Frontend:** React, TypeScript, Axios or Fetch, React Hooks  
- **Optional Enhancements:**
  - Task filtering (All / Completed / Active)
  - Basic design using TailwindCSS or Bootstrap
  - Save tasks in `localStorage`
---
# 🚀 Mini Project Manager – Pathlock Assignment (October 2025)

This project is part of the **Pathlock Home Coding Assignment (October 2025)**.  
It demonstrates a full-stack implementation using **C# (.NET 8)** for the backend and **React with TypeScript** for the frontend.

---

## 🎯 Objective

Build a **Mini Project Management System** that includes user authentication, project and task management, and modular architecture following full-stack best practices.

---

## 💼 Business Context

The application allows users to:
- Register and log in securely.  
- Create and manage multiple projects.  
- Add, update, and delete tasks within projects.  
- Mark tasks as complete/incomplete.  
- Access only their own data using JWT-based authentication.

---

## 🧩 Core Features

### 🔐 Authentication
- User registration and login using **JWT (JSON Web Tokens)**.  
- Authenticated users can access only their data.  

### 🗂 Projects
- Each user can create multiple projects.  
- Project properties:
  - **Title** (required, 3–100 characters)  
  - **Description** (optional, up to 500 characters)  
  - **Creation Date** (auto-generated)

### ✅ Tasks
- Each project can have multiple tasks.  
- Task properties:
  - **Title** (required)  
  - **Due Date** (optional)  
  - **Completion Status**  
  - **Project Reference**

---

## ⚙️ Backend (C# .NET 8)

### 🏗️ Requirements
- Build a **RESTful API** using **.NET 8 Core** and **Entity Framework Core**.  
- Implement **JWT authentication**.  
- Use **in-memory** or **SQLite** database.  
- Apply **DataAnnotations** for input validation.  
- Follow **Separation of Concerns** (Models, DTOs, Services, Controllers).

Database: In-memory or SQLite

🌟 Optional Enhancements
🔧 Smart Scheduler API
A bonus endpoint that helps users auto-schedule their project tasks.

