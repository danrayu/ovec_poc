import { inject, injectable } from "inversify";
import { ContextService } from "../../Context/Services/ContextService";
import { Hook } from "../Types/Hook";
import { HookCallback } from "../Types/HookCallback";

@injectable()
export class HookService {
  private contextService: ContextService;
  constructor(@inject(ContextService) contextService: ContextService) {
    this.contextService = contextService;
  }

  public addHookCallback(callback: HookCallback) {
    this.contextService.context.addHookCallback(callback);
  }

  public async executeHook(hook: Hook) {
    const executionPriorities = this.contextService.context.hookExecutionQueue[hook]

    const sortedKeys = Object.keys(executionPriorities)
      .map(Number)
      .sort((a, b) => a - b);
    for (const key of sortedKeys) {
      const callbackList: Array<HookCallback> = executionPriorities[key];
      const callList = [];
      
      for (const hookCallback of callbackList) {
        const run = async () => {
          this.contextService.context = await hookCallback.callback(this.contextService.context);
        }
        callList.push(run())
      }
      await Promise.all(callList);
    }
  }
}

