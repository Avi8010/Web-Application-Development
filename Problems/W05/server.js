const express = require('express')
const mongoose = require('mongoose')

const app = express();
app.use(express.json());

const PORT = 3000
const url = "mongodb+srv://admin:admin@cluster0.penbhea.mongodb.net/music?retryWrites=true&w=majority"

const conn = mongoose.connection;

mongoose.connect(url).then(() => {
    console.log("connected to database successfully")
}).catch((err) => {
    console.log("errrrrrrrrrrrrrror")
})


const Songdetailschema = new mongoose.Schema({
    songname: String,
    Film: String,
    Music_director: String,
    singer: String,
})

const songdetails = mongoose.model('songdetails', Songdetailschema)


app.post("/add", async (req, res) => {
    const { songname, Film, Music_director, singer } = req.body
    console.log(req.body)
    songdetails.create({ songname, Film, Music_director, singer })
    res.status(200).send(req.body);
})

app.get("/count", async (req, res) => {
    const songs = await songdetails.find()
    console.log(songs.length)
    res.send({ "total count": songs.length, songs })
})

app.get("/getSongsOfDirector/:directorName", async (req, res) => {
    const directorName = req.params.directorName
    const songs = await songdetails.find({ Music_director: directorName })
    res.send(songs)
})

app.get("/getSongsOfDirectorAndSinger/:directorName/:singerName", async function (request, response) {
    const directorName = request.params.directorName
    const singerName = request.params.singerName
    const songs = await Songdetails.find({ Music_director: directorName, singer: singerName })
    response.send(songs)
})

app.put("/updateActorAndActress", async function (request, response) {
    const { songID, Actor, Actress } = request.body;
    const song = await songdetails.findOneAndUpdate({ _id: songID }, {
        $set: {
            Actor, Actress
        }
    }, { new: true }) // {new:true} is used for getting latest updated data
    response.send(song)
})

app.get("/displayAllSongsInTable", async function (request, response) {
    const songs = await songdetails.find()

    // creating table view for browser
    let html = "<table border=1 style='border-collapse: collapse'>" // style tag is used to avoid double border on table
    // creating headers **BackTick (`) is used for creating multiline string**
    html = html + `<tr>
        <th>Songname</th>
        <th>Film</th>
        <th>Music_director</th>
        <th>singer</th>
        <th>Actor</th>
        <th>Actress</th>
    </tr>`
    songs.map(function (song) {
        html = html + "<tr>"

        html = html + "<td>" + song.songname + "</td>"
        html = html + "<td>" + song.Film + "</td>"
        html = html + "<td>" + song.Music_director + "</td>"
        html = html + "<td>" + song.singer + "</td>"
        html = html + "<td>" + song.Actor + "</td>"
        html = html + "<td>" + song.Actress + "</td>"

        html = html + "</tr>"
    })
    html = html + "</table>"

    response.send(html)
})

app.listen(PORT, () => {
    console.log(`server is listening at http://localhost:${PORT}`);
})
