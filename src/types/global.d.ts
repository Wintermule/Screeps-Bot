import { ITask } from "../Tasks/Core/ITask";
import { ISpawnRequest } from "../Modules/SpawnManagerModule/ISpawnRequest";
import { IMessage } from "Messaging/Core/IMessage";

export {};

declare global {
    interface Memory {
        uuid: number;
        log: any;
        moduleIndex: number;
        messages: IMessage[];
    }

    interface CreepMemory {
        role: string;
        originRoom: string;
        taskId?: string;
    }

    interface RoomMemory {
        creeps: Id<Creep>[];
        tasks: ITask[];
        spawnQueue: ISpawnRequest[];
    }

    namespace NodeJS {
        interface Global {
            log: any;
        }
    }
}
