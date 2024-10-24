import { Container } from "inversify";
import { PluginManagerService } from "../Plugins/services/PluginManagerService";
import { HookService } from "../Plugins/services/HookService";
import { ContextService } from "../Plugins/services/ContextService";

const container = new Container();
container.bind<ContextService>(ContextService).to(ContextService).inSingletonScope();
container.bind<PluginManagerService>(PluginManagerService).toSelf();
container.bind<HookService>(HookService).toSelf();

// Export the container
export { container };
