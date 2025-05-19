import { EventType } from '../event.enum';

export class CreateEventDto {
  type: EventType;
  cvId: number;
  userId: number;
  details?: any;
}
