import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CategoriesService } from './catagories.service';
import { JwtAuthGuard } from 'src/auth/strategies/jwt.auth-guard';
import { SubscribeDto } from './dto/catergories.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available categories' })
  @ApiResponse({ status: 200, description: 'Returns list of categories' })
  async getCategories() {
    return this.categoriesService.getCategories();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe to content categories' })
  @ApiResponse({ status: 200, description: 'Subscription successful' })
  async subscribe(@Request() req, @Body() subscribeDto: SubscribeDto) {
    return this.categoriesService.subscribe(
      req.user.userId,
      subscribeDto.categories,
    );
  }

  @Delete('unsubscribe')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(
    @Request() req,
    @Body() { categoryIds }: { categoryIds: string[] },
  ) {
    return this.categoriesService.unsubscribe(req.user.id, categoryIds);
  }
}
