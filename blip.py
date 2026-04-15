from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

print("🔥 Loading BLIP model...")

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

print("✅ BLIP model loaded!")

def generate_caption(image: Image.Image):
    inputs = processor(images=image, return_tensors="pt")
    output = model.generate(**inputs)
    caption = processor.decode(output[0], skip_special_tokens=True)
    print("CAPTION:", caption)
    return caption