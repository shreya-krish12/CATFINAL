# Use the official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
# Install Yarn

# Build the React app for production
RUN npm install --verbose



# Install a simple HTTP server to serve the static files


# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
