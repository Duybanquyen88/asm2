// server.js
//console.log('May Node be with you')

const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://duyk3:duy1234@cluster0.ktplpdg.mongodb.net/'

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        
        // (1a) CREATE: client -> create -> database -> 'star-wars-quotes'
        // -> create -> collection -> 'quotes'
        const db = client.db('Toylist')
        const quotesCollection = db.collection('quotes')
        const Toy = db.collection("Toy")
        
        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs') 
        
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // To make the 'public' folder accessible to the public
        app.use(express.static('public'))

        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'quotes' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { quotes: results })
                })
                .catch(/* ... */)
        })
        app.get('/admin',(req,res)=>{
            res.render('ADMIN.ejs')
        })

        app.get('/user',(req,res)=>{
            db.collection("Toy").find().toArray()
                .then(result => {
                    res.render('USER.ejs', {products: result})
                })
            // res.render('USER.ejs')
        })


        app.get('/addnew',(req,res)=>{
            db.collection('Toy').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('add.ejs', { Toy: results })
                })
                .catch(/* ... */)
        })
        app.post('/add', (req, res) => {
            Toy.insertOne(req.body)
            .then(result => {
                console.log("HHHH")
                // results -> server -> console
                console.log(result)
    
                // -> redirect -> '/'
                
                res.redirect('/USER')
             })
            .catch(error => console.error(error))
        })

        //
        app.get('/search',(req,res)=>{
            res.render('search.ejs')
        })
        app.post('/find',async (req,res)=>{
            // console.log("SADSADDSAD")
            console.log(req.body.name)
            const Check = await Toy.findOne({name:req.body.name})
            if(Check){
                db.collection('Toy').find({name:req.body.name}).toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)
                    
                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('Result.ejs', { Toy: results })
                })
                .catch(/* ... */)
            }else{
                res.send("NOT FOUND")
            }
        })




        //
        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        // -> post -> '/quotes' -> collection -> insert -> result
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
            .then(result => {
                
                // results -> server -> console
                console.log(result)

                // -> redirect -> '/'
                res.redirect('/')
             })
            .catch(error => console.error(error))
        })
        
        // server -> listen -> port -> 3000
        app.listen(3000, function() {
            console.log('listening on 3000')
        })
    })


