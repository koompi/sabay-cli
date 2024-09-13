import requests

def update_stack(stackId, token):
    graphql_endpoint = 'https://gateway.sabay.com/graphql'
    graphql_query = {
        "operationName": "updateStack",
        "variables": {
            "input": {
                "stackId": stackId,
                "services": [],
                "pullImage": True
            },
            "subscriptionId": "66bc781bbf70dc939b5894a8"
        },
        "query": """
        mutation updateStack($subscriptionId: String!, $input: container_UpdateStackInput!) {
            container_updateStack(subscriptionId: $subscriptionId, input: $input) {
                message
                success
                __typename
            }
        }
        """
    }

    response = requests.post(
        graphql_endpoint,
        json=graphql_query,
        headers={
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "content-type": "application/json",
            "service-code": "mysabay_user",
            "authorization": f"Bearer {token}",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site",
            "Priority": "u=0"
        }
    )

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to update stack: {response.status_code} {response.text}")