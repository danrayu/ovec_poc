import { inject, injectable } from "inversify";
import { Context } from "../../Context/Types/Context";
import { ContextService } from "../../Context/Services/ContextService";
import { HookCallback } from "../../Plugins/Types/HookCallback";
export type hook = "init" | "finish";
@injectable()
export class ModelRegistrationService {
  private contextService: ContextService;
  constructor(@inject(ContextService) contextService: ContextService) {
    this.contextService = contextService;
  }
  public addAction(callback: HookCallback) {
    this.contextService.context.addHookCallback(callback);
  }
  public async executeHook(hook: hook) {
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
