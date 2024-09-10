import requests

def get_services(stack_id, subscription_id, token):
    url = 'https://gateway.sabay.com/graphql'
    headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'authorization': f"Bearer {token}", 
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
    data = {
        "operationName": "Services",
        "variables": {
            "stackId": stack_id,
            "subscriptionId": subscription_id
        },
        "query": """query Services($stackId: String!, $subscriptionId: String!) {
            container_listService(stackId: $stackId, subscriptionId: $subscriptionId) {
                services {
                    id
                    stackId
                    serviceName
                    image
                    isPrivateRegistry
                    containerRegistry {
                        containerRegistryId
                        containerRegistryProvider
                    }
                    entrypoint
                    status
                    replicas
                    domain {
                        domainName
                        containerPort
                    }
                    mountVolume {
                        volumeId
                        containerPath
                        readOnly
                    }
                    environment {
                        envKey
                        envValue
                    }
                    restartPolicy {
                        condition
                        delay
                        maxAttempt
                        restartWindow
                    }
                    createdAt
                    resource {
                        cpu
                        memory
                    }
                    updatedAt
                }
            }
        }"""
    }
    
    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()  # Raise an error for bad responses
    return response.json()
