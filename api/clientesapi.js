const express = require('express');
const app = express();

//SETTINGS
app.set('port', process.env.PORT || 4000);

//MIDDLEWARE
app.use(express.json());

//ROUTES
app.use(require('./clientes'))

const port = 4000;
app.listen(app.get('port'), () =>{
    console.log('Server listening on port' ,app.get('port'));
});
