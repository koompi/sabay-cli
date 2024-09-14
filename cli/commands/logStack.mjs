import { listServices } from './listServices.mjs';
import { logService } from './logService.mjs';
import PrettyError from 'pretty-error';  // Import PrettyError

// Initialize PrettyError
const pe = new PrettyError();
pe.start();  // PrettyError will handle colorful error logging automatically

// ANSI color codes for basic text styling
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  bright: "\x1b[1m",
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
}

function colorizeLogs(log) {
  return log
    .split('\n')
    .map(line => {
      if (line.toLowerCase().includes('error')) {
        return colorize(line, colors.red);  // Make lines containing 'error' red
      }
      return line;  // Leave other lines uncolored
    })
    .join('\n');
}

export async function listServicesAndFetchLogs(stackIdentifier) {
  try {
    const services = await listServices(stackIdentifier);

    if (services.length === 0) {
      console.log(colorize(`No services found or unable to fetch services for stack ${stackIdentifier}`, colors.yellow));
      return;
    }

    console.log(colorize('Service Information:', colors.bright));
    services.forEach(service => {
      console.log(colorize(`ID: ${service.id}, Service Name: ${service.serviceName}`, colors.blue));
    });
    console.log(colorize('='.repeat(50), colors.green));

    // Fetch logs for each service
    for (const service of services) {
      console.log(`\n${colorize('=== Logs for ' + service.serviceName + ' (ID: ' + service.id + ') ===', colors.green)}`);

      try {
        const logs = await logService(service.id, "66bc781bbf70dc939b5894a8");
        console.log(colorizeLogs(logs));  // Colorize the logs, errors in red
      } catch (error) {
        console.error(colorize(`Error fetching logs for service ${service.serviceName}:`, colors.red));
        console.error(pe.render(error));  // PrettyError handles colorful error logging
      }

      console.log(colorize('='.repeat(50), colors.green));
    }
  } catch (error) {
    console.error(colorize('Error listing services and fetching logs:', colors.red));
    console.error(pe.render(error));  // PrettyError handles colorful error logging
  }
}
