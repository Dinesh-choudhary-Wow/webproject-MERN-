const { hashSync } = require('bcrypt');
const express = require('express');
const app = express();
const port = 4500;
const UserModel = require('./config/database')
const session = require('express-session')
const mongoStore = require('connect-mongo');
const passport = require('passport')
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))

app.use(session({
  secret: 'nosecretkey',
  resave: false,
  saveUninitialized: true,
  store:mongoStore.create({mongoUrl:'mongodb://localhost:27017/webApplicationMern',collectionName:"sessions"}),
  cookie: { maxAge:1000*60*60*24 }
}))

require('./config/passport')

app.use(passport.initialize())
app.use(passport.session())

app.get('/login',(req,res) => {
    res.render('login')
})
app.get('/register',(req,res) => {
    res.render('register')
})
app.post('/login',passport.authenticate('local',{ successRedirect : 'protected' }))

app.post('/register',(req,res) => {
    const user = new UserModel({
        username: req.body.username,
        password: hashSync(req.body.password,10),
    })
    user.save().then(user => console.log(user));

    res.send({success:true})
})

app.get('/protected',(req,res) => {
    if(req.isAuthenticated()){
        res.send("Protected")
    }else{
        res.status(401).send({message:"Unauthorized"})
    }
    console.log(req.session)
    console.log(req.user)
})


app.get('/logout',(req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
})



app.listen(port,(req,res) => {
    console.log("Express Running On Port "+ port);
})