import { CreepSpawnRequest } from "Messaging/Messages/CreepSpawnRequest";
import { CreepRole } from "./CreepRoles";
import { SpawnRequest } from "Modules/SpawnManagerModule/SpawnRequest";

/**
 * Factory class for creating spawn requests with standardized parameters
 */
export class SpawnRequestFactory {
    /**
     * Creates a new CreepSpawnRequest with the specified parameters
     * @param originRoomName - The name of the room requesting the spawn
     * @param colonyId - The ID of the colony that will manage the creep
     * @param role - The role the spawned creep will perform
     * @param priority - The priority level for this spawn request
     * @returns A new CreepSpawnRequest instance
     */
    public static CreateRequest(originRoomName: string, colonyId: string, role: CreepRole, priority: number): CreepSpawnRequest {
        const spawnRequest = new SpawnRequest(originRoomName, role, priority);
        return new CreepSpawnRequest(spawnRequest, colonyId);
    }
}
