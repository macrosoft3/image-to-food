import base64
import io
from typing import List, Optional

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.cache import cache_page
from django.views.decorators.csrf import csrf_protect
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image
from pydantic import BaseModel, Field
from ultralytics import YOLO

load_dotenv()


class Ingredient(BaseModel):
    name: str = Field(description="Name of the ingredient.")
    quantity: str = Field(description="Quantity of the ingredient, including units.")


class Recipe(BaseModel):
    recipe_name: str = Field(description="The name of the recipe.")
    prep_time_minutes: Optional[int] = Field(
        description="Optional time in minutes to prepare the recipe."
    )
    ingredients: List[Ingredient]
    instructions: List[str]


client = genai.Client()
model = YOLO("yolov8x-oiv7.pt")


# Create your views here.
@cache_page(60 * 15)
@csrf_protect
def YOLO_view(request):
    try:
        # Do some work
        file = request.FILES["user-pic"]
        image = Image.open(file)

        results = model(image)
        result = results[0]
        boxes = result.boxes
        # masks = result.masks
        plot = result.plot()

        labels = boxes.cls
        labels = labels.tolist()
        labels = list(map(int, labels))
        names = model.names
        labels = [names[label] for label in labels]

        buffer = io.BytesIO()
        plot = Image.fromarray(plot[:, :, ::-1])
        plot.save(buffer, "PNG", optimize=True, quality=80)
        data = base64.b64encode(buffer.getvalue())
        data = data.decode()

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                "You will be provided with ingredients, and your task is to generate recipe names and recipe.",
                labels,
            ],
            config=types.GenerateContentConfig(
                system_instruction=["You are a chef.", "Respond in Japanese."],
                response_mime_type="application/json",
                response_json_schema=Recipe.model_json_schema(),
            ),
        )

        recipe = Recipe.model_validate_json(response.text)
        print(recipe)

        response = {
            "URI": f"data:image/png;base64,{data}",
            "recipe": recipe.model_dump(),
        }
        return JsonResponse(response)
    except Exception:
        # Handle disconnect
        raise
