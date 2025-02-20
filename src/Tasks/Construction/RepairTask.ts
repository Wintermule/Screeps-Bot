import { TaskStatus, TaskType } from "Tasks/Core/Enums";
import { TaskBase } from "../Core/TaskBase";

export class RepairTask extends TaskBase<Structure> {
    public static readonly TYPE = TaskType.Repair;

    constructor(target: Structure) {
        super(RepairTask.TYPE, target.id);
    }

     /**
     * Checks if the task is still valid for the given creep.
     * @param creep - The creep to validate the task for
     * @returns True if the task is valid, false otherwise
     */
    public IsValid(creep: Creep): boolean {
        const target = this.GetTarget();
        return target !== null && target.hits < target.hitsMax;
    }

     /**
     * Executes the repair task for the given creep.
     * @param creep - The creep executing the task
     * @returns The current status of the task
     */
    public Execute(creep: Creep): TaskStatus {
        const target = this.GetTarget();
        if(!target) return TaskStatus.FAILED;

        if(creep.repair(target) == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
            return TaskStatus.IN_PROGRESS;
        }

        return target.hits === target.hitsMax ? TaskStatus.COMPLETE : TaskStatus.IN_PROGRESS;
    }
}
