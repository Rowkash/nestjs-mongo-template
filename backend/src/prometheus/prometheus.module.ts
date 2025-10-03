import { Module } from '@nestjs/common';

import { PrometheusController } from '@/prometheus/prometheus.controller';
import { PrometheusService } from '@/prometheus/prometheus.service';

@Module({
  controllers: [PrometheusController],
  providers: [PrometheusService],
})
export class PrometheusModule {}
