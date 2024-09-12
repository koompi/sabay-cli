export async function logService(serviceId, subscriptionId) {
    try {
        const response = await fetch('http://localhost:8084/api/logService', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serviceId, subscriptionId })
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch logs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Logs API Response:', data); // Debug log
        return data.data?.container_getServiceLogById || 'No logs found'; // Adjust based on actual data structure

    } catch (error) {
        console.error('Error fetching logs:', error);
    }
}