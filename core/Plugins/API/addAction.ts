import { container } from "../../DependencyInjection/container"
import { hook, HookService } from "../services/HookService"
import { Action } from "../Types/Action";
import { Context } from "../Types/Context";

export const add_action = (context: Context, hook: hook, action: Action, priority: number = 100) => {
  const hookService = container.get<HookService>(HookService);
  hookService.addAction(hook, action, priority, context);
}