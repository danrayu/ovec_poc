import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
const express = require("express");
import { container } from "./core/DependencyInjection/container";
import "./controller"; // Import the controller to make sure it's registered
import sequelize from "./core/DataAccess/database";
import { PluginManagerService } from "./core/Plugins/services/PluginManagerService";
import { HookService } from "./core/Plugins/services/HookService";
import { add_action } from "./core/Plugins/API/addAction";
import { Action } from "./core/Plugins/Types/Action";
import { Context } from "./core/Plugins/Types/Context";

// Create the server
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
});

const app = server.build();

const pluginManager = container.get<PluginManagerService>(PluginManagerService);
const hookService = container.get<HookService>(HookService);

const context = new Context();

// console.log(`context: ${context.hookActionQueue}`)
// add_action(context, "init", na, 50);
// console.log(`context: ${context.hookActionQueue}`)
// add_action(context, "init", na2, 100);
// console.log(`context: ${context.hookActionQueue}`)

const a = async () => {
  console.log(await pluginManager.getAllPluginConfigs())
}
a()

pluginManager.registerEnabledPluginHook("ovec-google-tts", context);
hookService.executeHook("init", context);

// sequelize
//   .sync()
//   .then(() => {
//     console.log("Database synchronized");
//   })
//   .catch((error) => {
//     console.error("Error syncing the database:", error);
//   });
