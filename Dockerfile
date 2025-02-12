# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# # Build the React app
# RUN npm run build

# # Install serve to run the built app
# RUN npm install -g serve

# EXPOSE 3000

# # # Serve the built app
# CMD ["serve", "-s", "build", "-l", "3000"]
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN npm install -g serve

EXPOSE 3000

# # Serve the built app
CMD ["serve", "-s", "build", "-l", nginx", "-g", "daemon off" ,3000"]
