import { Module } from "@nestjs/common";
import { PreRegistrationsModule } from "./pre-registrations/pre-registrations.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { RegistrationsModule } from "./registrations/registrations.module";
import { AccountsModule } from "./accounts/accounts.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ["docker.env", ".env"],
			isGlobal: true,
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (service: ConfigService) => {
				return {
					dialect: "postgres",
					uri: service.get("DATABASE_URL"),
					autoLoadModels: true,
					logging: false,
				};
			},
			inject: [ConfigService],
		}),
		PreRegistrationsModule,
		RegistrationsModule,
		AccountsModule,
	],
})
export class AppModule {}
