import axios from 'axios';
import express, { Request, Response } from 'express';
import { faker } from '@faker-js/faker';

const app = express();

app.get('/order', async (request:Request, response:Response) => {
    try {

        const userId = request.get("X-User-Id")
        if (!userId) {
            throw new Error('A really bad error :/')
        }
        const user = await axios.get(`http://localhost:8090/user/${userId}`);
        
        const order = {
            productName: faker.commerce.productName(),
            productDescription: faker.commerce.productDescription(),
            price: faker.commerce.price()
        }
        response.json(Object.assign(order, user.data));
    } catch (e:any) {
        response.sendStatus(500);
    }
})

app.listen(8080);
console.log('order service is up and running on port 8080');
