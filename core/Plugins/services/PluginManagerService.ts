import { injectable } from "inversify";
import PluginModel from "../Models/PluginModel";
import PluginInfo from "../Types/PluginInfo";
import { readFileSync } from "fs";
import { add_action } from "../API/addAction";
const path = require("path");
const fs = require("fs");

@injectable()
export class PluginManagerService {

  // Find installed plugins from package.json
  public findInstalledPlugins(): Array<string> {
    const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
    const installedPlugins = Object.keys(packageJson.dependencies).filter(
      (dep) => dep.startsWith("ovec-")
    );

    this.inflatePluginConfig(installedPlugins[0]);

    return installedPlugins;
  }

  // Get detailed plugin configs from installed plugins
  public getInflatedPluginConfigs(): Array<PluginInfo> {
    const pluginConfigs: Array<PluginInfo> = [];
    const installedPlugins = this.findInstalledPlugins();
    for (const installedPlugin of installedPlugins) {
      try {
        pluginConfigs.push(this.inflatePluginConfig(installedPlugin));
      } catch (e) {
        console.log(`Couldn't inflate config for ${installedPlugin}: ${e}`);
      }
    }
    return pluginConfigs;
  }

  // Inflate a plugin config based on its package.json
  public inflatePluginConfig(plugin_name: string): PluginInfo {
    const configPath = path.resolve(`./node_modules/${plugin_name}/package.json`);
    if (!fs.existsSync(configPath)) {
      throw new Error(
        `File not found error: ${plugin_name} is in package.json, but is missing in node_modules.`
      );
    }

    const configJson = JSON.parse(readFileSync(configPath, "utf8"));

    const { name, version, description, author } = configJson;

    return new PluginInfo(name, undefined, version, undefined, description, author);
  }

  // PERSISTENCE PART (CRUD OPERATIONS)

  // CREATE a new PluginConfig
  public async createPluginConfig(pluginConfigData: any): Promise<any> {
    try {
      const newPluginConfig = await PluginModel.create(pluginConfigData);
      return newPluginConfig;
    } catch (error) {
      console.error('Error creating PluginConfig:', error);
      throw error;
    }
  }

  // READ a PluginConfig by ID
  public async getPluginConfigById(id: string): Promise<any> {
    try {
      const pluginConfig = await PluginModel.findByPk(id);
      if (!pluginConfig) {
        throw new Error('PluginConfig not found');
      }
      return pluginConfig;
    } catch (error) {
      console.error('Error fetching PluginConfig by ID:', error);
      throw error;
    }
  }

  // READ all PluginConfigs
  public async getAllPluginConfigs(): Promise<any[]> {
    try {
      const pluginConfigs = await PluginModel.findAll();
      return pluginConfigs;
    } catch (error) {
      console.error('Error fetching all PluginConfigs:', error);
      throw error;
    }
  }

  // UPDATE a PluginConfig by ID
  public async updatePluginConfig(id: string, updatedData: any): Promise<any> {
    try {
      const pluginConfig = await PluginModel.findByPk(id);
      if (!pluginConfig) {
        throw new Error('PluginConfig not found');
      }
      await pluginConfig.update(updatedData);
      return pluginConfig;
    } catch (error) {
      console.error('Error updating PluginConfig:', error);
      throw error;
    }
  }

  // DELETE a PluginConfig by ID
  public async deletePluginConfig(id: string): Promise<any> {
    try {
      const pluginConfig = await PluginModel.findByPk(id);
      if (!pluginConfig) {
        throw new Error('PluginConfig not found');
      }
      await pluginConfig.destroy();
      return { message: 'PluginConfig deleted successfully' };
    } catch (error) {
      console.error('Error deleting PluginConfig:', error);
      throw error;
    }
  }

  // PLUGIN MANAGEMENT PART

