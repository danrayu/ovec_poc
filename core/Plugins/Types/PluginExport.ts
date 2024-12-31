import { HookCallback } from "./HookCallback"
import { IModule } from "./IModule"

export class PluginExport {
    hookCallbacks: Array<HookCallback>;
    moduleCallbacks: Record<string, IModule>;
}