import chalk from 'chalk';
import { fetchToken } from './fetchToken.mjs';
import { listStacks } from './listStacks.mjs';

export async function updateStack(stackIdentifier) {
    const stacks = await listStacks();
    const stack = stacks.find(stack => stack.stackName === stackIdentifier || stack.id === stackIdentifier);

    if (!stack) {
        console.error(chalk.red(`❌ Stack with identifier ${stackIdentifier} not found`));
        return []; // Return an empty array instead of undefined
    }
    
    const token = await fetchToken();
    
    const response = await fetch('http://localhost:8084/api/updateStack', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ "stackId": stack.id, "token": token }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update stack: ${response.statusText}`);
    }

    const data = await response.json();

    // Pretty logging
    console.log(chalk.green('\n===== Stack Update Response =====\n'));
    console.log(chalk.yellow(`Stack Name: ${stack.stackName}`));
    console.log(chalk.cyan(`Message: ${data.data.container_updateStack.message}`));
    console.log(chalk.green(`Success: ${data.data.container_updateStack.success ? '✅ Yes' : '❌ No'}`));
    console.log(chalk.green('\n=================================\n'));
}
