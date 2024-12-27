import { hook } from "../../Plugins/services/HookService";
import { Action } from "../../Plugins/Types/Action";
import { ActionExecutionQueue } from "./ActionExecutionQueue";
import ModelMetadata from "./ModelMetadata";

export class Context {
  public hookActionQueue: ActionExecutionQueue;
  public modelList: Array<ModelMetadata>
  constructor() {
    this.hookActionQueue = new ActionExecutionQueue();
    this.modelList = new Array();
  }

  public addAction(hook: hook, action: Action, priority: number) {
    this.hookActionQueue.addAction(hook, priority, action);
  }

  public addModel(model: ModelMetadata) {
    this.modelList.push(model)
  }
}