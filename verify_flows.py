import requests
import json
import time

BASE_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"
DASHBOARD_URL = "http://localhost:3000"

def log(msg, status="INFO"):
    print(f"[{status}] {msg}")

def check_health():
    try:
        # Check backend admin (usually a reliable endpoint)
        r = requests.get(f"{BASE_URL}/admin/")
        if r.status_code == 200:
            log("Backend is UP", "SUCCESS")
        else:
            log(f"Backend returned {r.status_code}", "WARNING")
    except Exception as e:
        log(f"Backend check failed: {e}", "ERROR")

    try:
        r = requests.get(FRONTEND_URL)
        if r.status_code == 200:
            log("Frontend is UP", "SUCCESS")
    except Exception as e:
        log(f"Frontend check failed: {e}", "ERROR")

    try:
        r = requests.get(DASHBOARD_URL)
        if r.status_code == 200:
            log("Dashboard is UP", "SUCCESS")
    except Exception as e:
        log(f"Dashboard check failed: {e}", "ERROR")

def register_user(email, password, first_name="Test", last_name="User"):
    url = f"{BASE_URL}/api/register/"  # Guessing endpoint based on common patterns, will verify
    # If standard dj-rest-auth or similar
    
    # Let's try to look for endpoints first or just try a common one
    # Actually, better to check urls.py first, but I'll try a generic "users" or "register"
    
    # Exploration: try to find the register endpoint
    endpoints = ["/api/users/register/", "/api/auth/registration/", "/api/register/"]
    
    for ep in endpoints:
        try:
            data = {
                "email": email,
                "password": password,
                "first_name": first_name,
                "last_name": last_name,
                "re_password": password # often required
            }
            r = requests.post(f"{BASE_URL}{ep}", json=data)
            if r.status_code in [200, 201]:
                log(f"Registration successful at {ep}", "SUCCESS")
                return True
            else:
                log(f"Registration failed at {ep}: {r.status_code} - {r.text}", "DEBUG")
        except Exception as e:
            log(f"Failed to connect to {ep}", "DEBUG")
    
    return False

if __name__ == "__main__":
    check_health()
    # Attempt registration with a unique email
    timestamp = int(time.time())
    email = f"testuser_{timestamp}@example.com"
    register_user(email, "TestPass123!", "Test", "User")
