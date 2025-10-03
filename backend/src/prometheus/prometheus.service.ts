import * as client from 'prom-client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrometheusService {
  private readonly register: client.Registry;
  constructor() {
    this.register = new client.Registry();
    this.register.setDefaultLabels({ app: 'nestjs-prometheus' });
    client.collectDefaultMetrics({ register: this.register });
  }

  getMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
