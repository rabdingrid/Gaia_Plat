from fastapi import FastAPI
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

# Fetch configuration from environment variables
PORT = int(os.getenv('PORT', 5000))
HOST = os.getenv('HOST', '0.0.0.0')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# Define a route to show the port information
@app.get('/')
def index():
    return {"message": f"Backend is running on port {PORT}"}

@app.get('/health')
def health():
    return {"status": "healthy", "message": "Backend is running"}

if __name__ == '__main__':
    print(f"Backend is running on port {PORT}")
    print(f"Access the API at http://localhost:{PORT}")
    print(f"API documentation available at http://localhost:{PORT}/docs")
    
    # uvicorn.run("app:app", host=HOST, port=PORT, reload=DEBUG)
