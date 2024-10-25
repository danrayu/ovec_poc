import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
const express = require("express");
import { container } from "./core/DependencyInjection/container";
import "./controller";
import { PluginManagerService } from "./core/Plugins/services/PluginManagerService";
import { HookService } from "./core/Plugins/services/HookService";

async function main() {
  // Create the server
  const server = new InversifyExpressServer(container);

  server.setConfig((app) => {
    app.use(express.json());
  });

  const app = server.build();

  // testing of services
  const pluginManager =
    container.get<PluginManagerService>(PluginManagerService);
  const hookService = container.get<HookService>(HookService);
  await pluginManager.registerAllEnabledPluginHooks();

  const { Command } = require("commander");
  const program = new Command();

  program.name("ovec").description("you get no description.").version("1.0.0");

  // Define a command with options
  program
    .command("list")
    .description("Lists all of the OVEC plugins in node_modules.")
    .option("-e, --enabled", "Show only enabled plugins.")
    .option("-i, --installed", "Show only installed plugins.")
    .option("-d, --disabled", "Show only disabled plugins.")
    .option("-u, --uninstalled", "Show only uninstalled plugins.")
    .action(async (options) => {
      // No need for `cmdObj` unless there are arguments
      const installed = await (
        await pluginManager.getAllPluginConfigs()
      ).map((fullConfig) => {
        return {
          name: fullConfig.dataValues.name,
          version: fullConfig.dataValues.version,
          enabled: fullConfig.dataValues.enabled,
        };
      });

      const findUninstalled = () => {
        const all = pluginManager.getInflatedPluginConfigs().map((p) => p.name);
        const installedPNames = installed.map((p) => p.name);
        const uninstalled = all.filter(
          (item) => !installedPNames.includes(item)
        );
        return uninstalled;
      };

      if (options.installed) {
        console.log(installed);
      } else if (options.disabled) {
        console.log(installed.filter((plugin) => !plugin.enabled));
      } else if (options.uninstalled) {
        console.log(findUninstalled());
      } else if (options.enabled) {
        console.log(installed.filter((plugin) => plugin.enabled));
      } else {
        console.log(findUninstalled());
      }
    });

  program
    .command("install <plugin>")
    .description("install a plugin.")
    .action(async (cmdObj) => {
      try {
        const info = pluginManager.inflatePluginConfig(cmdObj);
        await pluginManager.installPlugin(info);
        console.log("Plugin installed.");
      } catch (e) {
        console.log("Couldn't install the plugin: " + e);
      }
    });

  program
    .command("uninstall <plugin>")
    .description("install a plugin.")
    .action(async (cmdObj) => {
      try {
        await pluginManager.uninstallPlugin(cmdObj);
        console.log("Plugin uninstalled.");
      } catch (e) {
        console.log("Couldn't uninstall the plugin: " + e);
      }
    });

  program
    .command("enable <plugin>")
    .description("enable a plugin.")
    .action(async (cmdObj) => {
      try {
        await pluginManager.enablePlugin(cmdObj);
        console.log("Plugin enabled.");
      } catch (e) {
        console.log("Couldn't enable the plugin: " + e);
      }
    });

  program
    .command("disable <plugin>")
    .description("disable a plugin.")
    .action(async (cmdObj) => {
      try {
        await pluginManager.disablePlugin(cmdObj);
        console.log("Plugin disabled.");
      } catch (e) {
        console.log("Couldn't disable the plugin: " + e);
      }
    });

  program
    .command("fire")
    .description("runs all of the enabled plugins.")
    .action(async () => {
      try {
        await hookService.executeHook("init");
        console.log("Hook actions run.");
      } catch (e) {
        console.log("Couldn't run the plugins: " + e);
      }
    });

  // Parse the arguments
  program.parse(process.argv);
}

main()