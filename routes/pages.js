const express = require('express');

const router = express.Router();


router.get('/',(req,res)=>{
    res.render("index");
});

router.get('/about',(req,res)=>{
    res.render("about");
});

router.get('/community',(req,res)=>{
    res.render("community");
});
router.get('/pyqs',(req,res)=>{
    res.render("pyqs");
});
router.get('/secrets',(req,res)=>{
    res.render("secrets");
});
router.get('/contributor',(req,res)=>{
    res.render("contirbutor");
});

module.exports = router;