export default class PluginInfo {
  constructor(
    public name: string,
    public authorEmail: string,
    public version: string,
    public coreVersion,
    public description: string,
    public author: string
  ) {}
}
