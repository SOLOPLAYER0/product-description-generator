from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from blip import generate_caption
from main import generate_description

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate")
async def generate(
    file: UploadFile = File(...),
    style: str = Form(...),
    tone: str = Form(...),
    length: str = Form(...)
):
    # Step 1: Read image
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Step 2: BLIP caption
    caption = generate_caption(image)

    # Step 3: Generate description
    result = generate_description(caption, style, tone, length)

    return {
    "description": result
}