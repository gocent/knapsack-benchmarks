import { Job } from '../job/job';
import { Runner } from './runner';
import { Result } from '../algorithm/algorithm-result';

export class AlgorithmRunner implements Runner<Readonly<Result>> {
  private readonly _jobs: Job<Readonly<Result>>[] = [];

  public get jobs(): ReadonlyArray<Job<Readonly<Result>>> {
    return this._jobs;
  }
  public removeJob(jobId: string): void {
    const index = this._jobs.findIndex((job) => job.jobId === jobId);
    if (index > -1) {
      this._jobs.splice(index, 1);
    }
  }
  public addJob(job: Job<Readonly<Result>>): void {
    this._jobs.push(job);
  }
}
