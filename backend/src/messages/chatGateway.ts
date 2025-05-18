import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';

interface Reaction {
    type: string;
    count: number;
    users: string[];
}

interface Comment {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
}

interface Message {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
    reactions: Record<string, Reaction>;
    comments: Comment[];
}

@WebSocketGateway(3001, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private messages: Message[] = [];

    handleConnection(client: Socket) {
        client.emit('message', {
            event: 'allMessages',
            data: this.messages,
        });
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('message')
    handleMessage(client: Socket, payload: any): void {
        const message: Message = {
            id: randomUUID(),
            userId: payload.data.userId,
            username: payload.data.username,
            text: payload.data.text,
            timestamp: new Date(),
            reactions: {},
            comments: [],
        };

        this.messages.push(message);
        this.server.emit('message', {
            event: 'message',
            data: message,
        });
    }

    @SubscribeMessage('reaction')
    handleReaction(client: Socket, payload: any): void {
        const { messageId, userId, reactionType } = payload.data;
        const message = this.messages.find((m) => m.id === messageId);

        if (message) {
            if (!message.reactions[reactionType]) {
                message.reactions[reactionType] = {
                    type: reactionType,
                    count: 0,
                    users: [],
                };
            }

            if (!message.reactions[reactionType].users.includes(userId)) {
                message.reactions[reactionType].users.push(userId);
                message.reactions[reactionType].count++;
            }

            this.server.emit('message', {
                event: 'reaction',
                data: {
                    messageId,
                    reaction: message.reactions[reactionType],
                },
            });
        }
    }

    @SubscribeMessage('comment')
    handleComment(client: Socket, payload: any): void {
        const { messageId, userId, username, text } = payload.data;
        const message = this.messages.find((m) => m.id === messageId);

        if (message) {
            const comment: Comment = {
                id: randomUUID(),
                userId,
                username,
                text,
                timestamp: new Date(),
            };

            message.comments.push(comment);

            this.server.emit('message', {
                event: 'comment',
                data: {
                    messageId,
                    comment,
                },
            });
        }
    }
}
