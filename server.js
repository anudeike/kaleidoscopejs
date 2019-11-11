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

// this should be null but it is in the firebase docs
var ref = db.ref();
ref.once("value", (snapshot) => {
    console.log(snapshot.val());
});

// create a child reference 
var queryRef = ref.child("queries");

// add an example
queryRef.set({
    "example": ["#ffffff", "#a1ff0a", "#427deb"]
})

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

app.get('/processImages', (req, res) => {
    //getImagePaths("sunset", res, getColorsFromImages) // get the images from the application
    //getAsyncPaths("sunset");
    var query = "sunset";
    
    // sing async here with the await in the getColors
    // allows for blocking code - not node style but very useful for this case
    glob(`python/downloads/${query}/*`, async (err, files) => {

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
    });
});




const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running at port: ${port}`));