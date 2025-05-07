# Stage 1: Build stage for dependencies
FROM python:3.12-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    jpeg-dev \
    zlib-dev \
    freetype-dev \
    lcms2-dev \
    openjpeg-dev \
    tiff-dev \
    tk-dev \
    tcl-dev \
    harfbuzz-dev \
    fribidi-dev \
    cairo-dev \
    pango-dev \
    g++ \
    make \
    sqlite-dev

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Final image
FROM python:3.12-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache \
    libffi \
    jpeg \
    zlib \
    freetype \
    lcms2 \
    openjpeg \
    tiff \
    tk \
    tcl \
    harfbuzz \
    fribidi \
    cairo \
    pango \
    sqlite-libs

# Copy installed dependencies from the builder
COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=builder /usr/lib/python3.12 /usr/lib/python3.12

# Copy project files
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

COPY backend.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/backend.sh

CMD ["/usr/local/bin/backend.sh"]


# # Stage 1: Build stage for dependencies
# FROM python:3.12.10-slim AS builder

# # Set the working directory
# WORKDIR /app

# # Update and upgrade OS packages
# RUN apt-get update && \
#     apt-get install -y && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# # Install dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Stage 2: Final image
# FROM python:3.12.10-slim

# # Set the working directory
# WORKDIR /app

# # Update and upgrade OS packages
# RUN apt-get update && \
#     apt-get install -y && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# # Copy installed dependencies from the builder stage
# COPY --from=builder /usr/local/lib/python3.12 /usr/local/lib/python3.12

# # Copy project files into the container
# COPY . .

# # Set environment variables
# ENV PYTHONUNBUFFERED=1

# # Expose port 8000
# EXPOSE 8000

# # Create a startup script to apply migrations and start the server
# COPY backend.sh /usr/local/bin/
# RUN chmod +x /usr/local/bin/backend.sh

# # Start the app using the startup script
# CMD ["/usr/local/bin/backend.sh"]