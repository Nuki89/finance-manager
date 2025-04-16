# Finance Manager

![Django](https://img.shields.io/badge/Backend-Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![Angular](https://img.shields.io/badge/Frontend-Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Docker](https://img.shields.io/badge/DevOps-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Simple finance manager for personal use.

## Table of Contents
- [Features](#features)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
  - [Option 1: Using Docker (Recommended)](#option-1-using-docker-recommended)
  - [Option 2: Manual Setup](#option-2-manual-setup)
    - [Backend (Django)](#backend-django)
    - [Frontend (Angular)](#frontend-angular)
- [Accessing the App](#accessing-the-app)
- [Start Script](#start)
- [License](#license)
- [How to Use](#how-to-use)

## Features
- Add, edit and delete incomes and expenses
- Add, edit and delete categories
- View all incomes and expenses
- Add (custom) savings
- View total balance
- Pdf export (incomes, expenses, combined)

## Environment Setup
### Backend: Django
Before starting the application, create a `.env` file inside the `/backend` directory with the following variables:

```env
# Django settings
DJANGO_SECRET_KEY=your_secret_key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=172.16.10.203,localhost,127.0.0.1,0.0.0.0
CORS_ALLOWED_ORIGINS=http://172.16.10.203:4200
CSRF_TRUSTED_ORIGINS=http://172.16.10.203:4200
```

## Getting Started
### Option 1: Using Docker (recommended)
> **Note:** Ensure Docker and Docker Compose are installed and running on your machine.

1. Navigate to the `finance-manager` directory:
```bash
cd finance-manager
```
2. Start all services:
```bash
docker compose up
```
3. Access the application:
Frontend: http://localhost:4200
Backend: http://localhost:8000

### Option 2: Manual Setup
### Backend (Django)
1. Create a virtual environment and activate it
```bash
python -m venv venv
```
2. Activate the virtual environment 
- Windows
```bash
venv\Scripts\activate
```
- MacOS/Linux
```bash
source venv/bin/activate
```
3. Install the required packages
```bash
pip install -r requirements.txt
```
4. Migrate the database
```bash
python manage.py migrate
```
5. Run the server
```bash
python manage.py runserver
```

### Frontend (Angular)
> ⚠️ **Important:** Make sure you have Node.js, npm, and Angular CLI installed before continuing.
1. Navigate to the `frontend` directory:
```bash
cd frontend
```
2. Install npm and Angular CLI
```bash
sudo apt install npm
sudo npm install -g @angular/cli@18
```
3. Install dependencies
Before installing dependencies, remove existing modules and then reinstall them (if needed).
If you already had npm installed first run this command: `rm -rf node_modules`.
```bash
npm i
```
4. Check for vulnerabilities
After that, use this command to automatically upgrade or fix vulnerabilities in npm packages.
```bash
npm audit fix
```
5. Start the server
```bash
ng s -o
```
6. Testing
```bash
ng test
```

### Accessing the App
Once the app is running, open your browser:
- **Frontend**: [http://localhost:4200](http://localhost:4200)
- **Backend**: [http://localhost:8000](http://localhost:8000)

## Start script
Make the script executable and run it:
```bash
chmod +x start.sh
./start.sh
```

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## How to Use
1. Open the application in your browser.
2. Create an account.
3. Start adding your incomes, expenses, and savings.
4. Take control of your finances with "Coiny" Finance Manager.