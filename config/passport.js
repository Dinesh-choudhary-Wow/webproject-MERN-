const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { compareSync } = require('bcrypt');
const UserModel = require('./database')

passport.use(new LocalStrategy(
    function(username,password,done){
        UserModel.findOne({username:username}, function(err,user){
            if(err) { return done(err); }
            if(!user){
                return done(null,false,{message:'Incorrect username.'});
            }
            if(!compareSync(password,user.password)){
                return done(null,false,{message:'Incorrect password.'});
            }
            return done(null,user)
        });
    }
));

//persists user data inside sessions
passport.serializeUser(function(user,done){
    done(null,user.id)
});

//fetches sessions details using session id
passport.deserializeUser(function(id,done){
    UserModel.findById(id,function(err,user){
        done(err,user);
    });
})