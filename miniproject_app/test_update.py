import requests

def test():
    # Login as admin
    r = requests.post("http://127.0.0.1:8000/api/auth/jwt/create/", json={"email":"admin@example.com", "password":"admin123"})
    token = r.json()["access"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get all users
    r2 = requests.get("http://127.0.0.1:8000/api/users/all/", headers=headers)
    users = r2.json()
    print("Found users:", len(users))
    
    # Find a patient
    patient = next(u for u in users if u["role"] == "Patient")
    print("Testing update on:", patient)
    
    # Update to Doctor
    patient["role"] = "Doctor"
    patient["status"] = "Inactive"
    patient["name"] = "Testing Update Name"
    
    r3 = requests.put(f"http://127.0.0.1:8000/api/users/manage/{patient['id']}/", json=patient, headers=headers)
    print("Update status:", r3.status_code, r3.json())
    
    # Verify update
    r4 = requests.get("http://127.0.0.1:8000/api/users/all/", headers=headers)
    updated_patient = next(u for u in r4.json() if u["id"] == patient["id"])
    print("After update:", updated_patient)

if __name__ == "__main__":
    test()
