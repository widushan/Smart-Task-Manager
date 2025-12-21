# 🚀 Smart Task Manager

> **A Microservices-based Web App built with Python Flask & Docker.**

Welcome to the **Smart Task Manager**! A clean, modern, and efficient way to manage your daily tasks, engineered to demonstrate the power of microservices.

---

## 🌟 Features

*   **🔐 User Authentication**: Secure Register & Login (JWT-based).
*   **📝 Task Management**: Create, Read, Update, and Delete tasks with ease.
*   **📊 Kanban Board**: Visualize tasks in To-Do, In-Progress, and Done columns.
*   **🎨 Charm UI**: A pastel-themed, responsive user interface.
*   **🐳 Dockerized**: Fully containerized for easy deployment.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3 (Charm Theme), JavaScript (Vanilla) |
| **Backend** | Python, Flask |
| **Database** | MySQL 8.0 (Multi-database architecture) |
| **Gateway** | Nginx |
| **DevOps** | Docker & Docker Compose |

---

## ⚡ Quick Start

Get up and running in minutes!

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop)

### Build & Run
1.  **Clone the repo**
    ```bash
    git clone https://github.com/widushan/smart-task-manager.git
    cd smart-task-manager
    ```

2.  **Launch the App**
    Run the following command in your terminal:
    ```bash
    docker-compose up --build -d
    ```

3.  **Open in Browser**
    Open your browser to [http://localhost](http://localhost) or run:
    ```bash
    start http://localhost
    ```

---

## 🏗️ Architecture

The application is split into independent services:
1.  **Auth Service**: Manages users and authentication.
2.  **Task Service**: Manages task logic and storage.
3.  **Frontend**: Static files served via Nginx (Acting as Reverse Proxy).
4.  **Database**: Single MySQL instance hosting `auth_db` and `task_db`.

---

### 📷 Visuals


---

Made with ❤️ and Python.
