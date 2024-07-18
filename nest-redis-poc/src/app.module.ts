import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/user.entity/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisSt from "cache-manager-redis-store";
import type { RedisClientOptions } from "redis";
import { Socket } from 'dgram';



@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: async() => {await redisSt.redisStore({socket: {
        host: 'localhost', // default value
        port: 6379, // default value
      }})},
      

    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      password: 'simform',
      username: 'postgres',
      entities: [UserEntity], // here we have added user enitity in entities array
      database: 'redisPoc',
      synchronize: true,
      logging: true,
    }),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
