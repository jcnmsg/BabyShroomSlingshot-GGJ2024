globalThis.console = {
    log: (...args) => traceLog(LOG_INFO, args),
    error: (...args) => traceLog(LOG_ERROR, args),
    warn: (...args) => traceLog(LOG_WARNING, args),
}