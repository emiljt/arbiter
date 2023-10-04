import Pino from "pino";

export enum LogLevel {
  DEBUG = "DEBUG",
  ERROR = "ERROR",
  INFO = "INFO",
  WARN = "WARN",
}

export class Logger {
  #logger: Pino.Logger;

  constructor(subject: string, level: LogLevel = LogLevel.INFO) {
    this.#logger = Pino({
      name: subject,
      level: level.toString().toLowerCase(),
    });
  }

  debug(message: string) {
    this.#logger.debug(message);
  }

  error(message: string) {
    this.#logger.error(message);
  }

  info(message: string) {
    this.#logger.info(message);
  }

  warn(message: string) {
    this.#logger.warn(message);
  }
}
