# MPEC WEB DEMO
### MPEC (Matrix Multiplication Performance Estimator on Cloud)
The proposed algorithm predicts the latency incurred when executing distributed matrix multiplication tasks of various input sizes and shapes with diverse instance types and a different number of worker nodes on cloud computing environments. The NMF algorithm is widely used in recommendation systems. It factorizes an input sparse matrix A into two dense matrices W and H. The following table shows the latency of matrix multiplication when updating the factorized matrix W. Next tables represent three matrix multiplication scenarios in above mentioned it, respectively. In the table, the row shows the ec2 instance types and the columns is meaning of the number of Spark worker nodes.

### PAPER
 - Jeongchul Kim, Myungjun Son, and Kyungyong Lee, "MPEC - Distributed Matrix Multiplication Performance Modeling on a Scale-out Cloud Environment for Data Mining Jobs", IEEE Transactions on Cloud Computing, Accepted, 2019, [pdf](http://leeky.me/publications/mpec-tcc.pdf), [ieee](https://ieeexplore.ieee.org/document/8887190) 
 - Myungjun Son, and Kyungyong Lee, "Distributed Matrix Multiplication Performance Estimator for Machine Learning Jobs in Cloud Computing", IEEE International Conference on Cloud Computing 2018, 07/2018, [pdf](http://leeky.me/publications/cloud_2018.pdf), [ieee](https://ieeexplore.ieee.org/document/8457857)

### SITE
http://mpec.kmubigdata.cloud/

![image](https://user-images.githubusercontent.com/10591350/71336330-fcc90080-2589-11ea-9a47-2a1dbe9a2b1d.png)

### Start Web-server
```shell
$ python manage.py runserver 0:8080 & # background
```

### SETTINGS
#### Library
 - python 2.7
 - scikit-learn 0.20.4 version fixed
 - django 1.11.25
 - numpy, pandas, sqlite, vc, vs2008_runtime, wincertstore certifi

#### Update Front-end
demo/templates/index.html에서 html 페이지 파일이 있으며,
demo/static에서 css, img, js 디렉토리에서 수정합니다.

#### Change HOST address
 - config/settings.py에서 [ALLOWED_HOSTS](https://github.com/kmu-bigdata/mpec-web-demo/blob/a3166a7645637b60108021746fd95e39baa6e2f7/config/settings.py#L28)을 수정합니다.
AWS EC2 사용의 경우 Public URL을 기입합니다.

 - demo/static/js/index.js에서 submitBtn 전송 버튼 관련 [URL](https://github.com/kmu-bigdata/mpec-web-demo/blob/a3166a7645637b60108021746fd95e39baa6e2f7/demo/static/js/index.js#L88)을 EC2 URL, 포트번호, /mpec/predict/를 연결하여 입력합니다.

#### Model
 - mpec/scripts에 MPEC 모델(Gradient Boosting Regressor 3개)의 학습된 모델의 가중치가 gbr_model*.pth에 저장되어 있습니다.
 - 모델을 호출하는 부는 mpec.py에 저장되어 있으며, 입력으로 들어온 왼쪽 행렬과 오른쪽 행렬의 행과 열인 LR, LC, RC를 입력으로 받아 모델의 입력으로 넣을 수 있도록 전처리를 진행하고, 인스턴스 타입 5개와 scale-out을 고려한 서버 대수(4, 9, 16, 25)의 예측 지연 시간을 반환합니다. 

#### Port forwarding
Port forwarding 8080 -> 80 in EC2
```shell
$ iptables -t nat -A OUTPUT -o lo -p tcp --dport 8080 -j REDIRECT --to-port 80
```
