import { Colony } from "Colony";

export class EmpireRepository {
    private static instance: EmpireRepository;

    // Properties to store the data
    public spawns: StructureSpawn[] = [];
    public rooms: Room[] = [];
    public outposts: Room[] = [];
    public spawnsByRoom: { [roomName: string]: StructureSpawn[] } = {};
    public colonies: { [roomName: string]: Colony } = {};

    private constructor() {
        this.UpdateData();
    }

    /**
     * Gets the singleton instance of the EmpireRepository
     * @returns The singleton instance
     */
    public static GetInstance(): EmpireRepository {
        if (!EmpireRepository.instance) {
            EmpireRepository.instance = new EmpireRepository();
        }
        return EmpireRepository.instance;
    }

    /**
     * Updates the empire data including spawns, rooms, outposts, and colonies
     */
    public UpdateData(): void {
        const spawns = _.filter(Game.spawns, (spawn) => spawn.my);
        const rooms = _.filter(Game.rooms, (room) => room.controller && room.controller.my);
        const outposts = _.filter(Game.rooms, (room) => !room.controller || !room.controller.my);

        const spawnsByRoom = _.groupBy(spawns, (spawn) => spawn.room.name);

        // Store the data in the instance for other modules to access
        this.spawns = spawns;
        this.rooms = rooms;
        this.outposts = outposts;
        this.spawnsByRoom = spawnsByRoom;

        // Create a colony for each room
        this.colonies = {};
        for (const room of rooms) {
            this.colonies[room.name] = new Colony(room);
        }
    }
}
