// Ensure you are passing the correct serviceId and subscriptionId
export async function logService(serviceId, subscriptionId) {
    try {
      const response = await fetch('http://localhost:8084/api/logService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serviceId, subscriptionId }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }
  
      const data = await response.json();
      return data.data.container_getServiceLogById;
    } catch (error) {
      throw new Error(`Failed to fetch logs: ${error.message}`);
    }
  }