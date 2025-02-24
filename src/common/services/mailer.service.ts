import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';
import * as cron from 'node-cron';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailerService {
  private transporter;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, // Set this in .env
        pass: process.env.EMAIL_PASS, // Set this in .env
      },
    });
    cron.schedule('0 9 * * 1', () => {
      this.sendWeeklyRecommendations();
    });
    // send when start the server, for testing prupose, actual cron string is above
    this.sendWeeklyRecommendations();
  }

  async sendSubscriptionConfirmation(userId: string, categories: string[]) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) return;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Subscription Confirmation',
      text: `You have successfully subscribed to: ${categories.join(', ')}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
  async sendWeeklyRecommendations() {
    const users = await this.prisma.user.findMany({
      include: { categories: true },
    });

    for (const user of users) {
      if (user.categories.length === 0) continue;

      const recommendedContent = await this.prisma.content.findMany({
        where: { categoryId: { in: user.categories.map((cat) => cat.id) } },
      });

      if (recommendedContent.length === 0) continue;

      const emailContent = recommendedContent
        .map((article) => `- ${article.title}: ${article.url}`)
        .join('\n');

      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_USER'),
        to: user.email,
        subject: 'Weekly Content Recommendations',
        text: `Here are your recommended articles:\n\n${emailContent}`,
      });

      console.log(`📨 Weekly email sent to ${user.email}`);
    }
  }
}
