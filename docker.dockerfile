# 1. Usa una imagen base de Node.js con versión 18 (soporta TypeScript)
FROM node:18

# 2. Crea y establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia solo los archivos necesarios para instalar dependencias (optimiza caché de Docker)
COPY package*.json ./

# 4. Instala las dependencias (node_modules)
RUN npm install

# 5. Copia TODO el código fuente al contenedor (incluyendo /src, tsconfig.json, etc.)
COPY . .

# 6. Compila TypeScript a JavaScript (esto genera la carpeta /dist)
RUN npm run build

# 7. Comando que se ejecutará al iniciar el contenedor
CMD ["npm", "start"]