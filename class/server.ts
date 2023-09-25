import express from 'express';
import http from 'http';
import { SERVER_PORT } from '../global/environment';


export default class Server {
  private static _instance: Server;

  public app: express.Application;
  public port: number;
  public httpServer: http.Server;

  private constructor() {
    this.app = express();
    this.port = SERVER_PORT;

    this.httpServer = http.createServer(this.app);
  }


  
  
  public static get instance(): Server {
    if (!Server._instance) {
      Server._instance = new this();
    }
    return Server._instance;
  }

  start(callback: () => void) {
    this.httpServer.listen(this.port, callback);
  }
}
