const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    debug: '\x1b[38;5;39m',
    info: '\u001b[38;5;34m',
    warn: '\u001b[38;5;208m',
    error: '\u001b[38;5;160m',
  },
};

enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

const LEVEL: LogLevel = LogLevel[(process.env.LOG_LEVEL || 'INFO') as keyof typeof LogLevel];
export class Logger {
  private constructor() {}

  public static debug(message: string): void {
    if (this.canLog(LogLevel.DEBUG)) {
      console.log(colours.fg.info, this.prefix(LogLevel.INFO), colours.reset, message);
    }
  }
  public static info(message: string): void {
    if (this.canLog(LogLevel.INFO)) {
      console.log(colours.fg.info, this.prefix(LogLevel.INFO), colours.reset, message);
    }
  }
  public static warn(message: string): void {
    if (this.canLog(LogLevel.WARN)) {
      console.warn(colours.fg.warn, this.prefix(LogLevel.WARN), colours.reset, message);
    }
  }
  public static error(message: string): void {
    if (this.canLog(LogLevel.ERROR)) {
      console.error(colours.fg.error, this.prefix(LogLevel.ERROR), colours.reset, message);
    }
  }

  private static canLog(level: LogLevel): boolean {
    return level >= LEVEL;
  }

  private static prefix(level: LogLevel): string {
    return `${new Date().toISOString()} [PID: ${process.pid}] [${level}]: `;
  }
}

export const logger = Logger;
