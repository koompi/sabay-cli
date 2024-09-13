const axios = require('axios');

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

async function fetchServiceInfo() {
  try {
    const response = await axios.post('http://localhost:8084/api/listservices', {
      stackId: "66ce806656dcdbd2bea015cc",
      subscriptionId: "66bc781bbf70dc939b5894a8"
    });

    const services = response.data.data.container_listService.services;
    return services.map(service => ({
      id: service.id,
      serviceName: service.serviceName
    }));
  } catch (error) {
    console.error('Error fetching service information:', error.message);
    return [];
  }
}

async function fetchServiceLogs(serviceId, serviceName) {
  try {
    const response = await axios.post('http://localhost:8084/api/logService', {
      serviceId: serviceId,
      subscriptionId: "66bc781bbf70dc939b5894a8"
    });

    console.log(`\n${colorize('=== Logs for ' + serviceName + ' (ID: ' + serviceId + ') ===', colors.green)}`);
    const formattedLogs = formatLogs(response.data.data.container_getServiceLogById);
    console.log(formattedLogs);
    console.log(colorize('='.repeat(50), colors.green));
  } catch (error) {
    console.error(`Error fetching logs for ${serviceName} (ID: ${serviceId}):`, error.message);
  }
}

async function fetchAllServiceInfoAndLogs() {
  const services = await fetchServiceInfo();

  console.log(colorize('Service Information:', colors.bright));
  services.forEach(info => console.log(colorize(`ID: ${info.id}, Service Name: ${info.serviceName}`, colors.blue)));
  console.log(colorize('='.repeat(50), colors.green));

  for (const service of services) {
    await fetchServiceLogs(service.id, service.serviceName);
  }
}

fetchAllServiceInfoAndLogs();