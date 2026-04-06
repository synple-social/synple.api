FROM node:22.22.0-alpine

ARG APP_NAME=public

ENV CI=true

WORKDIR /app
COPY --exclude=node_modules/* --exclude=dist/* . .

RUN npm install --global pnpm
RUN pnpm install
run pnpm build $APP_NAME
RUN if [ ! -d "node_modules/sqlite3" ]; then cd node_modules/sqlite3 && pnpm rebuild; fi
CMD [ "node", "dist/apps/public/main" ]