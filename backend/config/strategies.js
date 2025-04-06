import passport from "passport";
import {Strategy} from "passport-local"
import User from "../models/user.model.js";

//serialize user after fetching + stores into session data
//id is used in deserialization
passport.serializeUser((user, done) => {
    return done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        if (!user) {
            throw new Error("User not found")
        }
        // console.log("user: " + user)
        return done(null, user);  //success
    }catch (e) {
        return done(e, null);  //fail - next mw
    }
})

//option + verify func
passport.use(
    new Strategy(
        async (username, password, done) => {
        //getUser +  //check password
        try{
            const user = await User.findOne({username})
            console.log(user);
            if (!user) {
                throw new Error("User not found")
            }

            const match = await user.comparePassword(password)

            if(!match) {
                throw new Error("Password mismatch")
            }
            return done(null, user);  //success
        } catch(err) {
           return  done(err, null);  //fail - next mw
        }

    })
)