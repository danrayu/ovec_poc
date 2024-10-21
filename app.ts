import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
const express = require("express");
import { container } from "./core/DependencyInjection/container";
import "./controller"; // Import the controller to make sure it's registered
import { PluginRecognizerService } from "./core/Plugins/services/PluginRecognizerService";
import sequelize from "./core/DataAccess/database";
import Plugin from "./core/DataAccess/models/Plugin";


container.bind<PluginRecognizerService>(PluginRecognizerService).toSelf();

// Create the server
const server = new InversifyExpressServer(container);

server.setConfig((app) => {
  app.use(express.json());
});


const app = server.build();
const serviceFinder = container.get<PluginRecognizerService>(PluginRecognizerService);
serviceFinder.findInstalledPlugins();
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(error => {
    console.error('Error syncing the database:', error);
  });
app.listen(3000, () => {
  
});
