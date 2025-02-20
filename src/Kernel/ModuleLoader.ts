import { IModule } from "./IModule";
import * as moduleConfig from "./moduleConfig.json";

// Import modules statically
import { CreepSpawnModule } from "Modules/CreepSpawnModule/CreepSpawnModule";
import { SpawnManagerModule } from "Modules/SpawnManagerModule/SpawnManagerModule";
import { TaskCreatorModule } from "Modules/TaskCreatorModule/TaskCreatorModule";
import { TaskExecuterModule } from "Modules/TaskExecuterModule/TaskExecuterModule";

// Map of module constructors
const moduleConstructors: { [name: string]: new () => IModule } = {
    "CreepSpawnModule": CreepSpawnModule,
    "SpawnManagerModule": SpawnManagerModule,
    "TaskCreatorModule": TaskCreatorModule,
    "TaskExecuterModule": TaskExecuterModule
};

export class ModuleLoader {
    private modules: { [name: string]: IModule } = {};
    moduleConfig: { [name: string]: { priority: number } } = moduleConfig.modules;

    /**
     * Loads and initializes all modules defined in the module configuration
     * @returns Array of initialized IModule instances sorted by priority
     * @throws Error if a module constructor is missing
     */
    public loadModules(): IModule[] {
        Object.keys(this.moduleConfig).forEach((moduleName) => {
            const moduleConstructor = moduleConstructors[moduleName];
            if (!moduleConstructor) {
                throw new Error(`Module constructor for ${moduleName} is missing.`);
            }

            const module = new moduleConstructor();

            // Set the module priority from the configuration
            module.priority = this.moduleConfig[moduleName].priority;
            this.modules[moduleName] = module;
        });

        return Object.values(this.modules);
    }
}
