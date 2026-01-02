import requests
import json
import time
import os
import django
import sys
from pathlib import Path

# Setup Django environment to access DB directly
sys.path.append(r'c:\Users\farha\Downloads\Egrly\Graduation_project_ITI_Backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'classifieds.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.products.models import Product

User = get_user_model()

BASE_URL = "http://localhost:8000"

def log(msg, status="INFO"):
    print(f"[{status}] {msg}")

def run_test():
    timestamp = int(time.time())
    email = f"flowtest_{timestamp}@example.com"
    password = "TestPassword123!"
    first_name = "Flow"
    last_name = "Test"

    # 1. Register Request
    log(f"Registering user {email}...", "STEP 1")
    reg_data = {
        "username": email.split('@')[0],
        "email": email,
        "password": password,
        "first_name": first_name,
        "last_name": last_name,
        "re_password": password
    }
    r = requests.post(f"{BASE_URL}/api/users/register_request/", json=reg_data)
    if r.status_code != 201:
        log(f"Registration failed: {r.status_code} - {r.text}", "ERROR")
        return
    log("Registration request sent.", "SUCCESS")

    # 2. Get OTP from DB
    log("Retrieving OTP from DB...", "STEP 2")
    try:
        user = User.objects.get(email=email)
        otp = user.email_otp
        log(f"Found OTP: {otp}", "SUCCESS")
    except User.DoesNotExist:
        log("User not found in DB immediately?", "ERROR")
        return

    # 3. Verify OTP
    log("Verifying OTP...", "STEP 3")
    verify_data = {
        "email": email,
        "otp": otp
    }
    r = requests.post(f"{BASE_URL}/api/users/verify_otp/", json=verify_data)
    if r.status_code != 200:
        log(f"Verification failed: {r.status_code} - {r.text}", "ERROR")
        return
    log("Email verified.", "SUCCESS")

    # 4. Login
    log("Logging in...", "STEP 4")
    login_data = {
        "email": email,
        "password": password
    }
    r = requests.post(f"{BASE_URL}/api/users/token/", json=login_data)
    if r.status_code != 200:
        log(f"Login failed: {r.status_code} - {r.text}", "ERROR")
        return
    
    tokens = r.json()
    access_token = tokens.get('access')
    if not access_token:
        log("No access token in response", "ERROR")
        return
    log("Login successful, token obtained.", "SUCCESS")

    # 5. Post Product
    log("Posting a product...", "STEP 5")
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    # Need to check product model fields. Assuming minimal fields based on common sense, 
    # but I should check apps/products/models.py if this fails.
    # Guessing fields: title, price, description, category (might need ID)
    
    # Let's quickly check category first if possible, or just try id=1
    category_id = 1 
    
    product_data = {
        "title": f"Test Product {timestamp}",
        "description": "This is a test product from the automated flow verification.",
        "price": 99.99,
        "condition": "used", # guess
        "category": category_id,
        "location": "Cairo, Egypt", # guess
        # Add mock image later if needed, but text-only first check
    }
    
    # We might need to handle FormData for images if required, but let's try json first
    # Many Django APIs expect multipart/form-data for images, but JSON for just data if images optional
    r = requests.post(f"{BASE_URL}/api/products/", json=product_data, headers=headers)
    
    if r.status_code not in [200, 201]:
        log(f"Post product failed: {r.status_code} - {r.text}", "WARNING")
        # Try to debug why
        if "category" in r.text:
             log("Category 1 might not exist. Need to seed categories potentially.", "DEBUG")
    else:
        log("Product posted successfully.", "SUCCESS")
        product_json = r.json()
        product_id = product_json.get('id')
        log(f"Created Product ID: {product_id}", "INFO")

    # 6. Check Admin View (Pending Products)
    # Ideally checking via Admin API if accessible, or just DB
    log("Checking DB for pending product...", "STEP 6")
    try:
        if 'product_id' in locals():
            prod = Product.objects.get(id=product_id)
            if prod.status == 'pending':
                log("Product is in 'pending' status as expected.", "SUCCESS")
            else:
                log(f"Product status is {prod.status}, expected 'pending'.", "WARNING")
        else:
            # Check most recent product for this user
            prod = Product.objects.filter(seller=user).last()
            if prod:
                log(f"Found product in DB: {prod.title}, Status: {prod.status}", "SUCCESS")
            else:
                log("Product not found in DB.", "ERROR")
    except Exception as e:
        log(f"DB check failed: {e}", "ERROR")

if __name__ == "__main__":
    try:
        run_test()
    except Exception as e:
        log(f"Test script crashed: {e}", "CRITICAL")
