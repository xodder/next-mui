export function error__(message: string, ...args: any[]) {
  console.error(`[error] ${message}`, ...args);
  process.exit(0);
}

export function info__(message: string, ...args: any[]) {
  console.info(`[info] ${message}`, ...args);
}
