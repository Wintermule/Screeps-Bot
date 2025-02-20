import { TaskStatus, TaskType } from "./Enums";

export interface ITask  {
    id: string;
    type: TaskType;
    target: Id<any>;
    status: TaskStatus;
    assignedCreeps:Creep[];
    maxCreeps: number;

    IsValid(creep: Creep): boolean;
    Execute(creep: Creep): TaskStatus;
    AssignCreep(creep: Creep): boolean;
    UnassignCreep(creepName: string): void;
}
