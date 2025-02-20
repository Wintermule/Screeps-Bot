import { Colony } from "Colony";
import { SpawnRequestManager } from "./SpawnRequestManager";
import { BodyBuilder } from "./Body/BodyBuilder";
import { CreepRole } from "Shared/CreepRoles";
import { sharedMessageBus } from "Messaging/SharedMessageBus";
import { CreepSpawnManager } from "Modules/CreepSpawnModule/CreepSpawnManager";

export class SpawnManager {
    colony: Colony;
    public spawnRequestManager: SpawnRequestManager;

    constructor(colony: Colony) {
        this.colony = colony;
        this.spawnRequestManager = colony.SpawnRequestManager;
    }

    /**
     * Main execution method for spawn management
     */
    public Run() {
        if (this.RoomHasFullEnergy()) {
            this.ProcessSpawnRequests();
        }
    }

    /**
     * Attempts to spawn a new creep with the given parameters
     * @param spawn - The spawn structure to use
     * @param role - Role of the creep to spawn
     * @param body - Array of body parts to use
     * @param memory - Optional memory to initialize the creep with
     * @returns ScreepsReturnCode indicating success or failure
     */
    public SpawnCreep(spawn: StructureSpawn, role: CreepRole, body: BodyPartConstant[], memory?: CreepMemory): ScreepsReturnCode {
        const creepName = this.generateUniqueCreepName(role);
        var result =  spawn.spawnCreep(body, creepName, { memory: memory });

        if(result == OK){
            debugger;
            // this.onCreepSpawned(creepName);
        }

        return result;
    }

    private ProcessSpawnRequests() {
        const spawnRequest = this.spawnRequestManager.getNextSpawnRequest();
        if (spawnRequest) {
            const spawn = this.GetAvailableSpawn();
            if (spawn) {
                const body = BodyBuilder.buildBody(spawnRequest.role, spawn.room.energyAvailable);
                const result = this.SpawnCreep(spawn, spawnRequest.role, body, spawnRequest.memory);
                if (result === OK) {
                    console.log(`Spawning creep with role ${spawnRequest.role}`);
                } else {
                    console.log(`Failed to spawn creep with role ${spawnRequest.role}. Error code: ${result}`);
                }
            }
        }
    }

    private generateUniqueCreepName(role: CreepRole) {
        return `${role}_${Game.time}`;
    }

    private GetAvailableSpawn(): StructureSpawn | null {
        const availableSpawns = this.colony.room.find(FIND_MY_SPAWNS).filter(spawn => spawn.spawning === null);
        return availableSpawns.length > 0 ? availableSpawns[0] : null;
    }

    private RoomHasFullEnergy(): boolean {
        return this.colony.room.energyAvailable === this.colony.room.energyCapacityAvailable;
    }
}
