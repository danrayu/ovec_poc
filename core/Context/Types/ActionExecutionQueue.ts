import { hook } from "../../Plugins/services/HookService";
import { Action } from "../../Plugins/Types/Action";

type PriorityRecord = Record<number, Array<Action>>

export class ActionExecutionQueue {
  public init: PriorityRecord;
  public finish: PriorityRecord;
  constructor() {
    this.init = {}
    this.finish = {}
  }

  public addAction(hook: hook, priority: number, action: Action) {
    if (!this[hook][priority]) {
      this[hook][priority] = []
    }
    this[hook][priority].push(action)
  }
}

