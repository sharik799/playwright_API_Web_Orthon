import { Reporter, TestCase, TestError, TestResult, TestStep } from "@playwright/test/reporter";
import fs from 'fs';
import path from 'path';
import winston from 'winston';
 
// Path for the log file
const logDir = path.join(__dirname, `logs`);
const logFilePath = path.join(logDir, `info.log`);
 
// Clear the log file by overwriting it with an empty string before starting
if (fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, ``);  // Overwrite the existing log file with an empty string
} else {
    // If the log file doesn't exist, create an empty one
    fs.writeFileSync(logFilePath, ``);
}
 
// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });  // Create directory if it doesn't exist
}
 
const logger = winston.createLogger({
    level: `info`,
    format: winston.format.simple(),
    transports: [
        new winston.transports.File({ filename: logFilePath, level: `info` }),
    ],
});
 
// Console transport to output logs to console
logger.add(new winston.transports.Console());
 
// Custom Reporter class
class CustomReporterConfig implements Reporter {
    static logInfo(message: string) {
        logger.info(message);
    }
 
    static logError(message: string) {
        logger.error(message);
    }
 
    onTestBegin(test: TestCase): void {
        CustomReporterConfig.logInfo(`Test Case Started: ${test.title}`);
    }
 
    onTestEnd(test: TestCase, result: TestResult): void {
        CustomReporterConfig.logInfo(`Test Case Completed: ${test.title} Status: ${result.status}`);
    }
 
    onStepBegin(test: TestCase, result: TestResult, step: TestStep): void {
        if (step.category === `test.step`) {
            CustomReporterConfig.logInfo(`Executing Step: ${step.title}`);
        }
    }
 
    onError(error: TestError): void {
        CustomReporterConfig.logError(error.message);
    }
}
 
export default CustomReporterConfig;

