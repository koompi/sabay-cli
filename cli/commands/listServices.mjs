import fetch from 'node-fetch';
import Table from 'cli-table3';
import { listStacks } from './listStacks.mjs';

// Function to colorize text
function colorize(text, colorCode) {
    return `\x1b[${colorCode}m${text}\x1b[0m`;
}

export async function listServices(stackIdentifier) {
    try {
        const stacks = await listStacks();
        const stack = stacks.find(stack => stack.stackName === stackIdentifier || stack.id === stackIdentifier);

        if (!stack) {
            console.error(`Stack with identifier ${stackIdentifier} not found`);
            return;
        }

        const { id: stackId, subscriptionId } = stack;

        const response = await fetch('http://localhost:8084/api/listservices', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stackId, subscriptionId })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch services: ${response.statusText}`);
        }

        const data = await response.json();
        const services = data.data.container_listService.services;

        if (services.length === 0) {
            console.log(`No services found for stack ${stackIdentifier}`);
            return;
        }

        const summaryTable = new Table({
            head: ['Service Name', 'Container Image', 'Status', 'Domain Name'],
            colWidths: [23, 70, 10, 25]
        });

        services.forEach(service => {
            summaryTable.push([
                service.serviceName,
                service.image,
                service.status === 1 ? 'Running' : 'Stopped',
                service.domain ? service.domain.domainName : 'N/A'
            ]);
        });

        console.log('Services Summary:');
        console.log(summaryTable.toString());

        services.forEach(service => {
            const detailedTable = new Table({
                head: ['Field', 'Value'],
                colWidths: [30, 100]
            });

            for (const [key, value] of Object.entries(service)) {
                if (typeof value === 'object' && value !== null) {
                    detailedTable.push([key, JSON.stringify(value, null, 2)]);
                } else {
                    detailedTable.push([key, value]);
                }
            }

            console.log(`\nService Details for ${colorize(service.serviceName, 32)}:`);
            console.log(detailedTable.toString());
        });
        return services;


    } catch (error) {
        console.error('Error listing services:', error);
    }
}
