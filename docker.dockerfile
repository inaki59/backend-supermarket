FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && ls -la dist/  # Verifica que se generen los archivos
CMD ["npm", "start"]