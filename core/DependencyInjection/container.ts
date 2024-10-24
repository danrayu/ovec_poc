import { Container } from "inversify";
import { PluginManagerService } from "../Plugins/services/PluginManagerService";
import { HookService } from "../Plugins/services/HookService";

const container = new Container();
container.bind<PluginManagerService>(PluginManagerService).toSelf();
container.bind<HookService>(HookService).toSelf();

// Export the container
export { container };
