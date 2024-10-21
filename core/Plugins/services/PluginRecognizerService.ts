import { injectable } from "inversify";
import PluginConfig from "../Models/PluginConfig";
import { readFileSync } from "fs";
const path = require("path");
const fs = require("fs");

@injectable()
export class PluginRecognizerService {
  public getMessage(): string {
    return "Hello from MyService!";
  }

  public findInstalledPlugins(): Array<string> {
    const packageJson = JSON.parse(readFileSync("./package.json", "utf8"));
    const installedPlugins = Object.keys(packageJson.dependencies).filter(
      (dep) => dep.startsWith("ovec-")
    );

    this.inflatePluginConfig(installedPlugins[0]);

    return installedPlugins;
  }

  public safeParseJson(filePath: string, requiredKeys: string[]) {
    let parsedData;

    // Step 1: Safely read and parse the JSON file
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      parsedData = JSON.parse(fileContent);
    } catch (error) {
      throw new Error(
        `Failed to parse JSON file at ${filePath}: ${error.message}`
      );
    }

    // Step 2: Validate presence of required keys
    for (const key of requiredKeys) {
      if (!parsedData.hasOwnProperty(key)) {
        throw new Error(
          `Missing required key: ${key} in JSON file at ${filePath}`
        );
      }
    }

    // Step 3: Return the parsed data if all required keys are present
    return parsedData;
  }

  public checkPluginCompatability() {
    
  }

  public inflatePluginConfig(plugin_name: string): PluginConfig {
    const configPath = path.resolve(
      `./node_modules/${plugin_name}/package.json`
    );
    console.log(configPath);
    if (!fs.existsSync(configPath)) {
      throw new Error(
        `File not found error: ${plugin_name} is in package.json, but is missing in node_modules.`
      );
    }

    const configJson = JSON.parse(readFileSync(configPath, "utf8"));

    const {
      name,
      version,
      description,
      author,
    } = configJson;

    return new PluginConfig(name, undefined, version, undefined, description, author)
  }
}
