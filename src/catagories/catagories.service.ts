import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import { MailerService } from 'src/common/services/mailer.service';
@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
  ) {}

  async getCategories() {
    return this.prisma.category.findMany();
  }

  async subscribe2(userId: string, categoryNames: string[]) {
    const categories = await this.prisma.category.findMany({
      where: { name: { in: categoryNames } },
    });

    return this.prisma.user.update({
      where: { id: userId },
      data: { categories: { connect: categories.map((c) => ({ id: c.id })) } },
    });
  }

  async subscribe(userId: string, categoryNames: string[]) {
    // Fetch or create categories
    const categories = await Promise.all(
      categoryNames.map(async (name) => {
        return await this.prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        });
      }),
    );

    // Update user's categories using `connect`
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        categories: {
          connect: categories.map((category) => ({ id: category.id })), // Correct approach
        },
      },
    });

    // Send confirmation email
    await this.mailerService.sendSubscriptionConfirmation(
      userId,
      categoryNames,
    );

    return { message: 'Subscription successful', categories: categoryNames };
  }

  async fetchContent(categories: string[]) {
    const apiKey = 'your_newsapi_key';
    const categoryQuery = categories.join(',');
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=${categoryQuery}&apiKey=${apiKey}`,
    );
    return response.data.articles;
  }

  async sendEmail(to: string, subject: string, text: string) {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: { user: 'your_email', pass: 'your_password' },
    });
    await transporter.sendMail({ from: 'your_email', to, subject, text });
  }

  async unsubscribe(userId: string, categoryIds: string[]) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        categories: { disconnect: categoryIds.map((id) => ({ id })) },
      },
      include: { categories: true },
    });

    return {
      message: 'Unsubscription successful',
      remainingCategories: user.categories,
    };
  }
}
