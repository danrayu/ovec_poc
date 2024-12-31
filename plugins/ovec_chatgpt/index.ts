import { Context } from "../../core/Context/Types/Context";
import { HookCallback } from "../../core/Plugins/Types/HookCallback";
import { PluginExport } from "../../core/Plugins/Types/PluginExport";

const message = async (context: Context) => {
    console.log("hello from ovec-chatgpt")
    return context;
}

var messageCallback: HookCallback = {
    callback: message,
    hook: "init",
    hookPriority: 100
}

var result: PluginExport = {
   hookCallbacks: [messageCallback],
   moduleCallbacks: {} 
}

module.exports = result