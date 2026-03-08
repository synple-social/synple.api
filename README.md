## Description

This repository holds the logic for our services. For now it holds the non-authenticated services (registration, authentication), but it might end up containing any service, authenticated or non authenticated as every sub-application can be deployed in a dedicated server or container.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

In the follow commands, you can replace `<application>` by any of our applications (eg. `public` or `api`)

```bash
# development
$ pnpm run start <application>

# watch mode
$ pnpm run start:dev <application>

# production mode
$ pnpm run start:prod <application>
```

## Run tests

All the tests are end-to-end (e2e) tests as we believe that, for the time being, it is the only kind of tests that matter.

```bash
$ pnpm run test:e2e
```