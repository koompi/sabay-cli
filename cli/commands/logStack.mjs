import { listServices } from './listServices.mjs';
import { logService } from './logService.mjs';
import Table from 'cli-table3';

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

function formatLogs(logs) {
  // Ensure logs is a string
  if (!logs || typeof logs !== 'string') {
    return colorize('No logs available or failed to retrieve logs.', colors.red);
  }

  const cleanLogs = logs.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  const lines = cleanLogs.split('\n');
  
  let formattedOutput = '';
  let inErrorStack = false;

  lines.forEach(line => {
    line = line.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\s+(\w+)\s+/, '');

    if (line.startsWith('ReferenceError:') || line.includes('Error:')) {
      inErrorStack = true;
      formattedOutput += `\n\n${colorize('--- Error ---', colors.red)}\n`;
    }

    if (inErrorStack) {
      formattedOutput += colorize(line, colors.red) + '\n';
      if (line.includes('}')) {
        inErrorStack = false;
        formattedOutput += `${colorize('--- End of Error ---', colors.red)}\n\n`;
      }
    } else if (line.startsWith('Unable to find `next-intl` locale')) {
      formattedOutput += `\n${colorize('--- Warning ---', colors.yellow)}\n${colorize(line, colors.yellow)}\n${colorize('--- End of Warning ---', colors.yellow)}\n\n`;
    } else if (line.trim().startsWith('{') || line.trim().startsWith('}')) {
      formattedOutput += colorize(line, colors.cyan) + '\n';
    } else {
      formattedOutput += colorize('• ' + line, colors.reset) + '\n';
    }
  });

  return formattedOutput;
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
        const formattedLogs = formatLogs(logs);
        console.log(formattedLogs);
      } catch (error) {
        console.error(colorize(`Error fetching logs for service ${service.serviceName}:`, colors.red), error.message);
      }
      
      console.log(colorize('='.repeat(50), colors.green));
    }
  } catch (error) {
    console.error(colorize('Error listing services and fetching logs:', colors.red), error.message);
  }
}
