from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time

def get_auth_token(username: str, password: str) -> str:
    # Configure Chrome options
    options = Options()
  #  options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-cache')  # Disable cache
    options.add_argument('--incognito')  # Open Chrome in incognito mode
    options.add_argument('--disable-application-cache')  # Disable app cache


    # Initialize the WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        # Open the login page
        driver.get("https://sso.sabay.com/realms/sabay/protocol/openid-connect/auth?client_id=mysabay_user&redirect_uri=https%3A%2F%2Fmysabay.com%2F&state=f758be16-64bb-4045-8a7b-d3119f58d9d5&response_mode=fragment&response_type=code&scope=openid&nonce=f8dcbfa3-f374-4702-880d-656b30722fe4&code_challenge=Jc1_C0Th4W6phUuUB_fbRatjC5oXrs72x6JPNoMqNKs&code_challenge_method=S256")

        # Wait for the page to load
        time.sleep(5)  # Adjust as needed

        # Fill in the login form
        username_field = driver.find_element(By.NAME, 'username')
        password_field = driver.find_element(By.NAME, 'password')

        username_field.send_keys(username)
        password_field.send_keys(password)

        # Submit the form
        password_field.send_keys(Keys.RETURN)

        # Wait for the page to load and authentication to complete
        time.sleep(5)  # Adjust as needed

        # Switch to the target site where the token is stored
        driver.get("https://mysabay.com")

        # Retrieve token from local storage
        token = driver.execute_script("return localStorage.getItem('token');")

        if token:
            return token
        else:
            return "Token not found in local storage"
    finally:
        driver.quit()
