
import { CreepRole } from "Shared/CreepRoles";
import { ISpawnRequest } from "./ISpawnRequest";

export class SpawnRequest implements ISpawnRequest {
    memory: CreepMemory;
    role: CreepRole;
    priority: number;

    constructor(originRoomName: string, role: CreepRole, priority: number, memory?: CreepMemory) {
        this.role = role;
        this.priority = priority;
        this.memory = memory || this.CreateDefaultMemory(role, originRoomName);
    }

    private CreateDefaultMemory(role: CreepRole, originRoomName: string): CreepMemory {
        return {
            role: role,
            originRoom: originRoomName,
            taskId: undefined,
        };
    }
}
