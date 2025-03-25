const express = require('express');
const router = express.Router();
const path = require('path');

//^ ← must start with the simbol next to the ^ 
//$ ← must end with the simbol befor the $
//()? ← between the () is optional

const frontend = path.join(__dirname,'..','..','frontend','dist');

router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(frontend ,'index.html'));
});

router.get('/new_file', (req, res) => {
    res.sendFile(path.join(frontend ,'index.html'));
    res.redirect(301,'/old_file');//faire une redirection // 302 by default
});


//handel 404 page not funded
router.all('*', (req, res) => {
    res.status(404);
    
    //get error page by type
    if(req.accepts('html')) {
        res.sendFile(path.join(frontend ,'404.html'));
    }else if(req.accepts('json')) {
        res.json({error: '404 Not Found'});
    }else{
        res.type('txt').send('404 Not Found');
    }

})

module.exports = router;