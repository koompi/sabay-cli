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
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')

    # Initialize the WebDriver
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        # Open the login page
        driver.get("https://sso.sabay.com/realms/sabay/protocol/openid-connect/auth?client_id=mysabay_user&redirect_uri=https%3A%2F%2Fmysabay.com%2Fhome&state=51ed87da-5c87-435d-b02d-729e02ae638a&response_mode=fragment&response_type=code&scope=openid&nonce=4b497452-5de7-4ab6-8af6-9e184d10e8d0&code_challenge=0j8z1PnfQioRoEfFix0DEIJASN9vM-LFUs_dybOLw8k&code_challenge_method=S256")

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
        time.sleep(10)  # Adjust as needed

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

# Example usage
if __name__ == "__main__":
    token = get_auth_token("rithythul", "8q$:Mer8?.z#?&i")
    #print("Token:", token)
