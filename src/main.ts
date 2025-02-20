import "reflect-metadata";
import { ErrorMapper } from "utils/ErrorMapper";
import { sharedMessageBus } from "Messaging/SharedMessageBus";
import { CreepDeathMessage } from "Messaging/Messages/CreepDeathMessage";
import { Kernel } from "Kernel/kernel";

/**
 * Main game loop wrapped with error mapping for better debugging
 */
export const loop = ErrorMapper.wrapLoop(() => {

      // Handle creep deaths
      for (const name in Memory.creeps) {
        if (!Game.creeps[name]) {
            // Creep has died, publish a CreepDeathMessage
            const originRoomName = Memory.creeps[name].originRoom;
            sharedMessageBus.publish(new CreepDeathMessage(name, originRoomName));
            delete Memory.creeps[name];
        }
    }

    let kernel = new Kernel();
    kernel.run();
});
