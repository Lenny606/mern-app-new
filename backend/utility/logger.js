import fs from 'fs';
import path from 'path';

class Logger {
    static levels = {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3,
    };

    static level = this.levels.INFO;
    static infoLogPath = path.join(process.cwd(), 'logs', 'info.log');
    static errorLogPath = path.join(process.cwd(), 'logs', 'error.log');
    // static infoLogPath = path.join(process.cwd(), 'logs', 'info.log');

    static setLevel(newLevel) {
        this.level = newLevel;
    }

    static formatMessage(level, message, ...args) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message} ${args.join(' ')}\n`;
    }

    static writeToFile(message) {
        fs.mkdirSync(path.dirname(this.infoLogPath), { recursive: true });
        fs.appendFileSync(this.infoLogPath, message);
    }

    static error(message, ...args) {
        if (this.level >= this.levels.ERROR) {
            fs.mkdirSync(path.dirname(this.errorLogPath), { recursive: true });
            fs.appendFileSync(this.errorLogPath, message);
        }
    }

    static warn(message, ...args) {
        if (this.level >= this.levels.WARN) {
            console.warn(this.formatMessage('WARN', message, ...args));
        }
    }

    static info(message, ...args) {
        const formattedMessage = this.formatMessage('INFO', message, ...args);
        if (this.level >= this.levels.INFO) {
            console.info(formattedMessage);
            this.writeToFile(formattedMessage);
        }
    }

    static debug(message, ...args) {
        if (this.level >= this.levels.DEBUG) {
            console.debug(this.formatMessage('DEBUG', message, ...args));
        }
    }
}

export default Logger;