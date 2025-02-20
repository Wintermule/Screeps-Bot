import { IMessage, MessageStatus } from "Messaging/Core/IMessage";
import { MessageType } from "../Core/MessageType";
import { ISpawnRequest } from "Modules/SpawnManagerModule/ISpawnRequest";

export class CreepSpawnRequest implements IMessage {
    public static readonly type: MessageType = MessageType.CreepSpawn;
    public readonly type: MessageType;
    public status: MessageStatus;
    public colonyId: string;
    public spawnRequest: ISpawnRequest;

    constructor(spawnRequest: ISpawnRequest, colonyId: string) {
        this.type = MessageType.CreepSpawnRequest;
        this.colonyId = colonyId;
        this.spawnRequest = spawnRequest;
        this.type = CreepSpawnRequest.type;
        this.status = MessageStatus.Pending;
    }
}
