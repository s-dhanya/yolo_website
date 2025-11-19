from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from model import predict
from PIL import Image
import io

app = FastAPI()

# Allow React frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def classify_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    result = predict(image)
    return {"prediction": result}
