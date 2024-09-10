#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { fetchToken } from './commands/fetchToken.mjs';
import { updateStack } from './commands/updateStack.mjs';
import { listStacks } from './commands/listStacks.mjs';
import { listServices } from './commands/listServices.mjs';

const program = new Command();

program
    .version('1.0.0')
    .description('Sabay CLI Tool - Manage your stacks and services')
    .option('--token', 'Request a new authentication token')
    .option('--updatestack <serviceName>', 'Update stack for the specified service')
    .option('--liststack', 'List all available stacks')
    .option('--listservice <stackIdentifier>', 'List services for a stack identified by name or ID')
    .parse(process.argv);

const options = program.opts();

async function main() {
    if (options.token) {
        console.log('Fetching authentication token...');
        try {
            const token = await fetchToken();
            console.log('Fetched token:', token);
        } catch (err) {
            console.error('Error fetching token:', err);
        }
    } else if (options.updatestack) {
        console.log(`Updating stack for service: ${options.updatestack}`);
        try {
            await updateStack(options.updatestack);
            console.log(`Stack updated successfully for service: ${options.updatestack}`);
        } catch (err) {
            console.error('Error updating stack:', err);
        }
    } else if (options.liststack) {
        console.log('Fetching list of all stacks...');
        try {
            await listStacks();
        } catch (err) {
            console.error('Error fetching stack list:', err);
        }
    } else if (options.listservice) {
        console.log(`Fetching services for stack: ${options.listservice}`);
        try {
            await listServices(options.listservice);
        } catch (err) {
            console.error('Error fetching services:', err);
        }
    } else {
        console.log(`
Usage:
  sabay --token
    Fetch a new authentication token.

  sabay --updatestack <serviceName>
    Update the stack for the specified service.

  sabay --liststack
    List all available stacks.

  sabay --listservice <stackIdentifier>
    List services for a stack identified by name or ID.

For more information, visit our documentation or help page.
        `);
        process.exit(1);
    }
}

main();
