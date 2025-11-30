import asyncio
import base64
import io

from django.http import JsonResponse
from django.shortcuts import render
from PIL import Image
from ultralytics import YOLO


# Create your views here.
async def YOLO_view(request):
    try:
        # Do some work
        file = request.FILES["user-pic"]
        image = Image.open(file)

        model = YOLO("yolov8x-oiv7.pt")
        results = model(image)
        result = results[0]
        # boxes = result.boxes
        # masks = result.masks
        plot = result.plot()

        buffer = io.BytesIO()
        plot = Image.fromarray(plot[:, :, ::-1])
        plot.save(buffer, format="PNG")
        data = base64.b64encode(buffer.getvalue())
        data = data.decode()

        response = {"URI": f"data:image/png;base64,{data}"}
        return JsonResponse(response)
    except asyncio.CancelledError:
        # Handle disconnect
        raise
