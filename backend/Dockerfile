FROM python:3.10-slim

# Install dependencies for building psycopg2
RUN apt-get update && apt-get install -y gcc libpq-dev python3-dev

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of the application code
COPY . .

# Start the app (for example, with Uvicorn for FastAPI)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
