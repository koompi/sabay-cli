import fetch from 'node-fetch';

export async function fetchToken() {
    const response = await fetch('http://localhost:8084/api/getAuth');
    if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.statusText}`);
    }
    const data = await response.json();
    return data.token;
}
