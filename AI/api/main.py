import requests
from keras.models import load_model
from keras.preprocessing.image import img_to_array
from fastapi import FastAPI, Form, Query, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io

app = FastAPI()

# Allow frontend from any origin (temporary for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
model_path = "./facecheck_final.keras"
model = load_model(model_path)

@app.get("/")
def read_root():
    return {"message": "FaceCheck.AI API is running"}

@app.post("/predict/file")                  
async def predict_file(file: UploadFile = File(...)):
    try:
        uploaded_img = Image.open(file.file).convert("RGB")
        img = uploaded_img.resize((160, 160))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        prediction = model.predict(img_array, verbose=0)[0][0]
        real_percentage = prediction * 100
        fake_percentage = (1 - prediction) * 100
        classification = "Real" if prediction > 0.5 else "Fake"
        confidence = max(fake_percentage, real_percentage)

        return {
            "classification": classification,
            "confidence": float(round(confidence, 2)),
            "real_percentage": float(round(real_percentage, 2)),
            "fake_percentage": float(round(fake_percentage, 2)),
            "raw_prediction": float(prediction),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {e}")

@app.post("/predict/url")
async def predict_url(url: str = Form(...)):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        img = Image.open(io.BytesIO(response.content)).convert("RGB")
        img = img.resize((160, 160))
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        prediction = model.predict(img_array, verbose=0)[0][0]
        real_percentage = prediction * 100
        fake_percentage = (1 - prediction) * 100
        classification = "Real" if prediction > 0.5 else "Fake"
        confidence = max(fake_percentage, real_percentage)

        return {
            "classification": classification,
            "confidence": float(round(confidence, 2)),
            "real_percentage": float(round(real_percentage, 2)),
            "fake_percentage": float(round(fake_percentage, 2)),
            "raw_prediction": float(prediction),
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"URL prediction failed: {e}")