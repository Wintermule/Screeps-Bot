import { SubscribeMessages } from "Decorators/SubscribeMessages";
import { IHandle } from "Messaging/Core/IHandle";
import { MessageType } from "Messaging/Core/MessageType";
import { CreepDeathMessage } from "Messaging/Messages/CreepDeathMessage";
import { CreepSpawnMessage } from "Messaging/Messages/CreepSpawnMessage";
import { CreepSpawnRequest } from "Messaging/Messages/CreepSpawnRequest";
import { SpawnRequestManager } from "Modules/SpawnManagerModule/SpawnRequestManager";
import { TaskManager } from "Tasks/Core/TaskManager";


@SubscribeMessages()
export class Colony implements IHandle<CreepDeathMessage>, IHandle<CreepSpawnMessage>, IHandle<CreepSpawnRequest> {
    room: Room;
    creeps: Creep[] = [];
    Id: string;
    storage: StructureStorage | StructureContainer | null = null;
    public TaskManager: TaskManager;
    public SpawnRequestManager: SpawnRequestManager;

    constructor(room: Room) {
        this.room = room;
        this.Id = `Colony_${room.name}`;
        this.SpawnRequestManager = new SpawnRequestManager(this.room);
        this.TaskManager = new TaskManager(room.name, this.Id);
        this.loadCreepsFromMemory();
        this.TaskManager.assingTask(this.creeps);
        this.setStorage();
    }

    /**
     * Gets the message types this colony handles
     * @returns Array of MessageTypes this colony processes
     */
    public getTypes(): MessageType[] {
        return [MessageType.CreepDeath, MessageType.CreepSpawn, MessageType.CreepSpawnRequest];
    }

    /**
     * Handles incoming messages for the colony
     * @param message The message to process
     */
    public handle(message: (CreepDeathMessage | CreepSpawnMessage | CreepSpawnRequest)): void {
        if(message.colonyId != this.Id){
            return;
        }

        if (message instanceof CreepSpawnMessage) {
            debugger;
            this.AddCreep(message.creep);
        }
        else if (message instanceof CreepDeathMessage) {
            this.RemoveCreep(message.creepName);
        }
        else if (message instanceof CreepSpawnRequest) {
            this.SpawnRequestManager.enqueueSpawnRequest(message.spawnRequest);
        }
    }

    /**
     * Adds a new creep to the colony and assigns it a task
     * @param creep The creep to add to the colony
     */
    public AddCreep(creep: Creep) {
        debugger;
        this.creeps.push(creep);
        this.TaskManager.assingTask(creep);
        this.saveCreepsToMemory();
    }

    /**
     * Removes a creep from the colony and updates memory
     * @param creepName Name of the creep to remove
     */
    public RemoveCreep(creepName: string) {
        debugger;
        this.creeps = this.creeps.filter(creep => creep.name !== creepName);
        this.saveCreepsToMemory();
    }

    private setStorage() {
        const spawns = this.room.find(FIND_MY_SPAWNS);
        if (spawns.length > 0) {
            const spawn = spawns[0];
            const containers = spawn.pos.findInRange(FIND_STRUCTURES, 5, {
                filter: (structure) => structure.structureType === STRUCTURE_CONTAINER
            });
            if (containers.length > 0) {
                this.storage = containers[0] as StructureContainer;
                return;
            }
        }
        const storages = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_STORAGE
        });
        if (storages.length > 0) {
            this.storage = storages[0] as StructureStorage;
        }
    }

    private saveCreepsToMemory() {
        this.room.memory.creeps = this.creeps.map(creep => creep.id);
    }

    private loadCreepsFromMemory() {
        if (this.room.memory.creeps) {
            this.creeps = this.room.memory.creeps
                .map((creepId: Id<Creep>) => Game.getObjectById(creepId))
                .filter((creep): creep is Creep => creep !== null);
        }
    }
}
