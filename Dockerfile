# Usa Node.js como imagen base
FROM node:18

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos de dependencias primero (mejor caché)
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Asegura que Prisma esté configurado para producción
RUN npx prisma generate

# Compila la app de Next.js
RUN npm run build

# Expone el puerto en el que corre la app
EXPOSE 3000

# Inicia la aplicación
CMD ["npm", "start"]
