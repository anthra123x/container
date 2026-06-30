import http from "k6/http"
import { check, sleep, group } from "k6"
import { Rate, Trend } from "k6/metrics"

const BASE_URL = __ENV.BASE_URL ?? "http://localhost:3000"

const errorRate = new Rate("errors")
const productPageTrend = new Trend("product_page_duration")
const homePageTrend = new Trend("home_page_duration")

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 20 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    errors: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"],
    product_page_duration: ["p(95)<3000"],
    home_page_duration: ["p(95)<2000"],
  },
}

export default function () {
  group("homepage", () => {
    const res = http.get(`${BASE_URL}/`)
    const passed = check(res, { "status 200": (r) => r.status === 200 })
    errorRate.add(!passed)
    homePageTrend.add(res.timings.duration)
    sleep(1)
  })

  group("products", () => {
    const res = http.get(`${BASE_URL}/productos`)
    const passed = check(res, { "status 200": (r) => r.status === 200 })
    errorRate.add(!passed)
    productPageTrend.add(res.timings.duration)
    sleep(1)
  })

  group("health", () => {
    const res = http.get(`${BASE_URL}/api/health`)
    check(res, { "health ok": (r) => r.json("status") === "ok" })
    errorRate.add(res.status !== 200)
    sleep(0.5)
  })
}
