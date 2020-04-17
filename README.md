# MPEC WEB DEMO
### MPEC (Matrix Multiplication Performance Estimator on Cloud)
The proposed algorithm predicts the latency incurred when executing distributed matrix multiplication tasks of various input sizes and shapes with diverse instance types and a different number of worker nodes on cloud computing environments. The NMF algorithm is widely used in recommendation systems. It factorizes an input sparse matrix A into two dense matrices W and H. The following table shows the latency of matrix multiplication when updating the factorized matrix W. Next tables represent three matrix multiplication scenarios in above mentioned it, respectively. In the table, the row shows the ec2 instance types and the columns is meaning of the number of Spark worker nodes.

### PAPER
 - Jeongchul Kim, Myungjun Son, and Kyungyong Lee, "MPEC - Distributed Matrix Multiplication Performance Modeling on a Scale-out Cloud Environment for Data Mining Jobs", IEEE Transactions on Cloud Computing, Accepted, 2019, [pdf](http://leeky.me/publications/mpec-tcc.pdf), [ieee](https://ieeexplore.ieee.org/document/8887190) 
 - Myungjun Son, and Kyungyong Lee, "Distributed Matrix Multiplication Performance Estimator for Machine Learning Jobs in Cloud Computing", IEEE International Conference on Cloud Computing 2018, 07/2018, [pdf](http://leeky.me/publications/cloud_2018.pdf), [ieee](https://ieeexplore.ieee.org/document/8457857)

### SITE
http://mpec.kmubigdata.cloud/

![image](https://user-images.githubusercontent.com/10591350/71336330-fcc90080-2589-11ea-9a47-2a1dbe9a2b1d.png)

### Settings on AWS
- Upload index.html and files in static folders to S3 and enable static file hositng
- Create a lambda function with lambda_function.py
- Create API Gateway to connect to Lambda function
- If needed, update the API Gateway address in static/js/index.js
- If needed, enable CORS in API Gateway
- All the environments are set up in us-west-2 of bigdata+prod@ account

#### Model
 - mpec/scripts에 MPEC 모델(Gradient Boosting Regressor 3개)의 학습된 모델의 가중치가 gbr_model*.pth에 저장되어 있습니다.
 - 모델을 호출하는 부는 mpec.py에 저장되어 있으며, 입력으로 들어온 왼쪽 행렬과 오른쪽 행렬의 행과 열인 LR, LC, RC를 입력으로 받아 모델의 입력으로 넣을 수 있도록 전처리를 진행하고, 인스턴스 타입 5개와 scale-out을 고려한 서버 대수(4, 9, 16, 25)의 예측 지연 시간을 반환합니다. 
 - model is located in Us-West-2 region in Lambda layer (mpec-models)
