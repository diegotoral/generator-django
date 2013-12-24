# -*- coding: utf-8 -*-

from django.conf.urls import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns('',
    # Root URL
    url(r'^/?$', TemplateView.as_view(template_name='home.html'), name='home'),
)
