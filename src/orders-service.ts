import init from "./libs/telemetry";
const { tracer } = init("orders-service", "0.0.1");

import axios from "axios";
import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { context, trace } from "@opentelemetry/api";
import { logger } from "./libs/logging";

const app = express();

app.get("/order", async (request: Request, response: Response) => {
  try {
    const userId = request.get("X-User-Id");
    if (!userId) {
      throw new Error("A really bad error :/");
    }

    const activeSpan = trace.getSpan(context.active())

    activeSpan?.setAttribute("custom.user.id", userId)
    logger.log("info", "fetching user details for "+ userId)
    const user = await axios.get(`http://localhost:8090/user/${userId}`);
    logger.log("info", "user fetched successfully")
    activeSpan?.addEvent("User generated successfully")

    const order = {
      productName: faker.commerce.productName(),
      productDescription: faker.commerce.productDescription(),
      price: faker.commerce.price(),
    };
    response.json(Object.assign(order, user.data));
  } catch (e: any) {
    response.sendStatus(500);
  }
});

app.listen(8080);
console.log("order service is up and running on port 8080");
