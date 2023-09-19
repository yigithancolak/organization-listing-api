import { LogLevel } from '@nestjs/common'

export function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['log', 'warn', 'error']
  }

  return ['debug', 'error', 'fatal', 'log', 'verbose', 'warn']
}
