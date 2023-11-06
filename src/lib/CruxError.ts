export class CruxError extends Error {
  constructor(message: string) {
    super(`Crux error: ${message}`);
  }
}
