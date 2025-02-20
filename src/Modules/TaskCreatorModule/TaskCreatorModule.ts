import { EmpireRepository } from "EmpireRepository";
import { TaskCreator } from "./TaskCreator";
import { ModuleBase } from "Kernel/ModuleBase";

export class TaskCreatorModule extends ModuleBase {
    public priority: number | undefined = 1;
    private empireRepository: EmpireRepository;

    constructor() {
        super();
        this.empireRepository = EmpireRepository.GetInstance();
    }

    /**
     * Creates and runs task creation for all colonies
     */
    public Run(): void {
        for(let colony of Object.values(this.empireRepository.colonies)){
            const taskCreator = new TaskCreator(colony);
            taskCreator.run();
       }
    }
}
