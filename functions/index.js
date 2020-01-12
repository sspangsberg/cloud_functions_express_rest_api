const admin = require("firebase-admin");

var serviceAccount = require("./permissions.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://expressjs-cloudfunctions-api.firebaseio.com"
});

const db = admin.firestore();

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

//use app to create route with request (req) and response (res)
//
app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World! and better');
});


// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            await db.collection('products').doc('/' + req.body.id + '/')
                .create({
                    name: req.body.name,
                    description: req.body.description,
                    price: req.body.price
                })

            return res.status(200).send();
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


// read item
app.get('/api/read/:id', (req, res) => {
    (async () => 
    {
        try 
        {
            const document = db.collection('products').doc(req.params.id);
            let product = await document.get();
            let response = product.data();
            return res.status(200).send(response);
        }
        catch (error) 
        {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


// read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('products');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                        price: doc.data().price,
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        }
        catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


// update
app.put('/api/update/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('products').doc(req.params.id);
            await document.update({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


// delete
app.delete('/api/delete/:id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('products').doc(req.params.id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});






exports.app = functions.https.onRequest(app);
