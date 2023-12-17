const express = require('express');
const path = require('path');

const app = express();

const publicDirectory = path.join(__dirname,'public');

console.log(publicDirectory)
app.use(express.static(publicDirectory));


app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('view engine','hbs');



// define routes
app.use('/', require('./routes/pages'));

app.listen(5000,() =>{
    console.log("Server Started on port 5000")
})