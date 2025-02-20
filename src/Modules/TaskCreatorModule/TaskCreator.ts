import { Colony } from "Colony";
import { IdGenerator } from "utils/IdGenerator";
import { BuildTask } from "Tasks/Construction/BuildTask";
import { RepairTask } from "Tasks/Construction/RepairTask";
import { UpgradeTask } from "Tasks/Construction/UpgradeTask";
import { TaskType } from "Tasks/Core/Enums";
import { ITask } from "Tasks/Core/ITask";
import { DistributeEnergyTask } from "Tasks/Logistics/Energy/DistributeEnergyTask";
import { PikckupEnergyTask } from "Tasks/Logistics/Energy/PikckupEnergyTask";
import { TransferEnergyTask } from "Tasks/Logistics/Energy/TransferEnergyTask";
import { WithdrawEnergyTask } from "Tasks/Logistics/Energy/WithdrawEnergyTask";
import { HarvestTask } from "Tasks/Resource/HarvestTask";
import { UnendingHarvestTask } from "Tasks/Resource/UnendingHarvestTask";
import { TaskManager } from "Tasks/Core/TaskManager";

export class TaskCreator {
    private colony: Colony;
    private taskManager: TaskManager;

    constructor(colony: Colony) {
        this.colony = colony;
        this.taskManager = colony.TaskManager;
    }

    /**
     * Creates all necessary tasks for the colony
     */
    public run(): void {
        this.createHarvestTasks(this.colony);
        this.createBuildTasks(this.colony);
        this.createRepairTasks(this.colony);
        this.createUpgradeControllerTask(this.colony);
        this.createEnergyDistributionTasks(this.colony);
        this.createEnergyWithdrawTasks(this.colony);
        this.createEnergyTransferTasks(this.colony);
        this.createEnergyPickupTasks(this.colony);
    }

    private createHarvestTasks(colony: Colony): void {
        const sources = colony.room.find(FIND_SOURCES);
        sources.forEach((source) => {
            const dynamicHarvestTaskId = IdGenerator.GetTaskID(TaskType.Harvest, source.id);
            if (!this.taskManager.hasTask(dynamicHarvestTaskId)) {
                const harvestTask: ITask = new HarvestTask(source);
                this.taskManager.addTask(harvestTask);
            }
            const staticHarvestTaskId = IdGenerator.GetTaskID(TaskType.UnendingHarvest, source.id);
            if (!this.taskManager.hasTask(staticHarvestTaskId)) {
                const harvestTask: ITask = new UnendingHarvestTask(source);
                this.taskManager.addTask(harvestTask);
            }
        });
    }

    private createBuildTasks(colony: Colony): void {
        const constructionSites = colony.room.find(FIND_CONSTRUCTION_SITES);
        constructionSites.forEach((site) => {
            const taskId = IdGenerator.GetTaskID(TaskType.Build, site.id);
            if (!this.taskManager.hasTask(taskId)) {
                const buildTask: ITask = new BuildTask(site);
                this.taskManager.addTask(buildTask);
            }
        });
    }

    private createRepairTasks(colony: Colony): void {
        const damagedStructures = colony.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax;
            }
        });
        damagedStructures.forEach((structure) => {
            const taskId = IdGenerator.GetTaskID(TaskType.Repair, structure.id);
            if (!this.taskManager.hasTask(taskId)) {
                const repairTask: ITask = new RepairTask(structure);
                this.taskManager.addTask(repairTask);
            }
        });
    }

    private createUpgradeControllerTask(colony: Colony): void {
        const controller = colony.room.controller;
        if (controller) {
            const taskId = IdGenerator.GetTaskID(TaskType.Upgrade, controller.id);
            if (!this.taskManager.hasTask(taskId)) {
                const upgradeTask: ITask = new UpgradeTask(controller);
                this.taskManager.addTask(upgradeTask);
            }
        }
    }

    private createEnergyDistributionTasks(colony: Colony): void {
        const spawns = colony.room.find(FIND_MY_SPAWNS);
        spawns.forEach((spawn) => {
            const spawnTaskId = IdGenerator.GetTaskID(TaskType.TransferEnergy, spawn.id);
            if (!this.taskManager.hasTask(spawnTaskId)) {
                const transferTask: ITask = new DistributeEnergyTask(spawn);
                this.taskManager.addTask(transferTask);
            }

            const extensions = spawn.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_EXTENSION;
                }
            }) as StructureExtension[];

            extensions.forEach((extension) => {
                const taskId = IdGenerator.GetTaskID(TaskType.TransferEnergy, extension.id);
                if (!this.taskManager.hasTask(taskId)) {
                    const transferTask: ITask = new DistributeEnergyTask(extension);
                    this.taskManager.addTask(transferTask);
                }
            });
        });
    }

    private createEnergyWithdrawTasks(colony: Colony): void {
        //create task for storage
        const storage = colony.room.storage;
        if (storage) {
            const storageTaskId = IdGenerator.GetTaskID(TaskType.WithdrawEnergy, storage.id);
            if (!this.taskManager.hasTask(storageTaskId)) {
                const withdrawTask: ITask = new WithdrawEnergyTask(storage);
                this.taskManager.addTask(withdrawTask);
            }
        }

        //create tasks for containers
        const containers = colony.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER;
            }
        }) as StructureContainer[];

        containers.forEach((container) => {
            const taskId = IdGenerator.GetTaskID(TaskType.WithdrawEnergy, container.id);
            if (!this.taskManager.hasTask(taskId)) {
                const withdrawTask: ITask = new WithdrawEnergyTask(container);
                this.taskManager.addTask(withdrawTask);
            }
        });
    }

    private createEnergyTransferTasks(colony: Colony): void {
        const storage = colony.room.storage;
        if (storage) {
            const storageTaskId = IdGenerator.GetTaskID(TaskType.TransferEnergy, storage.id);
            if (!this.taskManager.hasTask(storageTaskId)) {
                const withdrawTask: ITask = new TransferEnergyTask(storage);
                this.taskManager.addTask(withdrawTask);
            }
        }

        //create tasks for containers
        const containers = colony.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_CONTAINER;
            }
        }) as StructureContainer[];

        containers.forEach((container) => {
            const taskId = IdGenerator.GetTaskID(TaskType.WithdrawEnergy, container.id);
            if (!this.taskManager.hasTask(taskId)) {
                const withdrawTask: ITask = new WithdrawEnergyTask(container);
                this.taskManager.addTask(withdrawTask);
            }
        });
    }

    private createEnergyPickupTasks(colony: Colony): void {
        const droppedResources = colony.room.find(FIND_DROPPED_RESOURCES);
        droppedResources.forEach((resource) => {
            const taskId = IdGenerator.GetTaskID(TaskType.PickupEnergy, resource.id);
            if (!this.taskManager.hasTask(taskId)) {
                const pickupTask: ITask = new PikckupEnergyTask(resource);
                this.taskManager.addTask(pickupTask);
            }
        });
    }
}
