import { MessageType } from "./MessageType";

export interface IMessage {
    type: MessageType;
    colonyId: string;
    status: MessageStatus;
}


export enum MessageStatus {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed'
}
