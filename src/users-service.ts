import init from "./libs/telemetry";
const { tracer, propagator } = init("users-service", "0.0.1");

import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import {
  ROOT_CONTEXT,
  Span,
  SpanKind,
  defaultTextMapGetter,
} from "@opentelemetry/api";

const app = express();

app.get("/user/:userid", async (request: Request, response: Response) => {
  const traceparent = request.get("TraceContext") || "";
  console.log(traceparent)
  const parentCtx = propagator.extract(
    ROOT_CONTEXT,
    JSON.parse(traceparent),
    defaultTextMapGetter
  );

  tracer.startActiveSpan(
    "Get User Details",
    { kind: SpanKind.SERVER },
    parentCtx,
    async (span: Span) => {
      try {
        const userId = request.params["userid"];
        if (!userId) {
          throw new Error("A really bad error :/");
        }
        span.setAttribute("user.id", userId);
        const user = {
          userid: userId,
          userName: faker.person.fullName(),
          userPhone: faker.phone.number(),
        };
        span.addEvent(`User with ${userId} generated`);
        span.end();
        response.json(user);
      } catch (e: any) {
        span.recordException(e);
        span.end();
        response.sendStatus(500);
      }
    }
  );
});

app.listen(8090);
console.log("users service is up and running on port 8090");
