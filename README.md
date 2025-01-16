# Finance manager
Simple finance manager for personal use

## Features
- Add, edit and delete incomes and expenses
- View all incomes and expenses
- View total balance
- Pdf export (incomes, expenses, combined)

## Installation
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
5. Link
```bash
http://localhost:8000
```