const express = require('express') //https version of express server
const app = express();
const path = require('path');
const getColors = require('get-image-colors');
const GoogleImageSearch = require('free-google-image-search');
var glob = require("glob");

// helps process .env
require('dotenv').config();

console.log(__dirname);

/**
 * 
 * @param {Array} imagePaths
 * @param {int} numColors
 * @returns {Array} a double array of hex values 
 */
function getColorsFromImages(imagePaths, numColors, callback){
    var color_matrix = []
    console.log("\ngetColorsFromImages\n");
    //cycle thru each thing

    imagePaths.forEach((path) => {
        getColors(path, numColors).then(colors => {
            var cs = colors.map(color => color.hex())
            color_matrix.push(cs);
            console.log(cs)
        }).catch((err) => {
            console.log(err);
        })
    })


}

/**
 * Returns a file path to all of the image files matching the query
 * @param {string} query a search term 
 * @returns {Array} files paths
 */
function getImagePaths(query, callback){
    console.log("running getImagePaths: ")
    var paths  = []
    glob(`python/downloads/${query}/*`, (err, files) => {

        // files -> in the function success
        if(files){
            console.log("function success: ")
            //console.log(files)
        }

        //use callback function here
        return callback(files, 5);
    });
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

app.get('/showImages', (req, res) => {
    // colors array
    var colors_arr = []

    // use glob to get the files
    // can use pattern "python/downloads/{query}/*"

    glob("python/downloads/sunset/*", (err, files) => {
        if(err){
            console.log(err);
        }

        if(files){
            console.log(files);
        }

    })
});

app.get('/getImages', (req, res) => {
    var m = getImagePaths("sunset", getColorsFromImages) // get the images from the application
});




const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running at port: ${port}`));