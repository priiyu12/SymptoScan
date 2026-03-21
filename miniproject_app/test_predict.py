import requests

def test_prediction():
    # 1. Login to get token
    login_data = {
        "email": "patient1@example.com",
        "password": "patient123"
    }
    print("Logging in...")
    login_res = requests.post("http://127.0.0.1:8000/api/auth/jwt/create/", json=login_data)
    
    if login_res.status_code != 200:
        print(f"Login failed: {login_res.text}")
        return
        
    token = login_res.json().get('access')
    print("Login successful, making prediction...")

    # 2. Test prediction
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    payload = {
        "high_fever": 1,
        "cough": 1
    }
    
    predict_res = requests.post("http://127.0.0.1:8000/api/predict/", json=payload, headers=headers)
    print(f"Status Code: {predict_res.status_code}")
    print(f"Response: {predict_res.text}")

if __name__ == "__main__":
    test_prediction()
