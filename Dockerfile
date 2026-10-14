FROM public.ecr.aws/docker/library/node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html tsconfig.json vite.config.ts ./
COPY src ./src
COPY shared ./shared
COPY public ./public
RUN npm run build
FROM public.ecr.aws/docker/library/node:24-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY shared ./shared
COPY --from=build /app/dist ./dist
RUN chmod -R a+rX /app/dist
USER node
EXPOSE 8080
CMD ["node", "server/index.mjs"]
