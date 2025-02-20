import { CreepRole } from "Shared/CreepRoles";
import { TaskType } from "./Core/Enums";

const TaskGroups = {
    energyGathering: [TaskType.PickupEnergy, TaskType.WithdrawEnergy],
    construction: [TaskType.Build, TaskType.Repair, TaskType.Upgrade]
} as const;

export interface ITaskConfig{
    allowedTasks: TaskType[];
}

export const TaskConfig: { [role in CreepRole]: ITaskConfig } = {
    [CreepRole.Harvester]: {
        allowedTasks: [TaskType.UnendingHarvest]
    },
    [CreepRole.Hauler]: {
        allowedTasks: [...TaskGroups.energyGathering, TaskType.TransferEnergy]
    },
    [CreepRole.Worker]: {
        allowedTasks: [...TaskGroups.energyGathering, ...TaskGroups.construction]
    },
    [CreepRole.Energy_Distributor]: {
        allowedTasks:  [TaskType.WithdrawEnergy, TaskType.DistributeEnergy]
    },
    [CreepRole.Upgrader]: {
        allowedTasks: [...TaskGroups.energyGathering, TaskType.Upgrade]
    }
};
