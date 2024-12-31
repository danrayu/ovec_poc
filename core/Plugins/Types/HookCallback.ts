import { Context } from "../../Context/Types/Context";
import { Hook } from "./Hook";

export class HookCallback {
    callback: (context: Context) => Promise<Context>;
    hook: Hook;
    hookPriority: number;
}