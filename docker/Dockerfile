# ----------- Build Stage -----------
FROM node:lts-alpine AS build

WORKDIR /app

COPY ../package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY .. .

RUN yarn build

# ----------- Production Stage -----------
FROM node:lts-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/yarn.lock ./
COPY --from=build /app/dist ./dist

RUN yarn install --frozen-lockfile --production

EXPOSE 3000

CMD ["node", "dist/main"]
