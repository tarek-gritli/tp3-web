import { Controller, Req, UseGuards, Get } from '@nestjs/common';
import { EventService } from './event.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/common/types/auth.types';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('history')
  async getEventHistory(@Req() req: RequestWithUser) {
    return this.eventService.getEvents(req.user.userId, req.user.role);
  }
}
