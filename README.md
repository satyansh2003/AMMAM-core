# AMMAM Core: Algorithmic Memory Mapping for Agentic Malware

**ISB Hackathon on Cybersecurity & AI Safety 2025–26**

AMMAM is a next-generation cybersecurity prototype designed to detect autonomous, AI-driven malware (Agentic Malware) residing entirely in volatile computer memory. Unlike traditional antivirus software that scans for static file signatures, AMMAM uses **Spatial Entropy Mapping** to geometrically isolate advanced AI processing footprints and extract their payloads dynamically.

---

## 🚀 Project Architecture

This application is split into two halves that must be run simultaneously to work:
1. **Frontend (`/frontend`)**: A React + Vite dashboard built with a premium "Dark Tech" aesthetic.
2. **Backend (`/backend`)**: A Java Spring Boot server that executes the mathematical entropy mappings and handles the simulated spatial data structures.

---

## 🛠️ Prerequisites

Before you can run this project on your device, you MUST have the following installed on your computer:
1. **Node.js** (v18+ recommended): [Download Here](https://nodejs.org/) - Required to run the React frontend.
2. **Java Development Kit (JDK 21)**: [Download Here](https://adoptium.net/) - Required to compile and run the Spring Boot backend.
3. **Maven** (Optional but recommended): [Download Here](https://maven.apache.org/download.cgi) - Included implicitly via the `mvnw` wrapper, but having it installed globally helps.

---

## If you want to have a look at the website you can directly visit the following link as the website has already been deployed and is live:-
https://ammam-ui.onrender.com

## ⚙️ How to Run Locally

You will need to open **two separate terminal windows** to launch both halves of the project at the same time.

### Step 1: Start the Java Backend
Open your first terminal window and navigate into the `backend` folder:
```bash
cd backend
```
Start the Java Spring Boot server:
```bash
# On Windows
mvn spring-boot:run

# Or if you are using the wrapper:
./mvnw spring-boot:run
```
*Wait for the terminal to configure the beans and display: `Started AmmamApplication in [X] seconds`. The backend is now securely running on `http://localhost:8080`.*

### Step 2: Start the React Frontend
Open your **second** terminal window and navigate into the `frontend` folder:
```bash
cd frontend
```
Install the necessary Node.js dependencies (you only need to do this the very first time):
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
*The terminal will provide a local address (usually `http://localhost:5173`).*

---

## 🖥️ Using the Application

1. Open your web browser and navigate to `http://localhost:5173`.
2. Ensure both terminal windows remain open and running in the background.
3. On the Dashboard, click **Scan Latest Memory Dump** to trigger the API. The React frontend will contact the Java backend, calculate the spatial entropy algorithms, and return the geometric footprint mappings back to your screen.

---


