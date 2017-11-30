var db = require('../db.js');
var express = require('express');
var router = express.Router();


// User Profile
router.get('/profile', verifyAuthentication(), function(req, res, next){
    res.render('profile', {title: 'Profile'});
});


// Lessons Page
router.get('/lessons', function(req, res){
    res.render('lessons', {title: 'Lessons'});
});

// lecture page
router.get('/lecture', function(req, res){
    res.render('lecture', {title: 'Lecture'});
});


// Projects Page
router.get('/projects', function(req, res){
  var projects = []
  db.query("SELECT users_projects.userID, users_projects.projectID, projects.title FROM users_projects INNER JOIN projects ON users_projects.projectID = projects.id WHERE userID=?", [req.user.id], function(err, result){
    for(var i = 0; i < result.length; i++){
      projects.push({id: result[i].project_id, title: result[i].title});
    }
    res.render('projects/index', {projects});
  });
});


// Projects Details Page
router.get('/projects/details', function(req, res, next){
    db.query('SELECT * FROM projects WHERE id=?', [req.query.id], function(err, result){
    res.render('projects/details', {title: result[0].title, instructions: result[0].instructions});
  });
});

// Restrict unauthorized access to particular pages
function verifyAuthentication(){
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }
}

module.exports = router;
