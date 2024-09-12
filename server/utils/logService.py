import requests

def log_service(service_id, subscription_id, token):
    """Fetch logs for a service by its ID."""
    url = 'https://gateway.sabay.com/graphql'
    headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': f'Bearer {token}',
        'content-type': 'application/json',
        'origin': 'https://mysabay.com',
        'referer': 'https://mysabay.com/',
        'sec-ch-ua': '"Not;A=Brand";v="24", "Chromium";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Linux"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'service-code': 'mysabay_user',
        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
    }
    query = """
    query getServiceLogById($subscriptionId: String!, $serviceId: String!, $lineLimit: Int) {
      container_getServiceLogById(
        subscriptionId: $subscriptionId
        serviceId: $serviceId
        lineLimit: $lineLimit
      )
    }
    """
    variables = {
        "serviceId": service_id,
        "subscriptionId": subscription_id,
        "lineLimit": 100
    }
    payload = {
        "operationName": "getServiceLogById",
        "variables": variables,
        "query": query
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()
        if 'errors' in data:
            print(f"GraphQL Errors: {data['errors']}")
        return data
    except requests.exceptions.HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
    except Exception as err:
        print(f'Other error occurred: {err}')
