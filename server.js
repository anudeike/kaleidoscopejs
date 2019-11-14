const express = require('express') //https version of express server
const app = express();
const path = require('path');
const getColors = require('get-image-colors');
var glob = require("glob");
var admin = require("firebase-admin");


// helps process .env
require('dotenv').config();

//console.log(__dirname);

// init firebase application
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://kaleidoscope-data.firebaseio.com'
})

// set up the realtime database access
var db = admin.database();

// // this should be null but it is in the firebase docs
// var ref = db.ref();

// // create a child reference 
// var queryRef = ref.child("queries");

// // create a child ref of the queries ref which is a query
// var termRef = queryRef.child("example");

// // push an example
// termRef.push().set(["#ffffff", "#a1ff0a", "#427deb"], (err) => {
//     console.log(err)
// })

//sends information to the database
function sendToDatabase(db, query, info){
    var ref = db.ref();
    var queryRef = ref.child("queries");
    var termRef = queryRef.child(query);

    termRef.push().set(info, () => {
        console.log("sent to database: ")
    })
}

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, './test_src')});
})

// this getColors is called when the index.html is mounted onto the dom
// the 3 is the amount of colors I want
app.get('/getColors', (req, res) => {
    getColors(path.join(__dirname, 'green_hair.jpg'), 5).then(colors => { 
        // colors is an array of color objects
        var cs = colors.map(color => color.hex())
        console.log(cs)
        res.send(cs)
        
    })
});

app.get('/processImages/:query', (req, res) => {

    //get the query from the route
    var query = req.params.query;
    
    console.log(req.params.query);
    
    // set async here with the await in the getColors
    // allows for blocking code - not node style but very useful for this case
    glob(`python/downloads/${query}/*`, async (err, files) => {
        
        // if no files are found then send 404 to the front
        if (files.length == 0){
            res.status(404).send('Not Found in database');
        }


        var color_matrix = []
        console.log("\ngetColorsFromImages\n");

        //just use a regular for loop
        for(var i = 0; i < files.length; i++){
            await getColors(files[i], 5).then((colors) => {
                var cs = colors.map(color => color.hex())
                color_matrix.push(cs);
                console.log(cs)
            });
        }

        var merged = [].concat.apply([], color_matrix); //flatten the 2d array
        console.log(merged);

        //use insert in database function
        sendToDatabase(db, query, merged);
    });
});

app.get('/sendParams/:query',(req, res) => {
    var format = req.params.query
    console.log(format);
});


const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running at port: ${port}`));