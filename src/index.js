require('dotenv').config();
require('./database');

const app = require('./app');

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('Server listen on port', port);
});