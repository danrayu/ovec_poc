export default class ModelMetadata {
    constructor(
        public modelName: string,
        public modelDescription: string,
        public pluginName: string,
        public modelType: ModelTypes
    ) {}
}