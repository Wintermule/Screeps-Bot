import { IdGenerator } from "utils/IdGenerator";
import { MessageType } from "../Core/MessageType";
import { IMessage, MessageStatus } from "Messaging/Core/IMessage";

export class CreepDeathMessage implements IMessage {
    public static readonly type: MessageType = MessageType.CreepSpawn;
    public readonly type: MessageType;
    public status: MessageStatus;
    public creepName: string;
    public colonyId: string;

    constructor(creepName: string, originRoomName: string) {
        this.creepName = creepName;
        this.colonyId = IdGenerator.GetColonyID(originRoomName);
        this.type = CreepDeathMessage.type;
        this.status = MessageStatus.Pending;
    }
}
