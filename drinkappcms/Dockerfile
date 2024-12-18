# Use the official Node.js image as the base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vue.js app for production
RUN npm run build

# Use an Nginx image to serve the built files
FROM nginx:alpine

# Copy the built files from the Node.js stage to Nginx's default public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Update Nginx's configuration to listen on port 8086
RUN sed -i 's/listen       80;/listen       8086;/' /etc/nginx/conf.d/default.conf

# Expose port 8086 for the container
EXPOSE 8086

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
