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

<img width="1910" height="1023" alt="Image" src="https://github.com/user-attachments/assets/875b7514-4564-4b0f-be27-4ac5d8d12bc8" />

<img width="1911" height="1032" alt="Image" src="https://github.com/user-attachments/assets/ce3a9063-b26e-4c1d-ad6f-9303a147105d" />

<img width="1909" height="1025" alt="Image" src="https://github.com/user-attachments/assets/20ce072d-cc9b-4a02-a226-acb03bfc8764" />

---

Made with ❤️ and Python.
