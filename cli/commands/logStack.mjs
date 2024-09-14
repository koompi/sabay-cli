import { listServices } from './listServices.mjs';
import { logService } from './logService.mjs';
import Table from 'cli-table3';
import PrettyError from 'pretty-error';  // Import PrettyError

// Initialize PrettyError
const pe = new PrettyError();
pe.start();

// ANSI color codes for basic text styling
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function colorize(text, color) {
  return `${color}${text}${colors.reset}`;
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
        console.log(logs);  // Simply print the logs, no formatting applied
      } catch (error) {
        console.error(colorize(`Error fetching logs for service ${service.serviceName}:`, colors.red));
        console.error(pe.render(error));  // Use PrettyError to render error
      }

      console.log(colorize('='.repeat(50), colors.green));
    }
  } catch (error) {
    console.error(colorize('Error listing services and fetching logs:', colors.red));
    console.error(pe.render(error));  // Use PrettyError to render error
  }
}
