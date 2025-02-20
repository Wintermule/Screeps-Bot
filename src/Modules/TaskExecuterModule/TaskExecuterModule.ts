import { EmpireRepository } from "EmpireRepository";
import { ModuleBase } from "Kernel/ModuleBase";

export class TaskExecuterModule extends ModuleBase {
    public priority: number | undefined = 2;
    private EmpireRepository: EmpireRepository;

    constructor() {
        super();
        this.EmpireRepository = EmpireRepository.GetInstance();
    }

    /**
     * Runs task execution for all colonies, assigning and executing tasks for each colony's creeps
     */
    public Run(): void {
        for (let colony of Object.values(this.EmpireRepository.colonies)) {
            let taskManager = colony.TaskManager;
            taskManager.assingTask(colony.creeps);
            taskManager.run();
        }
    }
}
