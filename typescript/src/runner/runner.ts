import { Job } from '../job/job';

export interface Runner<T> {
  readonly jobs: ReadonlyArray<Job<T>>;
  removeJob(jobId: string): void;
  addJob(job: Job<T>): void;
}
