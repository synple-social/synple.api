FROM node:22.22.0-alpine

ARG APP_NAME=public

ENV CI=true

WORKDIR /user/src/app
COPY . .
RUN npm install --global pnpm
RUN pnpm install
run pnpm build $APP_NAME
RUN if [ ! -d "/user/src/app/node_modules/sqlite3" ]; then cd /user/src/app/node_modules/sqlite3 && pnpm rebuild; fi
CMD [ "node", "dist/apps/public/main" ]