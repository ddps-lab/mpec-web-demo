# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import JsonResponse
from django.shortcuts import render
import os
import sys
import subprocess
import numpy as np

MPEC_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scripts')

# Create your views here.
def add_access_control_headers(response):
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Max-Age"] = "1000"
    response["Access-Control-Allow-Headers"] = "X-Requested-With, Content-Type"
    return response

def execute_command(command):
    try:
        output = subprocess.check_output(command, shell=True)
        return output
    except:
        print("Unexcepted Error:", sys.exc_info())

def predict(request):
    if request.method == 'GET':
        data = request.GET     
        cmd = "cd {} && python mpec.py --lr {} --lc {} --rc {}".format(MPEC_PATH, data['lr'], data['lc'], data['rc'])
        output = execute_command(cmd)
        output = output[1:-3].split(', ')
        return add_access_control_headers(JsonResponse({'status': 0,
                                                        'pred_1': output[ 0:20],
                                                        'pred_2': output[20:40],
                                                        'pred_3': output[40:60]}))
    return add_access_control_headers(JsonResponse({'status': 1}))