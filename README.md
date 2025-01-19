# Finance manager
Simple finance manager for personal use

## Features
- Add, edit and delete incomes and expenses
- View all incomes and expenses
- View total balance
- Pdf export (incomes, expenses, combined)

## Installation
### Backend (Django)
1. Create a virtual environment and activate it
```bash
python -m venv venv
source venv/bin/activate
```
2. Install the required packages
```bash
pip install -r requirements.txt
```
3. Migrate the database
```bash
python manage.py migrate
```
4. Run the server
```bash
python manage.py runserver
```

### Frontend (Angular)
> [!IMPORTANT]
> Install npm and Angular CLI before installing dependencies.
```bash
sudo apt install npm
sudo npm install -g @angular/cli@18
```
1. **Install Angular Dependencies:**
Before installing dependencies remove existing modules and than reinstall them (if needed). 
If you already had npm installed first run this command: `rm -rf node_modules`
```bash
npm i
```
After that use this code, to automaticly upgrade / fix vulnerabilities in npm packages
```bash
npm audit fix
```
2. **Start angular server:**
```bash
cd frontend
ng s -o
```

## Localhost
### Backend
```bash
http://localhost:8000
```
### Frontend
```bash
http://localhost:4200
```

## Start
```bash
chmod +x start.sh
./start.sh
```