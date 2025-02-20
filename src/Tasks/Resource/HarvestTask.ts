import { TaskStatus, TaskType } from "Tasks/Core/Enums";
import { TaskBase } from "../Core/TaskBase"

export class HarvestTask extends TaskBase<Source> {
    public static readonly TYPE = TaskType.Harvest;

    constructor(target: Source){
        super(HarvestTask.TYPE, target.id);
    }

    /**
     * Checks if the task is valid by verifying target exists and creep has storage capacity
     * @param creep - The creep to validate the task for
     * @returns True if the task is valid, false otherwise
     */
    public IsValid(creep: Creep): boolean {
        const target = this.GetTarget();
        return  target !== null && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }

    /**
     * Executes the harvest task for the given creep
     * @param creep - The creep executing the task
     * @returns The current status of the task
     */
    public Execute(creep: Creep): TaskStatus {
        const target = this.GetTarget();
        if(!target) return TaskStatus.FAILED;

        if(creep.harvest(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
            return TaskStatus.IN_PROGRESS;
        }

        return creep.store.getFreeCapacity() === 0 ? TaskStatus.COMPLETE : TaskStatus.IN_PROGRESS;
    }
}
