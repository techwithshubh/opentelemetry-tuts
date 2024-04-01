# Open Telemetry - Nodejs, Express and Signoz Example

- Node Version - 18.14.0

**Running in Local**

1. `npm install`
2. `npm run orders`
3. In another terminal `npm run users`
4. Example GET request 

```bash
curl  -X GET \
  'http://localhost:8080/order' \
  --header 'Accept: */*' \
  --header 'X-User-Id: 1'
```

5. If you are not passing `X-User-Id` header, above REST API will fail with `500` status.