import { TaskStatus, TaskType } from "Tasks/Core/Enums";
import { TaskBase } from "../Core/TaskBase";

export class UnendingHarvestTask extends TaskBase<Source> {
    public static readonly TYPE = TaskType.UnendingHarvest;

    constructor(target: Source) {
        super(UnendingHarvestTask.TYPE, target.id);
    }

    /**
     * Checks if the task is valid by verifying target exists
     * @param creep - The creep to validate the task for
     * @returns True if the task is valid, false otherwise
     */
    public IsValid(creep: Creep): boolean {
        const target = this.GetTarget();
        return target !== null;
    }

    /**
     * Executes the unending harvest task for the given creep
     * @param creep - The creep executing the task
     * @returns The current status of the task
     */
    public Execute(creep: Creep): TaskStatus {
        const target = this.GetTarget();
        if (!target) return TaskStatus.FAILED;

        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        return TaskStatus.IN_PROGRESS;
    }
}
