# utils/listStack.py
import requests

def list_stacks(token):
    """Fetch the list of stacks from the external service."""
    graphql_endpoint = 'https://gateway.sabay.com/graphql'
    graphql_query = {
        "operationName": "getListStack",
        "variables": {
            "subscriptionId": "66bc781bbf70dc939b5894a8"
        },
        "query": """
        query getListStack($subscriptionId: String!, $pager: container_PagerInput) {
            container_listStack(subscriptionId: $subscriptionId, pager: $pager) {
                stacks {
                    id
                    subscriptionId
                    stackName
                    status
                    environment {
                        envKey
                        envValue
                        __typename
                    }
                    createdAt
                    updatedAt
                    numberOfService
                    __typename
                }
                pagination {
                    currentPage
                    lastPage
                    from
                    perPage
                    to
                    total
                    __typename
                }
                __typename
            }
        }
        """
    }

    try:
        response = requests.post(
            graphql_endpoint,
            json=graphql_query,
            headers={
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                "Accept": "*/*",
                "Accept-Language": "en-US,en;q=0.9",
                "content-type": "application/json",
                "authorization": f"Bearer {token}",
                "origin": "https://mysabay.com",
                "referer": "https://mysabay.com/",
                "service-code": "mysabay_user",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            }
        )
        return response.json()
    except Exception as e:
        raise Exception(f"Failed to list stacks: {str(e)}")
