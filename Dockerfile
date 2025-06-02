# Use the official Node.js image
FROM node:22.16.0

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose port (Next.js default)
EXPOSE 3000

# Run the dev server
CMD ["npm", "run", "dev"]
