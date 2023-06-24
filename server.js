require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs').promises;
const clientRoutes = require('./routes/clientRoutes');

const port = process.env.PORT || 3000;

//Run application
const app = express();

//Setup session
var sess = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

//Serving static files
app.use(express.static(path.join(__dirname, 'assets')));

//Setup ejs
app.set('view engine', 'ejs');
app.set('views', 'pages');

//Important middlewares

app.use((req, res, next) => {
    res.locals.alert = {
        alerts: []
    };
    next();
})

//Attach alert to the frontend
//Syntax: req.alert({head, msg, type, url, txt, img})
app.use((req, res, next) => {
    //Set parameters
    const alert = res.locals.alert;
    const avatarPath = path.join(__dirname, "assets", "images", "avatars");

    req.alert = async function (options = {}) {
        //Set a button or link depending to be displayed
        if (options?.type) {
            (options.type == 'btn')
                ?
                options.action = `<button>${options?.txt || 'No message'}</button>`
                :
                options.action = (options?.url) ? `<a href="${options.url}">${options?.txt || 'No message'}</a>` : `<a>${options?.txt || 'No message'} (No location)</a>`;
        }

        //Set an image to come with the alert
        if (options?.img) {
            try {
                let imageFiles;
                const files = await fs.readdir(avatarPath);

                imageFiles = files.filter(file => file.toLowerCase().includes(options.img));

                //Set or change the image to be displayed
                if (!imageFiles.length) alert.image = 'default.png';
                else {
                    const randomIndex = Math.floor(Math.random() * imageFiles.length);
                    alert.image = imageFiles[randomIndex];
                }
            } catch (err) {
                console.log("Error reading directory: ", err);
                imageFiles = [];
            }
        }
        
        //Push the modified object in alerts
        alert.alerts.push(options);
    }
    next();
})

app.use(clientRoutes)

app.listen(port, (err) => console.log(err || `Visit http://localhost:${port}/`))