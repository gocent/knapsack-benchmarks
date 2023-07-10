import { AlgorithmResult, Result } from './algorithm-result';
import { logger } from '../logger/logger';
import { Job } from '../job/job';
import { randomUUID } from 'crypto';

export class StepByStepAlgorithmJob implements Job<Readonly<Result>> {
  public readonly jobId: Readonly<string>;
  private dataSet: ReadonlyArray<number> = [];
  private readonly limit = 10000000000;

  constructor(
    private readonly valueToMatch: number,
    private readonly dataSetLength: number,
    private readonly max: number,
    private readonly iterations: number,
  ) {
    this.jobId = randomUUID();
  }

  public run(): Readonly<Result> {
    logger.info(`Initializing Step By Step with value to match ${this.valueToMatch} and ${this.iterations} iterations`);
    const start = Date.now();
    logger.info(`Start benchmarking`);
    const result = new Result();
    for (let i = 0; i < this.iterations; i++) {
      const dataSet: number[] = [];
      for (let i = 0; i < this.dataSetLength; i++) {
        dataSet.push(Math.floor(Math.random() * this.max + 1));
      }
      this.dataSet = [...dataSet];
      const higherValues = this.dataSet.filter((value) => value > this.valueToMatch).length;
      const lowerValues = this.dataSet.filter((value) => value < this.valueToMatch).length;
      logger.info(`${higherValues} higher values and ${lowerValues} lower values than ${this.valueToMatch}`);
      result.add(this.execute());
    }

    logger.info(`Benchmarking finished in ${(Date.now() - start) / 100}s`);
    return result;
  }

  private execute(): AlgorithmResult {
    const start = Date.now();
    const matchedValues: number[] = [];
    const workingDataSet = [...this.dataSet].sort((a, b) => a - b);
    let totalMatchedValues = 0;
    let iterations = 0;
    let valueToCompared = this.valueToMatch;
    let distance = 0;
    let indexMatched = 0;
    let index = 0;
    logger.debug(`Executing algorithm`);
    while (totalMatchedValues < this.valueToMatch) {
      const currentValue = workingDataSet[index];
      const distanceToCurrentValue = Math.abs(valueToCompared - currentValue);
      index++;
      if (iterations++ > this.limit) {
        logger.warn(`Limit of ${this.limit} iterations reached`);
        break;
      }
      if (currentValue === valueToCompared) {
        matchedValues.push(workingDataSet[index]);
        totalMatchedValues += currentValue;
      } else if (distanceToCurrentValue < distance) {
        distance = distanceToCurrentValue;
        indexMatched = index;
        index++;
      } else if (distanceToCurrentValue > distance && currentValue > valueToCompared) {
        totalMatchedValues += workingDataSet[indexMatched];
        valueToCompared -= workingDataSet[indexMatched];
        matchedValues.push(workingDataSet[indexMatched]);
        workingDataSet.splice(indexMatched, 1);
        distance = 0;
        indexMatched = 0;
        index = 0;
      }
      iterations++;
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
