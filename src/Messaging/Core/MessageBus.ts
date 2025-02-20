import { IHandle } from "./IHandle";
import { IMessage, MessageStatus } from "./IMessage";
import { MessageType } from "./MessageType";

export class MessageBus {
    private subscribers: Map<string, IHandle[]> = new Map();
    private messages: any;

    constructor() {
        this.messages = Memory.messages || [];
    }

    /**
     * Subscribe a handler to receive messages of specific types
     * @param handler The handler to subscribe
     */
    public subscribe(handler: IHandle): void {
        const types = handler.getTypes();

        for (const type of types) {
            if (!this.subscribers.has(type)) {
                this.subscribers.set(type, []);
            }
            this.subscribers.get(type)!.push(handler);
        }
    }

    /**
     * Unsubscribe a handler from a specific message type
     * @param type Message type to unsubscribe from
     * @param handler Handler to remove
     */
    public unsubscribe(type: string, handler: IHandle): void {
        if (this.subscribers.has(type)) {
            const handlers = this.subscribers.get(type)!.filter((h) => h !== handler);
            if (handlers.length > 0) {
                this.subscribers.set(type, handlers);
            } else {
                this.subscribers.delete(type);
            }
        }
    }

    /**
     * Publish a message to all subscribed handlers
     * @param message The message to publish
     */
    public publish(message: IMessage): void {
        if (this.subscribers.has(message.type)) {
            const handlers = this.subscribers.get(message.type)!;
            for (const handler of handlers) {
                handler.handle(message);
            }
        }
    }

    /**
     * Get all pending or processing messages of a specific type
     * @returns Array of messages
     */
    public GetMessages<T extends IMessage>(): T[] {
        return this.messages.filter((msg: { type: MessageType; status: MessageStatus; }): msg is T =>
            Object.values(MessageType).includes(msg.type) &&
            (msg.status === MessageStatus.Pending ||
             msg.status === MessageStatus.Processing)
        ) as T[];
    }

}
