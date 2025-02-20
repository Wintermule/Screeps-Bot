import { IModule } from "./IModule";

/**
 * Base class for all modules providing common functionality
 */
export abstract class ModuleBase implements IModule {
    /**
     * Module execution priority. Lower numbers run first
     */
    public priority: number | undefined;

    /**
     * Executes the module's main logic
     */
    public abstract Run(): void;
}
