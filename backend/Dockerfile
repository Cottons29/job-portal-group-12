FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/
COPY data_transfer ./data_transfer
RUN npm ci

COPY backend ./backend
RUN npm run build --workspace backend

RUN npm prune --omit=dev

FROM node:22-alpine

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=3080

COPY --from=build /app/backend/package*.json ./
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/backend/node_modules ./node_modules
COPY --from=build /app/backend/dist ./dist

EXPOSE 3080

CMD ["npm", "run", "start:prod"]