import requests

def test():
    print("Logging in...")
    try:
        r = requests.post("http://127.0.0.1:8000/api/auth/jwt/create/", json={"email":"admin@example.com", "password":"admin123"})
        r.raise_for_status()
        data = r.json()
        token = data.get("access")
        print("Token:", token[:10], "...")
        
        r2 = requests.get("http://127.0.0.1:8000/api/auth/users/me/", headers={"Authorization": f"Bearer {token}"})
        r2.raise_for_status()
        print("User data:", r2.json())
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    test()
