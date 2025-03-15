# Stage 1: Build stage
FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli@18
RUN npm install

EXPOSE 4200
EXPOSE 4288

COPY ./frontend.sh /usr/src/app/frontend.sh
RUN chmod +x /usr/src/app/frontend.sh

# CMD ["/usr/src/app/frontend.sh"]

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]


# # Stage 1: Build stage
# FROM node:20 AS builder

# WORKDIR /app

# # Install dependencies and Angular CLI
# COPY package*.json ./
# RUN npm install -g @angular/cli@18
# RUN npm install

# # Copy the project files
# COPY . .

# # Build for production ONLY if NODE_ENV=production
# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "production" ]; then npm run build --configuration production --project finance-manager; fi

# # Stage 2: Serve with NGINX for production only
# FROM nginx:1.25

# # Remove default NGINX config
# RUN rm /etc/nginx/conf.d/default.conf

# # Only copy the dist files if they exist (to prevent COPY failure)
# ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "production" ]; then \
#     cp -r /app/dist/finance-manager /usr/share/nginx/html || echo "Skipping COPY since dist does not exist"; \
# fi

# # Copy NGINX config for production
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# # Copy frontend.sh for switching between dev/prod
# COPY ./frontend.sh /usr/local/bin/frontend.sh
# RUN chmod +x /usr/local/bin/frontend.sh

# # Expose port 80 for NGINX
# EXPOSE 80

# # Start the app using frontend.sh
# CMD ["/usr/local/bin/frontend.sh"]
