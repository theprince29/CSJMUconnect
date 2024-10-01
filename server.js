const express = require('express');
const db = require('./routes/db-config');
const cookie = require('cookie-parser')
const dotenv = require('dotenv');
const searchRouter = require('./routes/search');
dotenv.config({path:'./.env'});
const fs = require('fs').promises;


const PORT = process.env.PORT|| 5001;
const path = require('path');
const app = express();

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));







app.get('/about',(req,res)=>{
    res.sendFile(path.join(publicDirectory,"about.html"));
})
app.get("/pdf/:pdfName", (req, res) => {
    var requipdf = req.params.pdfName;
    const filePath = path.join(__dirname, "uploads", requipdf);
    console.log(filePath);
    res.sendFile(filePath);
  });




app.use(express.urlencoded({extended: false}));


app.set('view engine','hbs');
app.set('views','./views');

app.use(cookie());
app.use(express.json());






// // Endpoint to get the visitor count
app.get('/getVisitorCount', async (req, res) => {
  try {
    const count = await fs.readFile('./counter.txt', 'utf-8');
    res.json({ count: parseInt(count) });
  } catch (error) {
    console.error('Error fetching visitor count:', error);
    res.sendStatus(500);
  }
});



// define routes
app.use('/', require('./routes/pages'));
app.use('/search', searchRouter);
app.use('/auth', require('./routes/auth'));
app.use('/auth/dashbord', require('./routes/dashboard'));



app.get('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'pnf.html'));
  });

app.listen(PORT,() =>{
    console.log(`Server Started on port ${PORT}`);
})