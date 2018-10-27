const mongoose = require('mongoose');
// avoid mongoose library warning
mongoose.Promise = global.Promise;
// connect to database
// mongoose.connect(`mongodb://admin:admin1@ds139523.mlab.com:39523/employee`, { useNewUrlParser: true });
mongoose.connect('mongodb://127.0.0.1:27017/Employee');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Profiles db is connected");
});