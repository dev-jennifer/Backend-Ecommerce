const log4js =require("log4js");

log4js.configure({
  appenders: {
    console: { type: "console" },
    warnings: { type: "file", filename: "warn.log" },
    errors: { type: "file", filename: "error.log" },
    loggerConsole: {
      type: "logLevelFilter",
      appender: "console",
      level: "info",
    },
    loggerWarns: {
      type: "logLevelFilter",
      appender: "warnings",
      level: "warn",
    },
    loggerErrors: {
      type: "logLevelFilter",
      appender: "errors",
      level: "error",
    },
  },
  categories: {
    default: { appenders: ["loggerConsole"], level: "all" },
    custom: {
      appenders: ["loggerConsole", "loggerWarns", "loggerErrors"],
      level: "all",
    },
  },
});

let logger = log4js.getLogger("custom");

module.exports= logger;
