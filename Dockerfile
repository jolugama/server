# Usar una imagen oficial de Node.js como base
FROM node:18

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app/server

# Copiar el archivo package.json y package-lock.json (si existe) al directorio de trabajo
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente al directorio de trabajo
COPY . .

# Compilar el proyecto TypeScript
RUN npx tsc

# Exponer el puerto que tu aplicación usará (por ejemplo, 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
