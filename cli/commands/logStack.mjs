// In logStack.mjs
import { listServices } from './listServices.mjs';
import { logService } from './logService.mjs';

// ANSI color codes
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
  };
  
  function colorize(text, color) {
    return `${color}${text}${colors.reset}`;
  }

export async function listServicesAndFetchLogs(stackId) {
  try {
    const services = await listServices(stackId);
    
    if (services.length === 0) {
      console.log(colorize(`No services found or unable to fetch services for stack ${stackId}`, 33));
      return;
    }

    console.log(colorize('Service Information:', 1));
    for (const service of services) {
      console.log(colorize(`ID: ${service.id}, Service Name: ${service.serviceName}`, 34));
      console.log(colorize('='.repeat(50), 32));
      console.log(`\n${colorize('=== Logs for ' + service.serviceName + ' (ID: ' + service.id + ') ===', 32)}`);
      
      try {
        const logs = await logService(service.id, service.subscriptionId);
        console.log(formatLogs(logs));
      } catch (error) {
        console.error(colorize(`Error fetching logs for service ${service.serviceName}:`, 31), error);
      }
    }
  } catch (error) {
    console.error(colorize('Error listing services and fetching logs:', 31), error);
  }
}