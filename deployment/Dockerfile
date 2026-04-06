ARG NODE_VERSION=25

FROM node:${NODE_VERSION}-alpine AS build

ARG APP_NAME=public

ENV CI=true

WORKDIR /app
COPY --exclude=node_modules/* --exclude=dist/* . .

RUN npm install --global pnpm
RUN pnpm install
RUN if [ ! -d "node_modules/sqlite3" ]; then cd node_modules/sqlite3 && pnpm rebuild; fi
run pnpm build $APP_NAME

FROM node:${NODE_VERSION}-alpine AS runtime

WORKDIR /app

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app

RUN npm install --global pnpm
RUN pnpm install --prod

CMD [ "node", "dist/apps/public/main" ]