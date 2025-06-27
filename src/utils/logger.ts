import { z } from 'zod';
import { env } from '../config/environment.js';

const logLevelSchema = z.enum(['debug', 'info', 'warn', 'error']);
type LogLevel = z.infer<typeof logLevelSchema>;

const logLevels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = env.LOG_LEVEL) {
    this.level = level;  
  }

  private shouldLog(level: LogLevel): boolean {
    return logLevels[level] >= logLevels[this.level];
  }

  private formatMessage(level: LogLevel, messsage: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const emoji = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌' }[level];
    const baseMessage = `[${timestamp}] [${emoji}] [${level.toUpperCase()}]: ${messsage}`;

    return data ? `${baseMessage}\nData: ${JSON.stringify(data, null, 2)}` : baseMessage;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug'))
      console.log(this.formatMessage('debug', message, data));
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info'))
      console.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn'))
      console.log(this.formatMessage('warn', message, data));
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error'))
      console.log(this.formatMessage('error', message, data));
  }
}

export const logger = new Logger();