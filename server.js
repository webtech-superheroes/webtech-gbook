const express = require("express");
const clone = require('git-clone');
const fs = require('fs');

const app = express()

app.use('/', express.static('profiles'));

app.use(express.json());
app.use(express.urlencoded());

app.post('/signup', (request, response) => {
    let repoParts = request.body.giturl.split('/');
    let profilePath = 'profiles/users/'+repoParts[repoParts.length - 2];
    
    if (!fs.existsSync(profilePath)){
        fs.mkdirSync(profilePath);
    }
    
    clone(request.body.giturl, profilePath, () => {
        console.log('cloned')
    })
    response.status(200).send(request.body.giturl)
})


app.listen(8080);