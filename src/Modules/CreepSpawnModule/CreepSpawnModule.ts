import { ModuleBase } from "Kernel/ModuleBase";
import { EmpireRepository } from "EmpireRepository";
import { CreepSpawnManager } from "./CreepSpawnManager";

export class CreepSpawnModule extends ModuleBase {
    private EmpireRepository: EmpireRepository;

    constructor() {
        super();
        this.EmpireRepository = EmpireRepository.GetInstance();
        this.priority = 0; // Initialize priority
    }

    /**
     * Manages creep spawning for all colonies
     */
    public Run(): void {
        const colonies = Object.values(this.EmpireRepository.colonies);
        colonies.forEach(colony => {
            let creepSpawnManager = new CreepSpawnManager(colony);
            creepSpawnManager.run();
        });
    }
}