  // Check if a plugin config exists in the database by name
  public async isPluginInstalled(pluginName: string): Promise<boolean> {
    try {
      const pluginConfig = await PluginModel.findOne({
        where: { name: pluginName },
      });
      return !!pluginConfig;
    } catch (error) {
      console.error(`Error checking if plugin is installed: ${error}`);
      return false;
    }
  }

  // Enable a plugin by updating the 'enabled' field to true in the database
  public async enablePlugin(pluginName: string): Promise<void> {
    await this.changePluginEnabled(pluginName, true);
  }

  // Disable a plugin by updating the 'enabled' field to false in the database
  public async disablePlugin(pluginName: string): Promise<void> {
    await this.changePluginEnabled(pluginName, false);
  }

  // Change the 'enabled' state of a plugin
  private async changePluginEnabled(pluginName: string, enabled: boolean): Promise<void> {
    try {
      const pluginConfig = await PluginModel.findOne({
        where: { name: pluginName },
      });
      if (!pluginConfig) {
        throw new Error(`Plugin ${pluginName} not found in the database.`);
      }

      await pluginConfig.update({ enabled });
      console.log(`Plugin ${pluginName} has been ${enabled ? "enabled" : "disabled"}.`);
    } catch (error) {
      console.error(`Error changing plugin enabled state: ${error}`);
    }
  }

  public async registerHooks() {
    
  }

  // Install plugins by adding missing ones to the database based on the file system
  public async installPlugin(pluginInfo: PluginInfo): Promise<void> {
    try {
      const isInstalled = await this.isPluginInstalled(pluginInfo.name);

      // If the plugin is not installed, create a new PluginConfig in the database
      if (!isInstalled) {
        await this.createPluginConfig({
          name: pluginInfo.name,
          authorEmail: pluginInfo.authorEmail || "",
          version: pluginInfo.version,
          coreVersion: pluginInfo.coreVersion || "",
          description: pluginInfo.description,
          author: pluginInfo.author,
          enabled: false, // default to disabled on install
        });
        console.log(`Plugin ${pluginInfo.name} installed successfully.`);
      }
    } catch (error) {
      console.error(`Error installing plugin ${pluginInfo.name}: ${error}`);
    }
  }

  public async uninstallPlugin(pluginName: string): Promise<void> {
    try {
        // Find the plugin in the database by name
        const pluginConfig = await PluginModel.findOne({
            where: { name: pluginName },
        });

        // If plugin is not found, throw an error
        if (!pluginConfig) {
            throw new Error(`Plugin ${pluginName} not found in the database.`);
        }

        // Delete the plugin from the database
        await pluginConfig.destroy();
        console.log(`Plugin ${pluginName} uninstalled successfully.`);
    } catch (error) {
        console.error(`Error uninstalling plugin ${pluginName}: ${error}`);
        throw error;
    }
}

  // Install multiple plugins in parallel
  public async installPlugins(plugins: Array<PluginInfo>): Promise<void> {
    const installList = plugins.map(pluginInfo => this.installPlugin(pluginInfo));

    try {
      await Promise.all(installList);
      console.log("All plugins installed successfully.");
    } catch (error) {
      console.error('Error in one of the async functions:', error);
      throw error;
    }
  }

  // Get all plugins from the database
  public async getAllPlugins(): Promise<PluginModel[]> {
    try {
      return await this.getAllPluginConfigs();
    } catch (error) {
      console.error(`Error fetching all plugins: ${error}`);
      throw error;
    }
  }

  public async registerEnabledPluginHook(plugin_name: string) {
    let plugin;
    try {
      plugin = require(plugin_name)
    }
    catch (e) {
      console.log(`Error importing ${plugin_name} plugin: ${e}`)
      return;
    }
    const {hook_catchers, services} = plugin;
    for (const hook_catcher of hook_catchers) {
      await hook_catcher(add_action)
    }
  }

  public async registerAllEnabledPluginHooks() {
    const enPlugins = await this.getAllPluginConfigs();
    for (const plugin of enPlugins) {
      if (plugin.enabled) {
        await this.registerEnabledPluginHook(plugin.name)
      }
    }
  }
}
