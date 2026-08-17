from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

# Register
reg = client.post('/api/auth/register', json={'name': 'CSV User', 'email': 'csvuser@test.com', 'password': 'Test123'})
print(f'Register: {reg.status_code}')

# Login
login = client.post('/api/auth/login', data={'username': 'csvuser@test.com', 'password': 'Test123'})
token = login.json()['access_token']
print(f'Login: {login.status_code}')

# Create application
create = client.post('/api/applications/', json={
    'company': 'Tech Corp',
    'role': 'Backend Engineer',
    'location': 'San Francisco',
    'job_url': 'https://example.com/jobs/1',
    'salary': 150000,
    'applied_date': '2026-08-15',
    'status': 'Interview',
    'notes': 'Good opportunity'
}, headers={'Authorization': f'Bearer {token}'})
print(f'Create app: {create.status_code}')

# Test CSV export
csv_export = client.get('/api/applications/export/csv', headers={'Authorization': f'Bearer {token}'})
print(f'CSV export: {csv_export.status_code}')
print(f'CSV headers: {csv_export.headers.get("content-type")}')
print(f'CSV content preview:\n{csv_export.text[:200]}...')
