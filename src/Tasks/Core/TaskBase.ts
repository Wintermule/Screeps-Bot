import { TaskType, TaskStatus } from "./Enums";
import { ITask } from "./ITask";
import { IdGenerator } from "utils/IdGenerator";

export abstract class TaskBase<T extends _HasId = any> implements ITask {
    public id: string;
    public type: TaskType;
    public target: Id<any>;
    public status: TaskStatus = TaskStatus.NOT_STARTED;
    public assignedCreeps: Creep[] = [];
    public maxCreeps: number = 0;

    constructor(type: TaskType, target: Id<any>) {
        this.id = IdGenerator.GetTaskID(type, target);
        this.type = type;
        this.target = target;
        this.status = TaskStatus.NOT_STARTED;
    }

    /**
     * Gets the target object associated with this task
     * @returns The target object or null if not found
     */
    GetTarget(): T | null {
        let target = Game.getObjectById(this.target);
        if (target instanceof Object) {
            return target as T;
        }
        return null;
    }

    /**
     * Assigns a creep to execute this task
     * @param creep The creep to assign to the task
     * @returns true if successfully assigned, false otherwise
     */
    public AssignCreep(creep: Creep): boolean {
        if (this.assignedCreeps.length < this.maxCreeps) {
            this.assignedCreeps.push(creep)
            return true;
        }
        return false;
    }

    /**
     * Unassigns a creep from this task
     * @param creepName Name of the creep to unassign
     */
    public UnassignCreep(creepName: string): void {
        this.assignedCreeps = this.assignedCreeps.filter(creep => creep.name !== creepName);

        if (this.assignedCreeps.length === 0) {
            this.status = TaskStatus.NOT_STARTED;
        }
    }

    /**
     * Checks if the task is still valid for the given creep
     * @param creep The creep to check validity for
     * @returns true if task is valid, false otherwise
     */
    abstract IsValid(creep: Creep): boolean;

    /**
     * Executes the task logic for the given creep
     * @param creep The creep executing the task
     * @returns The current status of task execution
     */
    abstract Execute(creep: Creep): TaskStatus;
}
