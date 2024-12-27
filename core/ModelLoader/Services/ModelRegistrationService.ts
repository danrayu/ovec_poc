import { inject, injectable } from "inversify";
import { Context } from "../../Context/Types/Context";
import { ContextService } from "../../Context/Services/ContextService";
import { Action } from "../../Plugins/Types/Action";
export type hook = "init" | "finish";
@injectable()
export class ModelRegistrationService {
  private contextService: ContextService;
  constructor(@inject(ContextService) contextService: ContextService) {
    this.contextService = contextService;
  }
  public addAction(hook: hook, action: Action, priority: number) {
    this.contextService.context.addAction(hook, action, priority);
  }
  public async executeHook(hook: hook) {
    const actionPriorities = this.contextService.context.hookActionQueue[hook]
    const sortedKeys = Object.keys(actionPriorities)
      .map(Number)
      .sort((a, b) => a - b);
    for (const key of sortedKeys) {
      const actionList: Array<Action> = actionPriorities[key];
      const callList = [];
      for (const action of actionList) {
        const run = async () => {
          this.contextService.context = await action(this.contextService.context);
        }
        callList.push(run())
      }
      await Promise.all(callList);
    }
  }
}
