import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { initializeSwagger } from "@synple/utils";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	initializeSwagger(
		app,
		"Synple Registration Service",
		"The registration API used to create user accounts on the Synple application suite",
	);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
