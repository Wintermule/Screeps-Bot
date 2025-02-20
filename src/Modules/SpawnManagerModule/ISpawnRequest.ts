import { CreepRole } from "Shared/CreepRoles";

export interface ISpawnRequest{
    role: CreepRole;
    priority: number;
    memory: CreepMemory; // Add any additional memory you want to pass to the creep
}
