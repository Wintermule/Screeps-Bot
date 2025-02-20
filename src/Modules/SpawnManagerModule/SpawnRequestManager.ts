import { ISpawnRequest } from "./ISpawnRequest";

export class SpawnRequestManager {
    private room: Room;
    private spawnQueue: ISpawnRequest[] = [];

    constructor(room: Room) {
        this.room = room;
        if (room.memory.spawnQueue) {
            this.spawnQueue = room.memory.spawnQueue;
        }
    }

    /**
     * Retrieves and removes the next spawn request from the queue
     * @returns The next spawn request or undefined if queue is empty
     */
    public getNextSpawnRequest(): ISpawnRequest | undefined {
        let nextSpawnRequest = this.spawnQueue.shift(); // Get and remove the highest priority request
        this.saveSpawnQueue();
        return nextSpawnRequest;
    }

    /**
     * Adds a new spawn request to the queue and sorts by priority
     * @param spawnRequest - The spawn request to add
     */
    public enqueueSpawnRequest(spawnRequest: ISpawnRequest): void {
        this.spawnQueue.push(spawnRequest);
        this.sortSpawnQueue();
        this.saveSpawnQueue();
    }

    private sortSpawnQueue(): void {
        this.spawnQueue.sort((a, b) => b.priority - a.priority); // Sort by priority (highest first)
    }

    private saveSpawnQueue(): void {
        this.room.memory.spawnQueue = this.spawnQueue;
    }
}
