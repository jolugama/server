# Etapa de construcción
FROM node:18 as build
WORKDIR /usr/src/app/server
COPY package*.json ./
RUN npm install
COPY . .
RUN npx tsc

# Etapa de producción
FROM node:18-alpine
WORKDIR /usr/src/app/server

# Copia el directorio 'data' al contenedor
COPY --from=build /usr/src/app/server/data /usr/src/app/server/data

COPY --from=build /usr/src/app/server/dist /usr/src/app/server/dist

# Copia solo package.json y package-lock.json para la instalación de dependencias
COPY --from=build /usr/src/app/server/package*.json ./ 

# Instala solo las dependencias necesarias en producción
RUN npm ci --only=production 
RUN npm install -g nodemon 

# Expone el puerto que tu aplicación utilizará
EXPOSE 3000

# Comando para ejecutar tu aplicación
CMD ["npm", "start"]
