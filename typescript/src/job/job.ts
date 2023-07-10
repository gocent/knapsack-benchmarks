export interface Job<T> {
  readonly jobId: Readonly<string>;
  run(): T;
}
