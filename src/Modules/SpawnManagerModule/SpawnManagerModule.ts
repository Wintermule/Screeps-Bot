import { ModuleBase } from "Kernel/ModuleBase";
import { SpawnManager } from "./SpawnManager";
import { EmpireRepository } from "EmpireRepository";

export class SpawnManagerModule extends ModuleBase {
    private empireRepository: EmpireRepository;
    public priority: number | undefined = 1;

    constructor() {
        super();
        this.empireRepository = EmpireRepository.GetInstance();
        this.priority = 0;
    }

    /**
     * Executes spawn management logic for all colonies in the empire.
     * Creates a new SpawnManager instance for each colony and runs it.
     */
    public Run(): void {
        for (let colony of Object.values(this.empireRepository.colonies)) {
            const spawnManager = new SpawnManager(colony);
            spawnManager.Run();
        }
    }

}
