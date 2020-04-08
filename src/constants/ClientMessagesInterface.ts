interface ErrorMessagesInterface {
  CONTAINER_NOT_EXIST: (command: string) => string;
  UNSUPPORTED_COMMAND: (command: string) => string;
  DUP_IFRAME: string;
  NOT_STARTED: string;
  ZERO_QUEUE: string;
};

export const ErrorMessages: ErrorMessagesInterface = {
  CONTAINER_NOT_EXIST: container => `Container provided to sorai(): ${container} does not exist.`,
  UNSUPPORTED_COMMAND: command => `Command ${command} not support by sora client interface`,
  DUP_IFRAME: "SORA IFRAME already exists on page, aborting duplicate initiation",
  NOT_STARTED: "First sorai cmd in queue has to be sorai('start')",
  ZERO_QUEUE: "No messages in w.sorai.q",
};

export interface IframeOptions {
  containerId?: string;
  styleId?: string;
}