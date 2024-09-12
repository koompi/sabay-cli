#!/usr/bin/env node

import 'dotenv/config';
import { fetchToken } from './commands/fetchToken.mjs';
import { updateStack } from './commands/updateStack.mjs';
import { listStacks } from './commands/listStacks.mjs';
import { listServices } from './commands/listServices.mjs';
import { parseArgs } from './utils/parseArgs.mjs';
import { logService } from './commands/logService.mjs';

async function listServicesAndFetchLogs(stackIdentifier) {
    try {
        const services = await listServices(stackIdentifier);
        if (services.length > 0) {
            const { id, subscriptionId } = services[0]; // Example: getting the first service
            const logs = await logService("66e2c148f711e6a388eefa32", "66bc781bbf70dc939b5894a8");
            console.log('Service Logs:', logs);
        } else {
            console.log(`No services found for stack ${stackIdentifier}`);
        }
    } catch (error) {
        console.error('Error listing services and fetching logs:', error);
    }
}
async function main() {
    const args = process.argv.slice(2);
    const { command, options, parameters } = parseArgs(args);

    switch (command) {
        case '--token':
        case 'token':
        case 't':
            console.log('Fetching authentication token...');
            try {
                const token = await fetchToken();
                console.log('Fetched token:', token);
            } catch (err) {
                console.error('Error fetching token:', err);
            }
            break;
        case '--updatestack':
        case 'updatestack':
            if (parameters.length === 1) {
                console.log(`Updating stack for service: ${parameters[0]}`);
                try {
                    await updateStack(parameters[0]);
                    console.log(`Stack updated successfully for service: ${parameters[0]}`);
                } catch (err) {
                    console.error('Error updating stack:', err);
                }
            } else {
                console.error('Usage: sabay updatestack <serviceName>');
            }
            break;
        case '--liststack':
        case 'liststack':
            if (parameters.length === 0) {
                console.log('Fetching list of all stacks...');
                try {
                    await listStacks();
                } catch (err) {
                    console.error('Error fetching stack list:', err);
                }
            } else if (parameters.length === 1) {
                console.log(`Fetching services for stack: ${parameters[0]}`);
                try {
                    await listServices(parameters[0]);
                } catch (err) {
                    console.error('Error fetching services:', err);
                }
            } else {
                console.error('Usage: sabay liststack [stackName]');
            }
            break;
        case '--listservice':
        case 'listservice':
            if (parameters.length === 1) {
                console.log(`Fetching services for stack: ${parameters[0]}`);
                try {
                    await listServices(parameters[0]);
                } catch (err) {
                    console.error('Error fetching services:', err);
                }
            } else {
                console.error('Usage: sabay listservice <stackIdentifier>');
            }
            case '--logstack':
                if (parameters.length === 1) {
                    console.log(`Fetching logs for stack: ${parameters[0]}`);
                    try {
                        const services = await listServices(parameters[0]);
                        const { id, subscriptionId } = services[0]; // Example: getting the first service
                        await listServicesAndFetchLogs(id, subscriptionId); // Pass correct parameters
                    } catch (err) {
                        console.error('Error fetching logs:', err);
                    }
                } else {
                    console.error('Usage: sabay --logstack <stackIdentifier>');
                }
            break;
        default:
            console.log(`
Usage:
  sabay token
    Fetch a new authentication token.

  sabay updatestack <serviceName>
    Update the stack for the specified service.

  sabay liststack
    List all available stacks.

  sabay listservice <stackIdentifier>
    List services for a stack identified by name or ID.

For more information, visit our documentation or help page.
            `);
            process.exit(1);
    }
}

main();
