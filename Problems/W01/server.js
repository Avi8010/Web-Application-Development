const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const path = require('path')

const PORT = 3000

const app = express();

app.set("view engine", "ejs");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

const conn = mongoose.connection;

mongoose.connect("mongodb://127.0.0.1/student", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("connected to mongo successfully");
}).catch((err) => {
    console.log("error in connecting->", err);
    process.exit();
});


const Studentschema = mongoose.Schema({
    Name: String,
    Roll_No: Number,
    WAD_Marks: Number,
    CC_Marks: Number,
    DSBDA_Marks: Number,
    CNS_Marks: Number,
    AI_Marks: Number,
});

const Studentdata = mongoose.model('students', Studentschema);

app.get('/', (req, res) => {
    res.render("result");
})

app.post("/add", cors(), async (req, res) => {
    console.log(req.body);
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            console.log("body is empty");
            res.status(400).send("body is empty");
            return;
        }
        const stud = {
            Name: req.body.Name,
            Roll_No: req.body.Roll_No,
            WAD_Marks: req.body.WAD_Marks,
            CC_Marks: req.body.CC_Marks,
            DSBDA_Marks: req.body.DSBDA_Marks,
            CNS_Marks: req.body.CNS_Marks,
            AI_Marks: req.body.AI_Marks
        }
        conn.collection("students").insertOne(stud);
        console.log(stud);
        res.status(201).send(stud);
    }
    catch (err) {
        console.log(err);
        res.status(500).send();

    }
});


const metadata = []


app.get("/studentsall", async (req, res) => {
    console.log("finding student")
    const data = await Studentdata.find()
    // .toArray((err, data) => {
    res.json(data);
    for (let i = 0; i < data.length; i++) {
        metadata[i] = data[i];
        console.log(metadata[i] + "******");
    }
    // });
    console.log("end")
});

app.get("/students", async (req, res) => {
    console.log("finding student")
    const data = await Studentdata.find()
    // .toArray((err, data) => {
    res.json(data.length);
    console.log(data.length);
    // });
    console.log("end")
});

app.get("/dsbda20", async (req, res) => {
    const da = await conn.collection('students').findOneAndUpdate(
        { DSBDA_Marks: 33 }, { $set: { Roll_No: 50 } }
    );
    res.json(da);
    console.log(da);
    // });
    console.log("end")
});

// delete any student
app.post('/deleteStudent/:id', (req, res) => {
    student.findByIdAndDelete(req.params.id).then((student) => {
        res.redirect('/students');
    }).catch((err) => {
        res.json({ "error": err });
    })
});

// update any student
app.get('/updateStudent', (req, res) => {
    var id = req.query['rollNo'];
    var marks = parseInt(req.query['marks']);
    student.findOneAndUpdate({ "Roll_No": id }, { $inc: { "WAD_Marks": marks, "DSBDA_Marks": marks, "CC_Marks": marks, "CNS_Marks": marks, "AI_Marks": marks } }).then(() => {
        res.redirect('/students');
    }).catch((err) => {
        res.json({ "error": err });
    });
});


app.listen(PORT, () => {

    console.log(`server is listening at http://localhost:${PORT}`)
}
)
