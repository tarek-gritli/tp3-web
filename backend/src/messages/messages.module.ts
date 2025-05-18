import { Module } from '@nestjs/common';
import { ChatGateway } from './chatGateway';


@Module({
  providers: [ChatGateway],
})
export class MessagesModule { }