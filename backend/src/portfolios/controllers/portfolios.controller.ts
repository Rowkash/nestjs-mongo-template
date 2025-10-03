import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import {
  ICustomRequest,
  IRequestUser,
} from '@/common/interfaces/custom-request.interface';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { Portfolio } from '@/portfolios/schemas/portfolio.schema';
import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import { CreatePortfolioDto } from '@/portfolios/dto/create-portfolio.dto';
import { UpdatePortfolioDto } from '@/portfolios/dto/update-portfolio.dto';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { MongoIdValidationPipe } from '@/common/pipes/mongo-id-validation.pipe';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @ApiOperation({ summary: 'Create portfolio' })
  @ApiOkResponse({
    type: Portfolio,
    description: 'Returns portfolio',
  })
  @Post()
  async create(
    @Req() { user }: ICustomRequest,
    @Body() dto: CreatePortfolioDto,
  ) {
    const { id: userId } = user as IRequestUser;
    const portfolio = await this.portfoliosService.create({
      ...dto,
      user: userId,
    });
    return plainToInstance(Portfolio, portfolio, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: 'Update portfolio' })
  @Patch(':id')
  update(
    @Req() { user }: ICustomRequest,
    @Param('id', MongoIdValidationPipe) id: string,
    @Body() dto: UpdatePortfolioDto,
  ) {
    const { id: userId } = user as IRequestUser;
    return this.portfoliosService.update({ ...dto, id, user: userId });
  }

  @ApiOperation({ summary: 'Get portfolios page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return portfolios page',
  })
  @Get()
  getPage(@Query() query: PortfolioPageDto) {
    return this.portfoliosService.getPage(query);
  }

  @ApiOperation({ summary: 'Get portfolio by id' })
  @ApiOkResponse({
    description: 'Return portfolio by id',
    type: Portfolio,
  })
  @Get(':id')
  async findById(@Param('id', MongoIdValidationPipe) portfolioId: string) {
    const portfolio = await this.portfoliosService.findOne({
      id: portfolioId,
      populate: { images: true },
    });
    return new Portfolio(portfolio);
  }

  @ApiOperation({ summary: 'Delete portfolio' })
  @Delete(':id')
  async remove(
    @Req() { user }: ICustomRequest,
    @Param('id', MongoIdValidationPipe) portfolioId: string,
  ) {
    const { id: userId } = user as IRequestUser;

    await this.portfoliosService.remove(portfolioId, userId);
  }
}
