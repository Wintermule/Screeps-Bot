import 'reflect-metadata';
import { IHandle } from "Messaging/Core/IHandle";
import { sharedMessageBus } from "Messaging/SharedMessageBus";
import { IMessage } from 'Messaging/Core/IMessage';

/**
 * Decorator to automatically subscribe a class to message types based on the interfaces it implements.
 */
export function SubscribeMessages() {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                const instance = this as unknown as IHandle<IMessage>;
                const prototype = Object.getPrototypeOf(Object.getPrototypeOf(instance));
                const interfaces = Object.getOwnPropertyNames(prototype).filter(prop => typeof prototype[prop] === 'function');

                if (interfaces.includes('handle')) {
                    sharedMessageBus.subscribe(instance);
                }

                console.log(interfaces);
            };
        };
    }
}
