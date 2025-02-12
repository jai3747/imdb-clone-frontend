# # # # FROM node:18-alpine

# # # # WORKDIR /app

# # # # COPY package*.json ./

# # # # RUN npm install

# # # # COPY . .

# # # # # Build the React app
# # # # RUN npm run build

# # # # # Install serve to run the built app
# # # # RUN npm install -g serve

# # # # EXPOSE 3000

# # # # # # Serve the built app
# # # # CMD ["serve", "-s", "build", "-l", "3000"]
# # # # Build stage
# # # FROM node:18-alpine AS builder
# # # WORKDIR /app
# # # COPY package*.json ./
# # # RUN npm install --legacy-peer-deps
# # # COPY . .
# # # RUN npm run build

# # # # Production stage
# # # FROM nginx:alpine
# # # COPY --from=builder /app/build /usr/share/nginx/html
# # # COPY nginx.conf /etc/nginx/conf.d/default.conf

# # # RUN npm install -g serve

# # # EXPOSE 3000

# # # # # Serve the built app
# # # CMD ["serve", "-s", "build", "-l", nginx", "-g", "daemon off" ,3000"]
# # # Build stage
# # FROM node:18-alpine AS builder
# # WORKDIR /app

# # # Copy package files
# # COPY package*.json ./

# # # First remove package-lock.json to avoid conflicts
# # RUN rm -f package-lock.json

# # # Install dependencies
# # RUN npm install

# # # Copy source code
# # COPY . .

# # # Build the application
# # RUN npm run build

# # # Production stage
# # FROM nginx:alpine

# # # Copy built assets from builder stage
# # COPY --from=builder /app/build /usr/share/nginx/html

# # # Copy nginx configuration
# # COPY nginx.conf /etc/nginx/conf.d/default.conf

# # # Expose port 80 for nginx
# # EXPOSE 80

# # # Start nginx in foreground
# # CMD ["nginx", "-g", "daemon off;"]
# # Build stage
# FROM node:18-alpine AS builder
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # First remove package-lock.json to avoid conflicts
# RUN rm -f package-lock.json

# # Install dependencies with legacy peer deps
# RUN npm install --legacy-peer-deps

# # Copy source code
# COPY . .

# # Build the application
# RUN npm run build

# # Production stage
# FROM nginx:alpine

# # Copy built assets from builder stage
# COPY --from=builder /app/build /usr/share/nginx/html

# # Copy nginx configuration
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Expose port 80 for nginx
# EXPOSE 80

# # Start nginx in foreground
# CMD ["nginx", "-g", "daemon off;"]
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install with specific resolutions
RUN npm cache clean --force && \
    rm -f package-lock.json && \
    npm install --legacy-peer-deps --force

# Copy source code
COPY . .

# Set environment variable to skip optional dependencies
ENV SKIP_OPTIONAL_DEPENDENCIES=true

# Build with specific dependency versions
RUN npm install --save --legacy-peer-deps \
    ajv@^6.12.6 \
    ajv-keywords@^3.5.2 && \
    npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
