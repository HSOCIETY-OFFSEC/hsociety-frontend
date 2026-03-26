const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

const normalizeLevel = (value) => String(value || 'info').toLowerCase();

const LOG_LEVEL = normalizeLevel(import.meta.env.VITE_LOG_LEVEL);
const LOG_CONSOLE = String(import.meta.env.VITE_LOG_CONSOLE || 'false').toLowerCase() === 'true';
const CURRENT_LEVEL = LEVELS[LOG_LEVEL] ?? LEVELS.info;

const shouldLog = (level) => LOG_CONSOLE && LEVELS[level] >= CURRENT_LEVEL;
const formatPrefix = (level) => `[${new Date().toISOString()}] [${level.toUpperCase()}]`;

const write = (level, ...args) => {
  if (!shouldLog(level)) return;
  const method = level === 'debug' ? 'debug' : level;
  console[method](formatPrefix(level), ...args);
};

export const logger = {
  debug: (...args) => write('debug', ...args),
  info: (...args) => write('info', ...args),
  warn: (...args) => write('warn', ...args),
  error: (...args) => write('error', ...args)
};

export default logger;
