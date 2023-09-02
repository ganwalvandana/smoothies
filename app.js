const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const {checkUser} = require('./middleware/auth');

const app = express();

// app.use((req, res, next) => {
//     console.log("All requests:");
//     console.log(req);
//     next();
// })

app.use(bodyParser.urlencoded({
    extended: false
}));

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());
app.use(express.json());

app.get('*', checkUser);

app.use(authRouter);
const PORT = 3000;
mongoose.connect('mongodb+srv://vandana:passpass@cluster0.hyzj3l8.mongodb.net/?retryWrites=true&w=majority').then(() => {
    app.listen(PORT, console.log(`Server started @${PORT}`));

})
