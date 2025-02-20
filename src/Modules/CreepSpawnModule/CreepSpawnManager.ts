import { Colony } from "Colony";
import { CreepSpawnMessage } from "Messaging/Messages/CreepSpawnMessage";
import { sharedMessageBus } from "Messaging/SharedMessageBus";
import { CreepRole } from "Shared/CreepRoles";
import { SpawnRequestFactory } from "Shared/SpawnRequestFactory";

export class CreepSpawnManager {
    private room: Room;
    private colony: Colony;

    constructor(colony: Colony) {
        this.colony = colony;
        this.room = colony.room;
    }

    /**
     * Evaluates colony needs and requests creep spawning based on role priorities.
     * Roles are checked in order: Harvester, Upgrader, Worker, EnergyDistributor.
     * Creates and publishes a spawn request for the highest priority needed role.
     */
    public run(): void {
        let role: CreepRole | undefined = undefined;
        let priority: number | undefined = undefined;
        const rolePriority = [
            { check: this.needHarvester.bind(this), role: CreepRole.Harvester, priority: 4 },
            { check: this.needUpgrader.bind(this), role: CreepRole.Upgrader, priority: 3 },
            { check: this.needWorker.bind(this), role: CreepRole.Worker, priority: 2 },
            { check: this.needEnergyDistributor.bind(this), role: CreepRole.Energy_Distributor, priority: 1 }
        ];

        for (const { check, role: r, priority: p } of rolePriority) {
            if (check()) {
            role = r;
            priority = p;
            break;
            }
        }

        if (role && priority !== undefined) {
            var request = SpawnRequestFactory.CreateRequest(this.room.name, this.colony.Id, role, priority);
            sharedMessageBus.publish(request);
        }
    }

    private hasActiveRequests(): boolean {
        let coonyId = this.colony.Id;
        const existingRequests = sharedMessageBus.GetMessages<CreepSpawnMessage>().filter((msg) => (msg as CreepSpawnMessage).colonyId === this.colony.Id);

        return true;
    }

    private needHarvester(): boolean {
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == CreepRole.Harvester);
        const sources = this.room.find(FIND_SOURCES);
        return harvesters.length < sources.length;
    }

    private needUpgrader(): boolean {
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == CreepRole.Upgrader);
        return upgraders.length == 0;
    }

    private needWorker(): boolean {
        if(this.colony.storage){
            return this.colony.storage.store.getUsedCapacity(RESOURCE_ENERGY) > 1000;
        }

        const workers = _.filter(Game.creeps, (creep) => creep.memory.role == CreepRole.Worker);
        return workers.length < 2;
    }

    private needEnergyDistributor(): boolean {
        const  energyDistributor = _.filter(Game.creeps, (creep) => creep.memory.role == CreepRole.Energy_Distributor);
        return energyDistributor.length == 0;
    }
}
