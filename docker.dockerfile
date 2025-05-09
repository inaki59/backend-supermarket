# Usando Node.js 18 como base
FROM node:18

# Definir el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el código TypeScript (si usas TS)
RUN npm run build && ls -la dist/

# Establecer el comando de inicio
CMD ["node", "dist/index.js"]
