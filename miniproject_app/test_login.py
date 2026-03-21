import requests
res1 = requests.post('http://127.0.0.1:8000/api/auth/jwt/create/', json={"email": "patient1@example.com", "password": "patient123"})
print("Token status:", res1.status_code, res1.json())
if 'access' in res1.json():
    access = res1.json()['access']
    res2 = requests.get('http://127.0.0.1:8000/api/auth/users/me/', headers={"Authorization": f"Bearer {access}"})
    print("User Me status:", res2.status_code, res2.json())
