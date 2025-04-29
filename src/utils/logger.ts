import winston, { Logger } from "winston";

class LoggerSingleton {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!LoggerSingleton.instance) {
      LoggerSingleton.instance = winston.createLogger({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp(),
          winston.format.printf(
            ({ level, timestamp, message }) => `${level}: ${message} [${timestamp}]`
          )
        ),
        transports: [new winston.transports.Console()],
      });
    }
    return LoggerSingleton.instance;
  }
}

export default LoggerSingleton;
