FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build || exit 1  # Fuerza a fallar si el build no funciona
CMD ["npm", "start"]