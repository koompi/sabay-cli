import fetch from 'node-fetch';
import Table from 'cli-table3';

export async function listStacks() {
    const response = await fetch('http://localhost:8084/api/listStack');
    if (!response.ok) {
        throw new Error(`Failed to fetch stack list: ${response.statusText}`);
    }
    const data = await response.json();
    const stacks = data.data.container_listStack.stacks;

    const table = new Table({
        head: ['ID', 'Stack Name', 'Status', 'Number of Services', 'Subscription ID'],
        colWidths: [30, 25, 17, 25, 30]
    });

    stacks.forEach(stack => {
        table.push([stack.id, stack.stackName, stack.status, stack.numberOfService, stack.subscriptionId]);
    });

    console.log(table.toString());

    return stacks;
}
