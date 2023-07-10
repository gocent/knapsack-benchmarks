import { AlgorithmResult, Result } from './algorithm-result';
import { logger } from '../logger/logger';
import { Job } from '../job/job';
import { randomUUID } from 'crypto';

export class RandomAlgorithmJob implements Job<Readonly<Result>> {
  public readonly jobId: Readonly<string>;
  private readonly dataSet: ReadonlyArray<number>;
  private readonly limit = 10000000000;

  constructor(
    private readonly valueToMatch: number,
    private readonly dataSetLength: number,
    private readonly max: number,
    private readonly iterations: number,
  ) {
    logger.info(
      `Initializing RandomAlgorithm with value to match ${this.valueToMatch} and ${this.iterations} iterations`,
    );
    const dataSet: number[] = [];
    for (let i = 0; i < this.dataSetLength; i++) {
      dataSet.push(Math.floor(Math.random() * this.max + 1));
    }
    this.dataSet = [...dataSet];
    this.jobId = randomUUID();
    const higherValues = this.dataSet.filter((value) => value > this.valueToMatch).length;
    const lowerValues = this.dataSet.filter((value) => value < this.valueToMatch).length;
    logger.info(`${higherValues} higher values and ${lowerValues} lower values than ${this.valueToMatch}`);
  }

  public run(): Readonly<Result> {
    const start = Date.now();
    logger.info(`Start benchmarking`);
    const result = new Result();
    for (let i = 0; i < this.iterations; i++) {
      result.add(this.execute());
    }

    logger.info(`Benchmarking finished in ${(Date.now() - start) / 100}s`);
    return result;
  }

  private execute(): AlgorithmResult {
    const start = Date.now();
    const matchedValues: number[] = [];
    const workingDataSet = [...this.dataSet];
    let totalMatchedValues = 0;
    let iterations = 0;
    logger.debug(`Executing algorithm`);
    while (totalMatchedValues < this.valueToMatch) {
      if (iterations++ > this.limit) {
        logger.warn(`Limit of ${this.limit} iterations reached`);
        break;
      }
      const randomIndex = Math.floor(Math.random() * (workingDataSet.length - 1) + 1);
      if (randomIndex >= workingDataSet.length || randomIndex < 0) {
        logger.error(`Random index ${randomIndex} is out of bounds`);
        continue;
      }
      logger.debug(`Adding ${workingDataSet[randomIndex]} to total matched values ${totalMatchedValues}`);
      matchedValues.push(workingDataSet[randomIndex]);
      totalMatchedValues += workingDataSet[randomIndex];
      workingDataSet.splice(randomIndex, 1);
    }
    logger.debug(
      `Total matched value ${totalMatchedValues} with ${iterations} iterations and matched values ${matchedValues}`,
    );

    return {
      matchedValues,
      matchedPercentage: Math.floor((totalMatchedValues / this.valueToMatch) * 100),
      iterations,
      executionTime: Date.now() - start,
      targetValue: this.valueToMatch,
      totalMatchedValue: totalMatchedValues,
    };
  }
}
