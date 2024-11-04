# Use an official Node.js image as a base
FROM node:14  # You can replace 14 with another version if needed

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your frontend code
COPY . .

# Build the frontend for production
RUN npm run build

# Expose the port (if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
