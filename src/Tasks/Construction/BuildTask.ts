import { TaskStatus, TaskType } from "Tasks/Core/Enums";
import { TaskBase } from "../Core/TaskBase";

export class BuildTask extends TaskBase<ConstructionSite> {
    public static readonly TYPE = TaskType.Build;

    constructor(target: ConstructionSite) {
        super(BuildTask.TYPE, target.id);
    }

    /**
     * Checks if the task is still valid for the given creep.
     * @param creep - The creep to validate the task for
     * @returns True if the task is valid, false otherwise
     */
    public IsValid(creep: Creep): boolean {
        const target = this.GetTarget();
        return target !== null;
    }

    /**
     * Executes the build task for the given creep.
     * @param creep - The creep executing the task
     * @returns The current status of the task
     */
    public Execute(creep: Creep): TaskStatus {
        const target = this.GetTarget();
        if (!target) return TaskStatus.FAILED;

        if (creep.build(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return TaskStatus.IN_PROGRESS;
        }

        return creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0 ? TaskStatus.COMPLETE : TaskStatus.IN_PROGRESS;
    }
}
