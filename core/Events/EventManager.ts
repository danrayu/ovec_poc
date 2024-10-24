// import { injectable } from 'inversify';
// import { Action } from '../Plugins/Types/Action';

// @injectable()
// export class EventManager {
//   private listeners: { [event: string]: Array<Action> } = {};



//   // Register an event listener
//   public on(event: string, listener: (data?: any) => void): void {
//     if (!this.listeners[event]) {
//       this.listeners[event] = [];
//     }
//     this.listeners[event].push(listener);
//   }

//   // Emit an event
//   public emit(event: string, data?: any): void {
//     const eventListeners = this.listeners[event];
//     if (eventListeners) {
//       eventListeners.forEach(listener => listener(data));
//     }
//   }

//   // Remove an event listener
//   public off(event: string, listener: (data?: any) => void): void {
//     if (!this.listeners[event]) return;

//     this.listeners[event] = this.listeners[event].filter(
//       registeredListener => registeredListener !== listener
//     );
//   }
// }
