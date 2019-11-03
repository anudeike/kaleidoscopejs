const express = require('express') //https version of express server
const app = express();
const path = require('path');
const getColors = require('get-image-colors');


// pseudo information
const images = [
    { id: 0, name: 'image1'},
    { id: 1, name: 'image2'},
    { id: 2, name: 'image3'},
    { id: 7, name: 'image4'},
    { id: 4, name: 'image5'}
];

console.log(__dirname);

app.get('/getHTML', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, './test_src')});
})

// // create a home route
// app.get('/', (req, res) => {
//     res.send('An alligator is boring');
// });

// we are going to work on quantizing information
// specifically taking in a photo and 
// and reducing the amount of colors in the photo
app.get('/getColors', (req, res) => {
    getColors(path.join(__dirname, 'green_hair.jpg')).then(colors => {
        // colors is an array of color objects
        var cs = colors.map(color => color.hex())
        res.send(cs)
        
    })
});




const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running at port: ${port}`));