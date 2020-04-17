import joblib
import numpy as np
import math
import argparse
import json
import os, sys

model1 = joblib.load('/opt/gbr_model1.pth')
model2 = joblib.load('/opt/gbr_model2.pth')
model3 = joblib.load('/opt/gbr_model3.pth')

model1_weight = 0.4
model2_weight = 0.3
model3_weight = 0.3

num_machines = [4, 9, 16, 25]
base_n_blocks = 2
ec2_type = ['r4_2xlarge', 'm4_4xlarge', 'c4_8xlarge', 'i3_2xlarge', 'd2_2xlarge']
maxium_block_size = 16000  # 32000, 4 workers
failed_scenario = []

def generate_features(lr, lc, rc):
    lr = lr * base_n_blocks
    lc = lc * base_n_blocks
    rc = rc * base_n_blocks
    result = []
    # vCPU, cache_size, cpu_mhz, linpack_10k, linpack_20k, network_bandwidth, disk_read_bandwidth, disk_write_bandwidth
    r4_2xlarge = [0, 1, 1, 0, 0.000396, 0.998631, 0, 0]
    m4_4xlarge = [0.285714, 1, 0, 0.257667, 0.231398, 0, 0, 0]
    c4_8xlarge = [1, 0, 0.091575, 1, 1, 0.398098, 0, 0.002937]
    i3_2xlarge = [0, 1, 0.993576, 0.000529, 0, 1, 1, 1]
    d2_2xlarge = [0, 0.25, 0.233743, 0.077934, 0.073961, 0.050272, 0.009654, 0.016153]
    matrix_feature = [float(lr), float(lc), float(rc), float(lr * lc),
                       float(lc * rc), float(lr * rc), float(lr * lc + lc * rc), float(lr * lc * rc)]
    result.append(matrix_feature + r4_2xlarge)
    result.append(matrix_feature + m4_4xlarge)
    result.append(matrix_feature + c4_8xlarge)
    result.append(matrix_feature + i3_2xlarge)
    result.append(matrix_feature + d2_2xlarge)
    return result


def prediction_time(lr, lc, rc):
    test_X = np.array(generate_features(lr, lc, rc))
    pred_y1= model1.predict(test_X)
    pred_y2= model2.predict(test_X)
    pred_y3= model3.predict(test_X)
    pred_y = (pred_y1 * model1_weight + pred_y2 * model2_weight + pred_y3 * model3_weight)
    return pred_y


def get_linear_scaling(lr, lc, rc, n_blocks):
    # matrix fixed size
    lr_block_size = math.ceil(lr/n_blocks)
    lc_block_size = math.ceil(lc/n_blocks)
    rc_block_size = math.ceil(rc/n_blocks)

    if n_blocks in failed_scenario:
        return -1

    pred_y = prediction_time(lr_block_size, lc_block_size, rc_block_size)
    result = pred_y / base_n_blocks * n_blocks / 1000 # linear_scaling, seconds
    return result


def prediction_matrix_multiplication(lr, lc, rc):
    result = np.empty([len(ec2_type), len(num_machines)])
    col_index = 0
    for parallelism in num_machines:
        n_blocks = np.sqrt(parallelism)
        latency = get_linear_scaling(lr, lc, rc, n_blocks)
        result[:,col_index] = latency
        col_index += 1
    return result


def check_failed_scenario(lr, lc, rc):
    for parallelism in num_machines:
        n_blocks = np.sqrt(parallelism)
        lr_block_size = math.ceil(lr/n_blocks)
        lc_block_size = math.ceil(lc/n_blocks)
        rc_block_size = math.ceil(rc/n_blocks)

        # Check maximum block size when Spark executor bring about out of memory error
        #if lr_block_size > maxium_block_size or lc_block_size > maxium_block_size or rc_block_size > maxium_block_size:
        if lr_block_size * lc_block_size > maxium_block_size ** 2 or lc_block_size* rc_block_size > maxium_block_size ** 2 or lr_block_size * rc_block_size > maxium_block_size ** 2:
            failed_scenario.append(n_blocks)

def lambda_handler(event, context):
    lr = int(event["lr"])
    lc = int(event["lc"])
    rc = int(event["rc"])
    
    failed_scenario.clear()
    
    check_failed_scenario(lc, lr, lc)
    check_failed_scenario(lc, lc, rc)
    check_failed_scenario(lc, lr, rc)
    
    result = np.array([prediction_matrix_multiplication(lc, lr, lc), prediction_matrix_multiplication(lc, lc, rc), prediction_matrix_multiplication(lc, lr, rc)])
    transformed_result = result.astype(int).flatten().tolist()
    
    return {
        'status': 0,
        'pred_1' : transformed_result[0:20],
        'pred_2' : transformed_result[20:40],
        'pred_3' : transformed_result[40:60]
    }


