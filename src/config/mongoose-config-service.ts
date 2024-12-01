import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseRWConfigService implements MongooseOptionsFactory {
  constructor() {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: "mongodb://127.0.0.1:27017/univesity-student-db",
      user:"root",
      pass:"Qj!7GAvKokw@",

      //poolSize: 2,
      // logger: this.configService.get('database.logging'),
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('Mongo RW connection established succesfully!', { prefix: MongooseRWConfigService.name });
        });
        connection.on('disconnected', () => {
          console.log('RW DB disconnected', { prefix: MongooseRWConfigService.name });
        });
        connection.on('error', (error) => {
          console.log('RW DB connection failed! for error: ', { data: error, prefix: MongooseRWConfigService.name });
        });
        return connection;
      },
    };
  }
}
