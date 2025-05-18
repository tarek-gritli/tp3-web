import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/enums/auth.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/types/auth.types';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(
    @Req()
    req: RequestWithUser,
    @Body() createCvDto: CreateCvDto,
  ) {
    return this.cvService.create({
      ...createCvDto,
      user: { id: req.user.userId },
    });
  }

  @Get()
  findAll(
    @Req()
    req: RequestWithUser,
  ) {
    if (req.user.role === Roles.admin) {
      return this.cvService.findAll();
    }
    return this.cvService.findAllByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cvService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
  ) {
    return this.cvService.update(id, updateCvDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cvService.delete(id);
  }
}
