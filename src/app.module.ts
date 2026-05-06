import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClaimsModule } from './claims/claims.module';


@Module({
  imports: [
    // Load Environment Variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Oracle Database Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'oracle',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        serviceName: config.get<string>('DB_SERVICE_NAME'),
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
        autoLoadEntities: true, // auto detects User, Item, and Claim entities
        logging: true,
      }),
    }),

    // Mailer Configuration
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // Upgrades to TLS automatically
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Unima Found" <${config.get('MAIL_USER')}>`,
        },
      }),
    }),

    // Feature Modules
    ItemsModule,
    UsersModule,
    AuthModule,
    ClaimsModule,
  ],
})
export class AppModule {}