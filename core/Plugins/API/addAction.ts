import { container } from "../../DependencyInjection/container"
import { hook, HookService } from "../services/HookService"
import { Action } from "../Types/Action";

export const add_action = (hook: hook, action: Action, priority: number = 100) => {
  const hookService = container.get<HookService>(HookService);
  hookService.addAction(hook, action, priority);
}