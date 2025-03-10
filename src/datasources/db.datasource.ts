import {lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const config =
  process.env.NODE_ENV === 'production'
    ? {
      name: 'db',
      connector: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }
    : {
      name: 'db',
      connector: 'memory',
    };

@lifeCycleObserver('datasource')
export class DbDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'db';
  static readonly defaultConfig = config;

  constructor() {
    super(config); // Explicitly pass `config`
  }
}

// Remove this file if it exists: src/datasources/db.datasource.config.json
