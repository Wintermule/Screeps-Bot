import { IMessage } from "./IMessage";
import { MessageType } from "./MessageType";

export interface IHandle<T extends IMessage = IMessage> {
    getTypes(): MessageType[];
    handle(message: T): void;
}
