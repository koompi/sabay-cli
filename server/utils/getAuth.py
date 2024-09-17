import requests

def get_auth_token(username: str, password: str) -> str:
    # Define the URL and headers
    url = 'https://sso.sabay.com/realms/sabay/protocol/openid-connect/token'
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'CLIENT_SESSION={"verify_url":"https://sso.sabay.com/realms/sabay/protocol/openid-connect/userinfo","redirect_url":"https://merchant-reload.mysabay.com/*","token":"eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0NWgtOXpXc0ZvbHJtOS10RlVjaGZrbWk3aVF3U3RFYmtSLThsUVZTUGVzIn0.eyJleHAiOjE3MjY1NTg1NzgsImlhdCI6MTcyNjU0NDE3OCwianRpIjoiMzliMTJmODgtZDBmNi00NzIwLTljNDgtMjc1ODI5M2Q2Mjg1IiwiaXNzIjoiaHR0cHM6Ly9zc28uc2FiYXkuY29tL3JlYWxtcy9zYWJheSIsInN1YiI6ImY6YTY2YTRhMjYtZmRmZC00ZTk1LTg2YTUtOWVhNDJiY2VmOTNiOnJpdGh5dGh1bCIsInR5cCI6IkJlYXJlciIsImF6cCI6Im15c2FiYXlfdXNlciIsInNlc3Npb25fc3RhdGUiOiJlOGE3NjhlZC1iN2VjLTQ3MzItYTczNy1jYzg1MjExMDFiN2MiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwic2lkIjoiZThhNzY4ZWQtYjdlYy00NzMyLWE3MzctY2M4NTIxMTAxYjdjIiwibXlzYWJheV9lbWFpbF92ZXJpZmllZCI6MSwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV92ZXJpZmllZCI6MSwic2VydmljZV9jb2RlIjoibXlzYWJheV91c2VyIiwicHJlZmVycmVkX3VzZXJuYW1lIjoicml0aHl0aHVsIiwiZGlzcGxheV9uYW1lIjoiICIsInV1aWQiOiJlMGE4ZWZkZi0wMjc0LTQ1MGEtYWUxMy1lOTkwNGI1YmQxNGQiLCJ1c2VybmFtZSI6InJpdGh5dGh1bCIsIm15c2FiYXlfdXNlcl9pZCI6Mzk3NTA3Njl9.Yilp94rddezGmCl7GFa7M2Xv1LV5pDNi9ehi85E4e4oF8jrRQb6203D7uBNs8-UZuq-LGyVoC-KPnii9S1j8NyVneL9VUWwMIhJhLLth3M7EyHxkIClroqfXcZhE3zoWcyDhnjLE9jgn3p4_mnmlKeGQ88t-rruW-f53PJGOqdXS_c2SNX1aNQnentRxIMMNKZKGx1i-1o87b9Nx2rwMuRVND2rayIx5vTzGvVCUA2GXSCGb2u1qjzcUQCAvN5GgKWmOYvBhtiJHHoWgr-T4MjiHMwImhFRpIQ_SqzpqbfF9whs8wW4_aMp2MJX0SqiKGHQjua9VvGMYEgO7R6mPpV"}'
    }

    # Define the payload
    payload = {
        'client_id': 'mysabay_user',
        'grant_type': 'password',
        'scope': 'openid',
        'username': username,
        'password': password
    }

    # Send the POST request
    response = requests.post(url, headers=headers, data=payload)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the response JSON to get the token
        token = response.json().get('access_token')
        if token:
            return token
        else:
            return "Token not found in response"
    else:
        return f"Failed to get token, status code: {response.status_code}, response: {response.text}"




# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.common.by import By
# from selenium.webdriver.common.keys import Keys
# from webdriver_manager.chrome import ChromeDriverManager
# import time

# def get_auth_token(username: str, password: str) -> str:
#     # Configure Chrome options
#     options = Options()
#     options.add_argument('--headless')
#     options.add_argument('--no-sandbox')
#     options.add_argument('--disable-dev-shm-usage')
#     options.add_argument('--disable-cache')  # Disable cache
#     options.add_argument('--incognito')  # Open Chrome in incognito mode
#     options.add_argument('--disable-application-cache')  # Disable app cache


#     # Initialize the WebDriver
#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

#     try:
#         # Open the login page
#         driver.get("https://sso.sabay.com/realms/sabay/protocol/openid-connect/auth?client_id=mysabay_user&redirect_uri=https%3A%2F%2Fmysabay.com%2F&state=f758be16-64bb-4045-8a7b-d3119f58d9d5&response_mode=fragment&response_type=code&scope=openid&nonce=f8dcbfa3-f374-4702-880d-656b30722fe4&code_challenge=Jc1_C0Th4W6phUuUB_fbRatjC5oXrs72x6JPNoMqNKs&code_challenge_method=S256")

#         # Wait for the page to load
#         time.sleep(2)  # Adjust as needed

#         # Fill in the login form
#         username_field = driver.find_element(By.NAME, 'username')
#         password_field = driver.find_element(By.NAME, 'password')

#         username_field.send_keys(username)
#         password_field.send_keys(password)

#         # Submit the form
#         password_field.send_keys(Keys.RETURN)

#         # Wait for the page to load and authentication to complete
#         time.sleep(5)  # Adjust as needed

#         # Switch to the target site where the token is stored
#         driver.get("https://mysabay.com")

#         # Retrieve token from local storage
#         token = driver.execute_script("return localStorage.getItem('token');")

#         if token:
#             return token
#         else:
#             return "Token not found in local storage"
#     finally:
#         driver.quit()
