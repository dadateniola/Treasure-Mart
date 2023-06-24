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
//Syntax: req.alert({head, msg, type, url, text, image})
app.use((req, res, next) => {
    //Set parameters
    const alert = res.locals.alert;
    const avatarPath = path.join(__dirname, "assets", "images", "avatars");

    req.alert = async function (options = {}) {
        //Set a button or link depending to be displayed
        if (options?.type) {
            let texts = 0;
            let isArray = true;

            (options?.text) ? ((Array.isArray(options.text)) ? texts = options.text.length : isArray = false) : null;
            options.action = [];

            if (options.type.toLowerCase() == 'btn') {
                if (isArray) {
                    for (let i = 0; i < texts; i++) {
                        options.action.push(`<button data-alert-btn>${options?.text[i] || 'No message'}</button>`);
                    }
                } else {
                    options.action.push(`<button data-alert-btn>${options?.text || 'No message'}</button>`);
                }
            } else {
                if (isArray) {
                    for (let i = 0; i < texts; i++) {
                        options.action.push((options?.url) ? `<a href="${options.url}">${options?.text[i] || 'No message'}</a>` : `<a>${options?.text[i] || 'No message'} (No location)</a>`);
                    }
                } else {
                    options.action.push((options?.url) ? `<a href="${options.url}">${options?.text || 'No message'}</a>` : `<a>${options?.text || 'No message'} (No location)</a>`);
                }
            }
        }

        //Set an image to come with the alert
        if (options?.image) {
            try {
                let imageFiles;
                const files = await fs.readdir(avatarPath);

                imageFiles = files.filter(file => file.toLowerCase().includes(options.image));

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