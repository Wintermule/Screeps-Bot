import { CreepRole } from "Shared/CreepRoles";
import * as bodyStyleConfig from "./BodyStyleConfig.json";

type MovementHandler = (bodyParts: BodyPartConstant[], fillPart: BodyPartConstant, availableEnergy: number) => void;

export class BodyBuilder {
    // Static properties
    private static readonly movementHandlers: Record<string, MovementHandler> = {
        'fastmove': BodyBuilder.addFastMoveParts,
        'default': BodyBuilder.addDefaultMoveParts,
        'slowmove': BodyBuilder.addSlowMoveParts,
        'streetOnly': BodyBuilder.addStreetOnlyMovement
    };

    /**
     * Builds a creep body based on role configuration and available energy.
     * @param role - The role that determines the body composition
     * @param availableEnergy - Amount of energy available for body parts
     * @returns Array of body parts for the creep
     * @throws Error if role config is missing or invalid
     */
    public static buildBody(role: CreepRole, availableEnergy: number): BodyPartConstant[] {
        const roleConfig = bodyStyleConfig[role];
        if (!roleConfig) {
            throw new Error(`No body style configuration found for role: ${role}`);
        }

        const { parts: bodyParts, remainingEnergy } = this.addCoreParts(roleConfig.CoreParts, availableEnergy);

        if (!BODYPART_COST.hasOwnProperty(roleConfig.FillPart)) {
            throw new Error(`Invalid fill part: ${roleConfig.FillPart}`);
        }
        const fillPart = roleConfig.FillPart as BodyPartConstant;

        const handler = this.movementHandlers[roleConfig.MoveType];
        if (!handler) {
            throw new Error(`Unknown movement type: ${roleConfig.MoveType}`);
        }

        handler(bodyParts, fillPart, remainingEnergy);
        return bodyParts;
    }

    /**
     * Adds the core parts required for the creep body
     */
    private static addCoreParts(coreParts: string[], initialEnergy: number): { parts: BodyPartConstant[], remainingEnergy: number } {
        const bodyParts: BodyPartConstant[] = [];
        let availableEnergy = initialEnergy;

        for (const part of coreParts) {
            if (!BODYPART_COST.hasOwnProperty(part)) {
                throw new Error(`Invalid body part: ${part}`);
            }
            const partCost = BODYPART_COST[part as BodyPartConstant];
            if (availableEnergy >= partCost) {
                bodyParts.push(part as BodyPartConstant);
                availableEnergy -= partCost;
            } else {
                throw new Error(`Not enough energy to add core part: ${part}`);
            }
        }

        return { parts: bodyParts, remainingEnergy: availableEnergy };
    }

    // Movement handler methods
    private static addFastMoveParts(bodyParts: BodyPartConstant[], fillPart: BodyPartConstant, availableEnergy: number): void {
        const fillPartCost = BODYPART_COST[fillPart];
        const movePartCost = BODYPART_COST[MOVE];
        const totalCost = fillPartCost + movePartCost;

        while (availableEnergy >= totalCost) {
            bodyParts.push(fillPart);
            bodyParts.push(MOVE);
            availableEnergy -= totalCost;
        }
    }

    private static addDefaultMoveParts(bodyParts: BodyPartConstant[], fillPart: BodyPartConstant, availableEnergy: number): void {
        const fillPartCost = BODYPART_COST[fillPart];
        const movePartCost = BODYPART_COST[MOVE];
        const totalCost = fillPartCost + movePartCost;

        let hasMovePart = bodyParts.includes(MOVE);

        if (!hasMovePart) {
            bodyParts.push(MOVE);
            availableEnergy -= movePartCost;
        }

        while (availableEnergy >= totalCost) {
            if (fillPart !== CARRY) {
                bodyParts.push(fillPart);
                bodyParts.push(MOVE);
                availableEnergy -= totalCost;
            } else {
                bodyParts.push(fillPart);
            }
        }
    }

    private static addSlowMoveParts(bodyParts: BodyPartConstant[], fillPart: BodyPartConstant, availableEnergy: number): void {
        const fillPartCost = BODYPART_COST[fillPart];
        const movePartCost = BODYPART_COST[MOVE];

        let hasMovePart = bodyParts.includes(MOVE);

        if (!hasMovePart) {
            bodyParts.push(MOVE);
            availableEnergy -= movePartCost;
        }

        while (availableEnergy >= fillPartCost) {
            bodyParts.push(fillPart);
            availableEnergy -= fillPartCost;
        }
    }

    private static addStreetOnlyMovement(bodyParts: BodyPartConstant[], fillPart: BodyPartConstant, availableEnergy: number): void {
        const fillPartCost = BODYPART_COST[fillPart];
        const movePartCost = BODYPART_COST[MOVE];
        const totalCost = (2 * fillPartCost) + movePartCost;

        let hasMovePart = bodyParts.includes(MOVE);

        if (!hasMovePart) {
            bodyParts.push(MOVE);
            availableEnergy -= movePartCost;
        }

        let movePartCount = bodyParts.filter(part => part === MOVE).length;
        let fillPartCount = bodyParts.length - movePartCount;

        while (availableEnergy >= totalCost) {
            if (fillPartCount >= 2 * movePartCount) {
                bodyParts.push(MOVE);
                availableEnergy -= movePartCost;
                movePartCount++;
            } else {
                bodyParts.push(fillPart);
                availableEnergy -= fillPartCost;
                fillPartCount++;
            }
        }
    }
}
