const storage = require("../storage/session");

async function goHome (req, res){ 
    
    res.redirect('/api/medical-record');  
}

module.exports= { 
    goHome
}