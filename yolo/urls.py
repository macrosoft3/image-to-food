from django.urls import path
from django.views.generic import TemplateView

from . import views

urlpatterns = [
    path("", TemplateView.as_view(template_name="yolo/index.html")),
    path("post/", views.YOLO_view, name="post"),
]
