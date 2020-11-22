const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const port = 4000
const app = express();
app.use(bodyParser.json());
app.use(cors());


console.log("success")

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkdxj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// the Main code starts here
client.connect(err => {
  const noteCollection = client.db("onlineDiary").collection("Note");
  console.log("Db Connected Successfully");

   //  ADDING Notes
   app.post('/allNotes', (req, res) => {
    const notes = req.body;
    console.log(notes);
    noteCollection.insertOne(notes)
      .then(result => {
        // console.log(result);
        res.status(200).send(result.insertedCount > 0);
      })
  })
  // ends here

  //Getting Notes
  app.get('/allNotes', (req,res) =>{
    noteCollection.find({ })
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  // ends here

//edit note
app.get('/allNotes/:id', (req, res) => {
  // console.log(req.params.id);
  noteCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
          res.send(documents[0]);
      })
})
app.patch('/update/:id', (req, res) => {
  console.log(req.params.id)
  noteCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
          $set: { date: req.body.date, note: req.body.note }
      }
  )
      .then(result => {
        console.log(result)
          res.send(result.modifiedCount > 0)
      })
})
//ends here

  //delete note
  app.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    noteCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then((result) => {
            console.log(result)
            res.send(result.deletedCount > 0);
        })
})
//ends here


});


app.get('/', (req, res) => {
    res.send("Hello from online diary db. It works perfectly up to now!")
  })
  app.listen(process.env.PORT || port);