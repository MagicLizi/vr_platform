var express = require('express');
var router = express.Router();
var utilNext = require("../z_util/utilNext");

router.get('/',function(req,res,next)
{
    res.render('index',{title:'2131'});
})

module.exports = router;
