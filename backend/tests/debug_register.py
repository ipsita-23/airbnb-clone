import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
email = "e2e_user@example.com"
password = "secret123"

r = client.post('/auth/register', json={"email": email, "password": password})
print('status', r.status_code)
try:
    print('json', r.json())
except Exception:
    print('text', r.text)

# login
r = client.post('/auth/token', json={"email": email, "password": password})
print('login', r.status_code)
try:
    print('login json', r.json())
except Exception:
    print('login text', r.text)

# create listing
listing_data = {"title": "Debug Listing", "description": "desc", "price": 42.0}
r = client.post('/listings/', json=listing_data)
print('create listing', r.status_code)
try:
    print('listing json', r.json())
except Exception:
    print('listing text', r.text)

# book the listing
listing = r.json()
booking_data = {"listing_id": listing['id'], "start_date": "2026-09-01", "end_date": "2026-09-03", "total_price": 84.0}
rb = client.post('/bookings/', json=booking_data)
print('booking', rb.status_code)
try:
    print('booking json', rb.json())
except Exception:
    print('booking text', rb.text)

# payment
rp = client.post('/payments/mock-charge', json={"amount": 84.0})
print('payment', rp.status_code)
try:
    print('payment json', rp.json())
except Exception:
    print('payment text', rp.text)
