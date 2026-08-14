import json
import os
import tempfile
from uuid import uuid4
from fastapi.testclient import TestClient

from main import app


def test_register_login_create_book_flow():
    client = TestClient(app)
    email = f"e2e_user_{uuid4().hex}@example.com"
    password = "secret123"

    # register
    r = client.post('/auth/register', json={"email": email, "password": password})
    assert r.status_code == 200

    # login
    r = client.post('/auth/token', json={"email": email, "password": password})
    assert r.status_code == 200

    # create listing
    listing_data = {"title": "E2E Test Listing", "description": "desc", "price": 42.0}
    r = client.post('/listings/', json=listing_data)
    assert r.status_code == 200
    listing = r.json()

    # book the listing
    booking_data = {"listing_id": listing['id'], "start_date": "2026-09-01", "end_date": "2026-09-03", "total_price": 84.0}
    r = client.post('/bookings/', json=booking_data)
    assert r.status_code == 200

    # mock payment
    r = client.post('/payments/mock-charge', params={"amount": 84.0})
    assert r.status_code == 200
    assert r.json().get('status') == 'succeeded'
