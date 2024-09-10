import { fetchToken } from './fetchToken.mjs';

export async function updateStack(serviceName) {
    const token = await fetchToken();
    const response = await fetch('http://localhost:8084/api/updateStack', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ serviceName }),
    });

    if (!response.ok) {
        throw new Error(`Failed to update stack: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Update stack response:', data);
}
