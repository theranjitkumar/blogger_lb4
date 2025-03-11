import {BindingScope, inject, injectable} from '@loopback/core';
import {Request, RestBindings} from '@loopback/rest';

import * as dotenv from 'dotenv';
dotenv.config();

@injectable({scope: BindingScope.TRANSIENT})
export class ConfigService {
  constructor(@inject(RestBindings.Http.REQUEST) private request: Request,) { }

  getBaseUrl(): string {
    return `${this.request.protocol}://${this.request.get('host')}`;
  }
}
