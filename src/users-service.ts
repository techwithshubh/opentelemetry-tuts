import init from "./libs/telemetry";
const { tracer } = init("users-service", "0.0.1");

import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";

const app = express();

app.get("/user/:userid", async (request: Request, response: Response) => {
  try {
    const userId = request.params["userid"];
    if (!userId) {
      throw new Error("A really bad error :/");
    }
    const user = {
      userid: userId,
      userName: faker.person.fullName(),
      userPhone: faker.phone.number(),
    };
    response.json(user);
  } catch (e: any) {
    response.sendStatus(500);
  }
});

app.listen(8090);
console.log("users service is up and running on port 8090");
