# Installing dependencies:
FROM node:22.22.0-alpine AS install-dependencies
RUN npm install --global pnpm
WORKDIR /user/src/app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .

# Creating a build:
FROM node:22.22.0-alpine AS create-build
RUN npm install --global pnpm
WORKDIR /user/src/app
COPY --from=install-dependencies /user/src/app ./
CMD ["pnpm", "run", "start:dev" "registrations"]