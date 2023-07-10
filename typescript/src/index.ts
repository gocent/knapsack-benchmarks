import { logger } from './logger/logger';
import { AlgorithmRunner } from './runner/algorithm-runner';
import { RandomAlgorithmJob } from './algorithm/random-algorithm';
import { StepByStepAlgorithmJob } from './algorithm/step-by-step-algorithm';

const runner = new AlgorithmRunner();
logger.info('Starting algorithm benchmarking !!');
logger.info('Starting random algorithm with a dataset of 100 elements and 1000 iterations');
runner.addJob(new RandomAlgorithmJob(874629, 1000000, 1500000, 100));

logger.info('Starting random algorithm with a dataset of 1000000 elements and 100 iterations');
runner.addJob(new RandomAlgorithmJob(874629, 100, 1500000, 1000));

logger.info('Starting Step By Step algorithm with a dataset of 100 elements and 1000 iterations');
runner.addJob(new StepByStepAlgorithmJob(874629, 100, 1500000, 1000));

logger.info('Starting Step By Step algorithm with a dataset of 10000 elements and 10000 iterations');
runner.addJob(new StepByStepAlgorithmJob(874629, 10000, 1500000, 10000));

// const result100 = randomAlgorithm100.benchmark();
// saveFile('random-algorithm-100', result100.get());
//
// const result10000000 = randomAlgorithm10000000.benchmark();
// saveFile('random-algorithm-10000000', result10000000.get());
//
// const resultStepByStep100 = stepByStepAlgorithm100.benchmark();
// saveFile('step-by-step-algorithm-100', resultStepByStep100.get());
//
// const resultStepByStep10000000 = stepByStepAlgorithm10000000.benchmark();
// saveFile('step-by-step-algorithm-10000000', resultStepByStep10000000.get());
