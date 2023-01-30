const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho0d8c2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         res.status(401).send({ message: 'Unauthorized access' })
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, function (err, decoded) {
//         if (err) {
//             res.status(401).send({ message: 'Unauthorized access' });
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

async function run() {
    try {
        const billingCollection = client.db('billing').collection('allBilling');
        const usersCollection = client.db('billing').collection('users');
        
        let sortPattern = { dateAndTime: -1 };

        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_SECRET_TOKEN, { expiresIn: '1d' });
        //     res.send({ token });
        // })

        app.get('/billing-list', async (req, res) => {
            const query = {};
            const result = billingCollection.find(query).sort(sortPattern);
            const billingList = await result.toArray();
            res.send(billingList);
        })

        app.post('/add-billing', async (req, res) => {
            const bill = req.body;
            const result = await billingCollection.insertOne(bill);
            res.send(result);
        });

        app.get('/update-billing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const updateDataItem = await billingCollection.findOne(query);
            res.send(updateDataItem);
        })

        app.patch('/update-billing/:id', async (req, res) => {
            const id = req.params.id;
            const fullName = req.body.fullName;
            const email = req.body.email;
            const phone = req.body.phone;
            const paidAmount = req.body.paidAmount;
            const query = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    fullName: fullName,
                    email: email,
                    phone: phone,
                    paidAmount: paidAmount
                }
            }
            const result = await billingCollection.updateOne(query, updateDoc);
            res.send(result);

        })

        app.delete('/delete-billing/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await billingCollection.deleteOne(query);
            res.send(result);

        })

        app.get('/users', async (req, res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/registration', async (req, res) => {
            const registration = req.body;
            const query = {
                email: registration.email,
                password: registration.password
            }
            const alreadyRegister = await usersCollection.find(query).toArray();
            if (alreadyRegister.length) {
                return res.send({ acknowledged: false });
            }
            const result = await usersCollection.insertOne(registration);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(error => console.error(error));

app.get('/', (req, res) => {
    res.send('Power-Hack server is running')
})

app.listen(port, () => {
    console.log(`Power-Hack listening on port ${port}`)
});