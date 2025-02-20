export enum TaskStatus {
    NOT_STARTED = 'Not_Started',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETE = 'Complete',
    FAILED = 'Failed'
}

export enum TaskType {
    Harvest = 'Harvest',
    UnendingHarvest = 'UnendingHarvest',
    DistributeEnergy = 'DistributeEnergy',
    PickupEnergy = 'PikckupEnergy',
    TransferEnergy = 'TransferEnergy',
    WithdrawEnergy = 'WithdrawEnergy',
    Build = 'Build',
    Repair = 'Repair',
    Upgrade = 'Upgrade',
    Idle = 'Idle'
}
