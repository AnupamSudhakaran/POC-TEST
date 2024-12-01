import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseROConfigService implements MongooseOptionsFactory {
  constructor() {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: "mongodb://127.0.0.1:27017/univesity-student-db",
      readPreference: 'secondaryPreferred',
      user:"root",
      pass:"Qj!7GAvKokw@",
      // logger: this.configService.get('database.logging'),
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('Mongo RO connection established successfully!', { prefix: MongooseROConfigService.name });
        });
        connection.on('disconnected', () => {
          console.log('RO DB disconnected', { prefix: MongooseROConfigService.name });
        });
        connection.on('error', (error) => {
          console.log('RO DB connection failed! for error: ', { data: error, prefix: MongooseROConfigService.name });
        });
        return connection;
      },
    };
  }
}
