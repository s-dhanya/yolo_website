import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# ---- Load same architecture you trained ----
def load_model(weights_path, num_classes=9):
    model = models.mobilenet_v3_small(weights="IMAGENET1K_V1")
    model.classifier[3] = nn.Linear(model.classifier[3].in_features, num_classes)

    model.load_state_dict(torch.load(weights_path, map_location="cpu"))
    model.eval()
    return model

model = load_model("best_model.pth")

# Same preprocessing as in training
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406], [0.229,0.224,0.225])
])

class_names = [
    "Algal leaves spot",
    "Disease free",
    "Dry leaves",
    "Healthy fruit",
    "Insects eaten",
    "Phytopthora",
    "Red Rust",
    "Scab",
    "Styler and Root"
]

def predict(image: Image.Image):
    img = transform(image).unsqueeze(0)
    with torch.no_grad():
        outputs = model(img)
        _, pred = torch.max(outputs, 1)
        return class_names[pred.item()]
