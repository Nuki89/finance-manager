# Stage 1: Build stage for dependencies
FROM python:3.12.5-slim AS builder

# Set the working directory
WORKDIR /app

# Update and upgrade OS packages
RUN apt-get update && \
    apt-get install --only-upgrade libexpat1 liblzma5 libsqlite3-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final image
FROM python:3.12.5-slim

# Set the working directory
WORKDIR /app

# Update and upgrade OS packages
RUN apt-get update && \
    apt-get install --only-upgrade libexpat1 liblzma5 libsqlite3-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy installed dependencies from the builder stage
COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12

# Copy project files into the container
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Expose port 8000
EXPOSE 8000

# Create a startup script to apply migrations and start the server
COPY backend.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/backend.sh

# Start the app using the startup script
CMD ["/usr/local/bin/backend.sh"]