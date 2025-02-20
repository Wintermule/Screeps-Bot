import { ITask } from "./ITask";
import { TaskStatus } from "./Enums";
import { TaskConfig } from "../TaskConfig";

export class TaskManager {
    private tasks: Map<string, ITask> = new Map();
    roomName: string;
    colonyId: string;


    constructor(roomName: string, colonyId: string) {
        this.roomName = roomName;
        this.colonyId = colonyId;
        if (!Game.rooms[roomName].memory.tasks) {
            Game.rooms[roomName].memory.tasks = [];
        }
        Game.rooms[roomName].memory.tasks.map((task: ITask) => {
            this.addTask(task);
        });
    }

    /**
     * Checks if a task with the given ID exists
     * @param taskId The ID of the task to check
     * @returns true if task exists, false otherwise
     */
    public hasTask(taskId: string) {
        return this.tasks.has(taskId);
    }

    /**
     * Adds a new task to the manager
     * @param task The task to add
     */
    public addTask(task: ITask): void {
        this.tasks.set(task.id, task);
    }

    /**
     * Removes a task from the manager
     * @param taskId The ID of the task to remove
     */
    public removeTask(taskId: string): void {
        this.tasks.delete(taskId);
    }

    /**
     * Assigns tasks to one or multiple creeps
     * @param creepOrCreeps Single creep or array of creeps to assign tasks to
     * @returns true if all creeps were assigned tasks successfully, false otherwise
     */
    public assingTask(creep: Creep): boolean;
    public assingTask(creeps: Creep[]): boolean;
    public assingTask(creepOrCreeps: Creep | Creep[]): boolean {
        if (Array.isArray(creepOrCreeps)) {
            return creepOrCreeps.every(creep => this.assingTask(creep));
        } else {
            const creep = creepOrCreeps;

            if (creep.memory.taskId && this.tasks.has(creep.memory.taskId)) {
                const assignedTask = this.tasks.get(creep.memory.taskId);
                if (assignedTask) {
                    if (assignedTask.IsValid(creep)) {
                        return true;
                    } else {
                        assignedTask.UnassignCreep(creep.name);
                    }
                }
            }

            const taskConfig = TaskConfig[creep.memory.role as keyof typeof TaskConfig];
            if (!taskConfig) {
                console.log(`No task configuration found for role: ${creep.memory.role}`);
                return false;
            }

            const availableTasks = Array.from(this.tasks.values())
                .filter(task =>
                    (task.status === TaskStatus.NOT_STARTED || task.status === TaskStatus.IN_PROGRESS) &&
                    taskConfig.allowedTasks.includes(task.type) &&
                    task.IsValid(creep)
                );

            while (availableTasks.length > 0) {
                const task = availableTasks.shift();
                if (task && task.AssignCreep(creep)) {
                    task.status = TaskStatus.IN_PROGRESS;
                    creep.memory.taskId = task.id;
                    return true;
                }
            }

            return false;
        }
    }

    /**
     * Unassigns a creep from its current task
     * @param creep The creep to unassign
     */
    public UnassignCreep(creep:Creep): void {
        if (creep.memory.taskId && this.tasks.has(creep.memory.taskId)) {
            const task = this.tasks.get(creep.memory.taskId);
            if (task) {
                task.UnassignCreep(creep.name);
            }
        }
    }

    /**
     * Executes all active tasks in the manager
     */
    public run(): void {
        for (const task of this.tasks.values()) {
            if (task.status === TaskStatus.IN_PROGRESS) {
                for (const creep of task.assignedCreeps) {
                    task.Execute(creep);
                }
            }
        }
    }
}
