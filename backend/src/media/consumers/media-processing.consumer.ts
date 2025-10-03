import { Job } from 'bullmq';
import { Processor, WorkerHost } from '@nestjs/bullmq';

import { JobEnum } from '@/bull/enums/job.enum';
import { QueueEnum } from '@/bull/enums/queue.enum';
import { MediaProcessingService } from '@/media/media-processing.service';

@Processor(QueueEnum.MEDIA_PROCESSING_QUEUE)
export class MediaProcessingConsumer extends WorkerHost {
  constructor(private readonly mediaService: MediaProcessingService) {
    super();
  }

  async process(job: Job<string, any, JobEnum>) {
    switch (job.name) {
      case JobEnum.PROCESS_MEDIA_JOB:
        return this.mediaService.processImage(job.data);
      default:
        return;
    }
  }
}
