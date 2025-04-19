# Forecast Budget - Backend

## Description

This is the backend for the Forecast Budget app. It is a FastAPI application that provides a RESTful API for the app.

## Setup

1 Clone the repository

```bash
git clone https://github.com/yourusername/forecast-budget.git
cd backend
```

2 Create a virtual environment

```bash
python -m venv venv
```

3 Activate the virtual environment

```bash
source venv/bin/activate
```

4 Install the dependencies

```bash
pip install -r requirements.txt
```

5. Run the docker compose file

```bash
docker-compose up -d
```

6. Run the application

```bash
uvicorn app.main:app --reload
```

## API Documentation

The API documentation is available at :

- http://localhost:8000/docs
- http://localhost:8000/redoc

## Database

The database is a PostgreSQL database. The connection details are in the `.env` file.
