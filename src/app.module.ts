import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import { AdminsModule } from './admins/admins.module';
import { Admin } from './admins/models/admin.model';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      models: [Admin],
      autoLoadModels: true,
      sync: { alter: true },
      logging: false,
    }),
    AdminsModule,
    AuthModule,
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}






