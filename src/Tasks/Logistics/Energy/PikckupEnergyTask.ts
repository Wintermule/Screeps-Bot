import { TaskStatus, TaskType } from "../../Core/Enums";
import { TaskBase } from "../../Core/TaskBase";

export class PikckupEnergyTask extends TaskBase<Resource> {
    public static readonly TYPE = TaskType.PickupEnergy;

    assigendEnergy: number = 0;

    constructor(target: Resource) {
        super(PikckupEnergyTask.TYPE, target.id);
    }

    /**
     * Assigns a creep to this task and tracks assigned energy amount
     * @param creep - The creep to assign to the task
     * @returns True if the creep was successfully assigned
     */
    override AssignCreep(creep: Creep): boolean {
        const target = this.GetTarget();
        if (!target) return false;

        const targetEnergy = target.amount - this.assigendEnergy;
        if (targetEnergy <= 0) return false;

        const creepEnergy = creep.store.getFreeCapacity(RESOURCE_ENERGY);

        this.assigendEnergy += creepEnergy;
        return true;
    }

    /**
     * Checks if the task is valid by verifying target exists and creep has capacity
     * @param creep - The creep to validate the task for
     * @returns True if the task is valid, false otherwise
     */
    IsValid(creep: Creep): boolean {
        const target = this.GetTarget();
        return creep.store.getFreeCapacity() > 0 && target !== null;
    }

    /**
     * Executes the pickup energy task for the given creep
     * @param creep - The creep executing the task
     * @returns The current status of the task
     */
    Execute(creep: Creep): TaskStatus {
        const target = this.GetTarget();
        if (!target) return TaskStatus.FAILED;

        if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
            return TaskStatus.IN_PROGRESS;
        }

        return creep.store.getFreeCapacity() === 0 ? TaskStatus.COMPLETE : TaskStatus.IN_PROGRESS;
    }
}
