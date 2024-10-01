const express = require('express');
const {logout,loggedIn} = require('../controllers/auth')
const latestre = require('../controllers/latest')
const router = express.Router();
const fs = require('fs').promises;

const counterFile = 'counter.txt';

// Middleware to update the count
router.use('/', async(req, res, next) => {
    try {
        // Read the current count from the file
        let count = parseInt(await fs.readFile('./counter.txt', 'utf-8')) || 0;

        // Validate that count is a valid number
        if (!isNaN(count)) {
            // Increment the count
            count++;

            // Write the new count back to the file
            await fs.writeFile('./counter.txt', count.toString());

            // Attach the count to the request object for later use
            req.visitorCount = count;
        } else {
            console.error('Invalid count value:', count);
        }
    } catch (error) {
        console.error('Error updating count:', error);
    }

    // Continue to the next middleware/route
    next();
});






router.get('/',(req,res)=>{
    res.sendFile("index");
});

router.get('/community',loggedIn, (req, res) => {
    if(req.user)
    {
     res.render("community",{success:"loggedIn", username:req.user.username});
    }else{
            res.render('community',{status:'no', user:"nothing"});
    }
});


router.get('/pyqs',latestre.latestpost);
router.get('/secrets',(req,res)=>{
    res.render("secrets");
});
router.get('/blogs',(req,res)=>{
    res.render("blog");
});
router.get('/d',(req,res)=>{
    res.render("profiles");
});

router.get('/contributor',loggedIn, (req, res) => {
    if(req.user)
    {
     res.render("contirbutor",{success:"loggedIn", username:req.user.username});
    }else{
            res.render('contirbutor',{status:'no', user:"nothing"});
    }
})
router.get('/register',(req,res)=>{
    res.render("register");
});
router.get('/login',(req,res)=>{
    res.render("login");
});

router.get('/logout', logout);



module.exports = router;