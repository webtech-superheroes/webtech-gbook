const express = require("express");
const clone = require('git-clone');
const fs = require('fs');

const app = express()

/**
 * configure express to serve static files in the profiles directory
 * @see https://expressjs.com/en/starter/static-files.html
 * */
app.use('/', express.static('profiles'));
 
/**
 * express middleware to parse json and urlencoded request body
 * @see https://expressjs.com/en/4x/api.html#express-json-middleware
 * */
app.use(express.json());
app.use(express.urlencoded());

app.get('/ping', (req, res) => {
    res.status(200).send('hello eduard')
})

/**
 * endpoint POST /signup
 * @param name - full name of the person who signs up
 * @param giturl - address for the git repository where the profile is store
 * */
app.post('/signup', (request, response) => {
    let repoParts = request.body.giturl.split('/');
    let profilePath = 'profiles/users/'+repoParts[repoParts.length - 2];
    
    if (!fs.existsSync(profilePath)){
        fs.mkdirSync(profilePath);
    }
    console.log("show")
    clone(request.body.giturl, profilePath, () => {
        console.log('cloned')
    })
    
    let profileAddress = '/users/'+repoParts[repoParts.length - 2];
    response.status(200).send('Success! You can see your profile <a href="'+profileAddress+'">here</a>');
})

const port = process.env.PORT || 8080;
app.listen(port);