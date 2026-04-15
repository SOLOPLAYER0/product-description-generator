import requests
import os
from dotenv import load_dotenv
from PIL import Image
import io

load_dotenv()

HF_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

API_URL = "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}"
}


def generate_caption(image: Image.Image):
    # Convert PIL image to bytes
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_bytes = buffered.getvalue()

    response = requests.post(API_URL, headers=headers, data=img_bytes)

    if response.status_code != 200:
        print("HF API Error:", response.text)
        return "a product image"

    result = response.json()

    caption = result[0]["generated_text"]
    print("CAPTION:", caption)

    return caption