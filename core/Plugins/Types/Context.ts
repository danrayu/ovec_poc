import { hook } from "../services/HookService";
import { Action } from "./Action";
import { ActionExecutionQueue } from "./ActionExecutionQueue";

export class Context {
  public hookActionQueue: ActionExecutionQueue;
  constructor() {
    this.hookActionQueue = new ActionExecutionQueue();
  }

  public addAction(hook: hook, action: Action, priority: number) {
    this.hookActionQueue.addAction(hook, priority, action);
  }
}