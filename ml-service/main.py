from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# allow all origins (safe for local testing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict(data: dict):
    url = data.get("url")
    if not url:
        return {"error": "URL not provided"}
    # your prediction logic here
    return {"result": "Phishing detected" if "login" in url else "Safe"}
