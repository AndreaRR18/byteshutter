const isDevelopment = import.meta.env.DEV;

export const logger = {
  error: (message: string, error?: unknown) => {
    if (isDevelopment) {
      console.error(message, error);
    }
    // In production, could send to error tracking service (e.g., Sentry)
  },

  warn: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.warn(message, data);
    }
  },

  info: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.log(message, data);
    }
  },

  debug: (message: string, data?: unknown) => {
    if (isDevelopment) {
      console.debug(message, data);
    }
  },
};
