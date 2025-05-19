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
  Sse,
  MessageEvent,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/enums/auth.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RequestWithUser } from 'src/common/types/auth.types';
import { EventService } from 'src/event/event.service';
import { filter, fromEvent, map, merge, Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { EventType } from 'src/event/event.enum';

@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly eventService: EventService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req()
    req: RequestWithUser,
    @Body() createCvDto: CreateCvDto,
  ) {
    return this.cvService.createCv(createCvDto, req.user.userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Req()
    req: RequestWithUser,
  ) {
    return this.cvService.findAllCvs(req.user.userId, req.user.role);
  }

  @Sse('events')
  cvEvents(@Query('token') token: string): Observable<MessageEvent> {
    console.log('SSE connection established');
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }

    const user = this.authService.getUserFromToken(token);

    const addEvents = fromEvent(
      this.eventService.getEventEmitter(),
      EventType.ADD,
    );
    const updateEvents = fromEvent(
      this.eventService.getEventEmitter(),
      EventType.UPDATE,
    );
    const deleteEvents = fromEvent(
      this.eventService.getEventEmitter(),
      EventType.DELETE,
    );

    return merge(addEvents, updateEvents, deleteEvents).pipe(
      filter((event: {}) => {
        return user.role === Roles.admin || event.userId === user.userId;
      }),
      map((event) => {
        console.log('Streaming event:', event);
        return {
          data: event,
        } as MessageEvent;
      }),
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cvService.findOne(id);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
  ) {
    return this.cvService.updateCv(id, updateCvDto, req.user.userId);
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Req() req: RequestWithUser, @Param('id', ParseIntPipe) id: number) {
    return this.cvService.deleteCv(id, req.user.userId);
  }
}
