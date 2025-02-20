import { IdGenerator } from "utils/IdGenerator";
import { MessageType } from "../Core/MessageType";
import { IMessage, MessageStatus } from "Messaging/Core/IMessage";

export class CreepSpawnMessage implements IMessage {
    public static readonly type: MessageType = MessageType.CreepSpawn;
    public readonly type: MessageType;
    public status: MessageStatus;
    public creep: Creep;
    public colonyId: string;

    constructor(creep: Creep) {
        this.creep = creep;
        this.colonyId = IdGenerator.GetColonyID(creep.room.name);
        this.type = CreepSpawnMessage.type;
        this.status = MessageStatus.Pending;
    }
}
