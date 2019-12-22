from django.conf import settings
from django.conf.urls import url, include
from django.conf.urls.static import static
from . import views

urlpatterns=[
    url(r'^predict/$', views.predict, name='predict'),
    url(r'^$',         views.predict, name='predict'),
]