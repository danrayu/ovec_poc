import { Hook } from "../../Plugins/Types/Hook";
import { HookCallback } from "../../Plugins/Types/HookCallback";

type PriorityRecord = Record<number, Array<HookCallback>>

export class HookExecutionQueue {
  public hookQueues: Record<Hook, PriorityRecord>;
  public init: PriorityRecord;
  public finish: PriorityRecord;
  constructor() {
    this.init = {}
    this.finish = {}
  }

  public addHookCallback(callback: HookCallback) {
    const hook = callback.hook;
    const priority = callback.hookPriority
    if (!this[hook][priority]) {
      this[hook][priority] = []
    }
    this[hook][priority].push(callback)
  }
}

