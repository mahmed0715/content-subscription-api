import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './catagories/catagories.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, CategoriesModule],
})
export class AppModule {}
