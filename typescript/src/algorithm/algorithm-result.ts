export class Result {
  private readonly results: AlgorithmResult[] = [];
  public add(result: AlgorithmResult): void {
    this.results.push(result);
  }
  public get(): Readonly<AlgorithmResult[]> {
    return this.results;
  }
}
export interface AlgorithmResult {
  readonly matchedValues: number[];
  readonly matchedPercentage: number;
  readonly iterations: number;
  readonly executionTime: number;
  readonly targetValue: number;
  readonly totalMatchedValue: number;
}
