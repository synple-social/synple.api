FROM node:22.22.0-alpine
WORKDIR /user/src/app
COPY package.json pnpm-lock.yaml .
RUN npm install --global pnpm
RUN pnpm install
COPY . .
RUN pnpm build public
RUN if [ ! -d "/user/src/app/node_modules/sqlite3" ]; then cd /user/src/app/node_modules/sqlite3 && pnpm rebuild; fi
CMD pnpm start:prod:public