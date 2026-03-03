# Etapa 1: Construcción
FROM node:22-alpine AS builder

WORKDIR /app

# Build args para inyectar variables en build time (requerido por Next.js NEXT_PUBLIC_*)
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

COPY package*.json ./

# Instalamos TODAS las dependencias para poder compilar
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Compilamos la app de Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:22-alpine AS runner

WORKDIR /app

# Solo copiamos dependencias necesarias
COPY --from=builder /app/node_modules ./node_modules

# Copiamos solo los archivos necesarios para producción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Non-root user para seguridad (uid 1000 = node user en alpine)
RUN chown -R node:node /app
USER node

# Exponemos el puerto que usa Next.js
EXPOSE 3000

# Comando para producción
CMD ["npm", "start"]
