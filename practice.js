var palette = require('get-rgba-palette')
var pixels = require('get-image-pixels')
var load = require('img')
var lady = require('green_hair.jpg')
 
load(lady, async (err, img) =>  {
    if(err){
        console.log(err);
    }

    //get flat RGBA pixels array
    var px = await pixels(img)
 
    //get 5 prominent colors from our image
    var colors = await palette(px, 5)

    console.log(colors);
})