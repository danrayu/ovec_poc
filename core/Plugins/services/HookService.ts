import { injectable } from "inversify";
import { Context } from "../Types/Context";
import { Action } from "../Types/Action";

export type hook = "init" | "finish";

@injectable()
export class HookService {
  public addAction(hook: hook, action: Action, priority: number, context: Context) {
    context.addAction(hook, action, priority);
  }

  public async executeHook(hook: hook, context: Context) {
    const actionPriorities = context.hookActionQueue[hook]

    const sortedKeys = Object.keys(actionPriorities)
      .map(Number)
      .sort((a, b) => a - b);
    console.log(hook)
    for (const key of sortedKeys) {
      const actionList: Array<Action> = actionPriorities[key];
      const callList = [];
      
      for (const action of actionList) {
        const run = async () => {
          context = await action(context);
        }
        callList.push(run())
      }
      await Promise.all(callList);
    }
  }
}

