#!/usr/bin/env node

import 'dotenv/config';
import { fetchToken } from './commands/fetchToken.mjs';
import { updateStack } from './commands/updateStack.mjs';
import { listStacks } from './commands/listStacks.mjs';
import { listServices } from './commands/listServices.mjs';
import { parseArgs } from './utils/parseArgs.mjs';
import { logService } from './commands/logService.mjs';
import { listServicesAndFetchLogs } from './commands/logStack.mjs';

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
    case 'logstack':
      if (parameters.length === 1) {
        console.log(colorize(`Fetching logs for stack: ${parameters[0]}`, colors.green));
        try {
          await listServicesAndFetchLogs(parameters[0]);
        } catch (err) {
          console.error(colorize('Error fetching logs:', colors.red), err);
        }
      } else {
        console.error(colorize('Usage: sabay --logstack <stackIdentifier>', colors.red));
      }
      break;
            break;
        default:
            console.log(colorize(`
          Usage:
            sabay token
              Fetch a new authentication token.
          
            sabay updatestack <serviceName>
              Update the stack for the specified service.
          
            sabay liststack
              List all available stacks.
          
            sabay listservice <stackIdentifier>
              List services for a stack identified by name or ID.
          
            sabay --logstack <stackIdentifier>
              Fetch and display logs for all services in the specified stack.
          
          For more information, visit our documentation or help page.
                `, colors.cyan));
            process.exit(1);
    }
}

main();
