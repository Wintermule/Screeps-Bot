import { TaskType } from "Tasks/Core/Enums";

export class IdGenerator{
    /**
     * Generates a unique task ID based on the task type and target
     * @param taskType - The type of task
     * @param target - The target object ID or string
     * @returns A unique string identifier for the task
     * @throws Error if target type is invalid
     */
    public static GetTaskID(taskType: TaskType, target: string): string;
    public static GetTaskID(taskType: TaskType, target: Id<any>): string;
    public static GetTaskID(taskType: TaskType, target: Id<any> | string): string{
        if (typeof target === "string") {
            return `${taskType}_${target}`;
        }

        if ('id' in target) {
            return `${taskType}_${(target as Id<any>)}`;
        }

        throw new Error("Invalid target type");
    }

    /**
     * Generates a unique colony ID for a given room
     * @param roomName - The name of the room
     * @returns A unique string identifier for the colony
     */
    public static GetColonyID(roomName: string): string{
        return `Colony_${roomName}`;
    }
}
