<!-- # 간단한 부하 테스트 (전에 베이직에서 했던 read me에요. 예시입니당)

## 부하테스트 프로그램 설치

```bash
npm install -g artillery
```

## 테스트 진행 파일 작성

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 20
      arrivalRate: 5
      name: 'TodoService'

scenarios:
  - name: 'get todo'
    flow:
      - get:
          url: '/todo-items'
          headers:
            Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJleGFtcGxlQGV4YW1wbGUuY29tIiwiaWF0IjoxNzIzNDMxMTI2LCJleHAiOjE3MjM0NzQzMjZ9.6V6hRiaKlatPhWBmdGM8TBNBpMJIpgASBKy30xGvhxo'
```

## 테스트 실행

-o: 결과 파일 저장

```bash
artillery run test.yaml -o ./test.json
```

## 결과 확인

```bash
artillery report --output ./report.html ./test.json
```

## 결과 지표

- http.codes.200: 상태 코드가 200(OK)인 HTTP 응답 수
- http.request_rate: 초당 HTTP 요청 수
- http.requests: 총 HTTP 요청 수
- http.response_time: 최소, 최대, 중앙값, 95번째 백분위수 및 99번째 백분위수 응답 시간을 포함한 HTTP 요청의 응답 시간에 대한 통계
- http.responses: 수신된 총 HTTP 응답 수
- vusers.completed: 테스트를 완료한 총 가상 사용자 수
- vusers.created: 테스트 중에 생성된 총 가상 사용자 수
- vusers.created_by_name: test.yaml 파일에 정의된 각 시나리오에 대해 생성된 가상 사용자 수
- vusers.failed: 테스트 중 실패한 총 가상 사용자 수
- vusers.session_length: 최소, 최대, 중앙값, 95번째 백분위수 및 99번째 백분위수 세션 길이를 포함하여 가상 사용자의 세션 길이에 대한 통계 -->
