import { TaskStatus, TaskType } from "Tasks/Core/Enums";
import { TaskBase } from "../../Core/TaskBase";

export class DistributeEnergyTask extends TaskBase<StructureExtension | StructureSpawn> {
    public static readonly TYPE = TaskType.DistributeEnergy;

    constructor(target: StructureExtension | StructureSpawn) {
        super(DistributeEnergyTask.TYPE, target.id);
    }

    /**
     * Checks if the task is valid by verifying target exists and needs energy
     * @param creep - The creep to validate the task for
     * @returns True if the task is valid, false otherwise
     */
    public IsValid(creep: Creep): boolean {
        const target = this.GetClossestTarget(creep);
        return target !== null && target.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }

    /**
     * Executes the energy distribution task for the given creep
     * @param creep - The creep executing the task
     * @returns The current status of the task
     */
    public Execute(creep: Creep): TaskStatus {
        const target = this.GetClossestTarget(creep);
        if(!target) return TaskStatus.FAILED;

        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
            return TaskStatus.IN_PROGRESS;
        }

        return creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 ? TaskStatus.COMPLETE : TaskStatus.IN_PROGRESS;
    }

    /**
     * Finds the closest valid target structure that needs energy
     * @param creep - The creep to find the closest target for
     * @returns The closest valid target or null if none found
     */
    private GetClossestTarget(creep: Creep): StructureExtension | StructureSpawn | null {
        return creep.pos.findClosestByPath<StructureExtension | StructureSpawn>(FIND_STRUCTURES, {
            filter: (structure) =>
            (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
    }
}
