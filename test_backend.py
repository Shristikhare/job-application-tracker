from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)
health = client.get('/health')
print(f'Health: {health.status_code}')
reg = client.post('/api/auth/register', json={'name': 'Test', 'email': 'test@test.com', 'password': 'Test123'})
print(f'Register: {reg.status_code}')
