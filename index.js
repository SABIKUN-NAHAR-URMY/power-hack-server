const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ho0d8c2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const billingCollection = client.db('billing').collection('allBilling');

        let sortPattern = { dateAndTime: -1 };

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

        // app.get('/products/:categoryID', async (req, res) => {
        //     const id = req.params.categoryID;
        //     const query = { category_id: parseInt(id) };
        //     const result = await watchesProductsCollection.find(query).toArray();
        //     res.send(result);
        // })

        // app.get('/myProducts/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email };
        //     const result = await watchesProductsCollection.find(query).toArray();
        //     res.send(result);
        // })

        // app.delete('/myProducts/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await watchesProductsCollection.deleteOne(query);
        //     const resultData = await advertiseCollection.deleteOne({productId : id});
        //     res.send(resultData);
        // })

        // app.get('/users', async(req, res)=>{
        //     const query = {};
        //     const users = await usersCollection.find(query).toArray();
        //     res.send(users);
        // })

        

        // app.post('/users', async (req, res) => {
        //     const user = req.body;
        //     const query = {
        //         email: user.email,
        //         value: user.value    
        //     }
        //     const alreadySignup = await usersCollection.find(query).toArray();
        //     if (alreadySignup.length) {
        //         return res.send({ acknowledged: false });
        //     }
        //     const result = await usersCollection.insertOne(user);
        //     res.send(result);
        // })

        // app.put('/users/:id', async(req, res)=>{
        //     const id = req.params.id;
        //     const filter = {_id: ObjectId(id)};
        //     const user = req.body;
        //     const option = {upsert : true};
        //     const updateDoc ={
        //         $set: {
        //             status: 'Verified '
        //         }
        //     }
        //     const result = await usersCollection.updateOne(filter, updateDoc, option);
        //     res.send(result);
        // })

        // app.get('/bookings/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const booking = await bookingsCollection.findOne(query);
        //     res.send(booking);
        // })

        

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