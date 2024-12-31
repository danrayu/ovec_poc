import { HookCallback } from "../../Plugins/Types/HookCallback";
import { HookExecutionQueue } from "./HookExecutionQueue";
import ModelMetadata from "./ModelMetadata";

export class Context {
  public hookExecutionQueue: HookExecutionQueue;
  public modelList: Array<ModelMetadata>
  constructor() {
    this.hookExecutionQueue = new HookExecutionQueue();
    this.modelList = new Array();
  }

  public addHookCallback(callback: HookCallback) {
    this.hookExecutionQueue.addHookCallback(callback);
  }

  public addModel(model: ModelMetadata) {
    this.modelList.push(model)
  }
}