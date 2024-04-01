import init from "./libs/telemetry";
const { tracer,propagator } = init("orders-service", "0.0.1");

import axios from "axios";
import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { ROOT_CONTEXT, Span, SpanKind, defaultTextMapSetter,trace } from "@opentelemetry/api";
import {
  SEMATTRS_HTTP_METHOD,
  SEMATTRS_HTTP_ROUTE,
} from "@opentelemetry/semantic-conventions";

const app = express();

app.get("/order", async (request: Request, response: Response) => {
  tracer.startActiveSpan(
    "Get Order Details",
    { kind: SpanKind.CLIENT },
    async (span: Span) => {
      try {
        const userId = request.get("X-User-Id");
        if (!userId) {
          throw new Error("A really bad error :/");
        }
        span.setAttribute(SEMATTRS_HTTP_METHOD, "GET");
        span.setAttribute(SEMATTRS_HTTP_ROUTE, `/user/${userId}`);
        span.addEvent("Calling Users Service")

        const carrier = {}

        propagator.inject(
            trace.setSpanContext(ROOT_CONTEXT, span.spanContext()),
            carrier,
            defaultTextMapSetter
        );

        const user = await axios.get(`http://localhost:8090/user/${userId}`, {
            headers: {
                'TraceContext': JSON.stringify(carrier)
            }
        });

        const order = {
          productName: faker.commerce.productName(),
          productDescription: faker.commerce.productDescription(),
          price: faker.commerce.price(),
        };
        span.setStatus({
          code: user.status,
        });
        span.end();
        response.json(Object.assign(order, user.data));
      } catch (e: any) {
        span.recordException(e);
        span.end()
        response.sendStatus(500);
      }
    }
  );
});

app.listen(8080);
console.log("order service is up and running on port 8080");
