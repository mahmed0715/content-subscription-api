import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CategoriesService } from './catagories.service';
import { CategoriesController } from './catagories.controller';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/common/services/mailer.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PrismaService,
    JwtService,
    MailerService,
    ConfigService,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
