FROM node:16
#WORKDIR /app
#COPY package.json . 
#RUN npm install
#COPY src /app/src
#COPY public /app/public
#EXPOSE 3000
#RUN npm run build
#CMD ["npm", "start", "--", "--host", "0.0.0.0"]            
#"--port", "3000"]
# Use the latest LTS version of Node.js
#FROM node:18-alpine
 
# Set the working directory inside the container
WORKDIR /app
 
# Copy package.json and package-lock.json
COPY package*.json ./
 
# Install dependencies
RUN npm install
 
# Copy the rest of your application files
COPY src /app/src
COPY public /app/public
 # Buduj aplikację w trybie produkcyjnym
RUN npm run build

# Zainstaluj serwer statyczny
RUN npm install -g serve
# Expose the port your app runs on
#EXPOSE 3000
 
# Define the command to run your app
CMD ["serve", "-s", "build", "-l", "3000"]