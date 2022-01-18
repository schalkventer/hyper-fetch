// Events
export const getResponseEventKey = (key: string) => `${key}-response`;
export const getAbortEventKey = (key: string) => `${key}-request-abort`;
export const getRequestStartEventKey = (key: string) => `${key}-request-start`;
export const getResponseStartEventKey = (key: string) => `${key}-response-start`;
export const getUploadProgressEventKey = (key: string) => `${key}-request-progress`;
export const getDownloadProgressEventKey = (key: string) => `${key}-response-progress`;