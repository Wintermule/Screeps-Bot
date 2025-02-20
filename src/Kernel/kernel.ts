import { ModuleLoader } from "./ModuleLoader";

export class Kernel {
    moduleLoader: ModuleLoader = new ModuleLoader();
    moduleIndex: number;

    /**
     * Initializes a new Kernel instance and sets up module indexing
     */
    constructor() {
        if(Memory.moduleIndex === undefined) {
            Memory.moduleIndex = 0;
        }
        this.moduleIndex = Memory.moduleIndex;
    }

    /**
     * Executes all modules in priority order, handling any errors that occur
     * Updates the module index for the next tick
     */
    public run(): void {
        const modules = this.moduleLoader.loadModules();

        // Sort modules by priority
        const sortedModules = Array.from(modules.values()).sort((a, b) => {
            if (a.priority === undefined || b.priority === undefined) {
                throw new Error('Module priority is undefined');
            }
            return a.priority - b.priority;
        });

        for (let i = this.moduleIndex; i < sortedModules.length; i++) {
            try {
                sortedModules[i].Run();

            } catch (error) {
                console.log(`Failed to run module ${sortedModules[i].constructor.name}:`, error);
            }
        }

        if(Memory.moduleIndex >= modules.length) {
            Memory.moduleIndex = 0;
            this.moduleIndex = 0;
        }

    }
}
