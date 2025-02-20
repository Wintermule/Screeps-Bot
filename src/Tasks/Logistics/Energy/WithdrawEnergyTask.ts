import { TaskStatus, TaskType } from "../../Core/Enums";
import { TaskBase } from "../../Core/TaskBase";

export class WithdrawEnergyTask extends TaskBase<StructureStorage | StructureContainer> {
    public static readonly TYPE = TaskType.WithdrawEnergy;

    constructor(target: StructureStorage | StructureContainer) {
        super(WithdrawEnergyTask.TYPE, target.id);
    }

    /**
     * Assigns a creep to this task
     * @param creep - The creep to assign to the task
     * @returns True if the creep was successfully assigned
     */
    AssignCreep(creep: Creep): boolean {
        return true;
    }

    /**
     * Checks if the task is valid by verifying target exists and has energy
     * @param creep - The creep to validate the task for
     * @returns True if the task is valid, false otherwise
     */
    public IsValid(creep: Creep): boolean {
        const target = this.GetTarget();
        return creep.store.getFreeCapacity() > 0 && target !== null && target.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
    }

    /**
     * Executes the withdraw energy task for the given creep
     * @param creep - The creep executing the task
     * @returns The current status of the task
     */
    public Execute(creep: Creep): TaskStatus {
        const target = this.GetTarget();
        if(!target) return TaskStatus.FAILED;

        if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
            creep.moveTo(target);
            return TaskStatus.IN_PROGRESS;
        }

        return creep.store.getFreeCapacity() === 0 ? TaskStatus.COMPLETE : TaskStatus.IN_PROGRESS;
    }
}
