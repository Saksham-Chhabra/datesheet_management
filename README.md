# Examination Datesheet Management System

A comprehensive full-stack application designed to automate the scheduling, management, and distribution of academic examination datesheets. This project is developed as part of the **Third Year DBMS Laboratory** at **NIT Hamirpur**, with a primary focus on relational database integrity and advanced SQL operations.

---

## 🚀 Project Overview
The **Examination Datesheet Management System** addresses the complexity of university exam scheduling. It ensures that exams are scheduled without student or room conflicts while providing an easy-to-use interface for both administrators and students. 

While the system is full-stack, the "brain" of the application resides in the **PostgreSQL** database, utilizing triggers, procedures, and normalized schemas to maintain data consistency.

---

## 🛠 Tech Stack
* **Database:** PostgreSQL (Relational Database)
* **Backend:** Python/Flask or Node.js
* **Frontend:** HTML, CSS, JavaScript
* **Database GUI:** pgAdmin 4

---

## 📋 System Development Lifecycle (SDLC)

This project follows a structured database design approach:

### 1. Information Gathering
Requirement analysis involves identifying the core entities:
* **Students:** Roll numbers, branches, and semesters.
* **Courses/Subjects:** Codes, credits, and departments.
* **Rooms:** Examination halls with specific seating capacities.
* **Slots:** Specific dates and time periods (e.g., 09:00 AM - 12:00 PM).

### 2. ER Diagram (Conceptual Design)
We designed an **Entity-Relationship (ER) Diagram** to visualize how entities interact, focusing on:
* Many-to-Many relationship between Students and Subjects.
* Mapping Subjects to specific Exam Slots and Rooms.

### 3. Mapping ER to Relational Tables
The conceptual ER model was transformed into a logical relational schema, defining:
* **Primary Keys (PK):** For unique identification.
* **Foreign Keys (FK):** To maintain referential integrity between tables like `Datesheet` and `Rooms`.

### 4. Normalization
To prevent data redundancy and anomalies, the database was refined to **Third Normal Form (3NF)**:
* **1NF:** Ensuring atomic values.
* **2NF:** Removing partial functional dependencies.
* **3NF:** Removing transitive dependencies.

### 5. Database Programmability (Procedures & Queries)
* **Stored Procedures:** Implemented in `PL/pgSQL` to automate conflict checking (e.g., checking if a room is already occupied during a specific slot).
* **Complex Queries:** Optimized SQL joins to generate customized datesheets for individual students based on their enrolled subjects.

### 6. User Interface & Integration
A web-based interface allows:
* **Admins:** To input data, perform CRUD operations, and trigger datesheet generation.
* **Students:** To view and download their specific exam schedule by entering their Roll Number.

---

## 🗂 Database Schema Preview

The core logic is centered around the following tables:
* `Students`
* `Subjects`
* `Rooms`
* `Time_Slots`
* `Datesheet` (The junction table linking all entities)

---

## ⚙️ Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Saksham-Chhabra/examflow.git](https://github.com/Saksham-Chhabra/examflow.git)
    ```
2.  **Database Configuration:**
    * Install **PostgreSQL**.
    * Create a database named `exam_management`.
    * Run the scripts provided in the `/sql` directory to set up tables and procedures.
3.  **Environment Setup:**
    * Configure your database credentials in the `config` file of the backend.
4.  **Run the App:**
    ```bash
    e.g., npm start or python app.py
    ```

---

## 👨‍💻 Authors (Team Members)
**NIT Hamirpur | B.Tech CSE - 3rd Year**

* **Saina Saini** (23BCS097)
* **Saksham Chhabra** (23BCS098)
* **Samar Kumar** (23BCS099)
* **Satvik Srivastava** (23BCS100)

---
