const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/appdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => console.log('Database is connected'));
