import passport from "passport";
import {Strategy} from "passport-local"

//serialize user after fetching + stores into session data
//id is used in deserialization
//TODO fix issue with ID serialization, now using email
passport.serializeUser((user, done) => {
    console.log("Serialize")
    // console.log(user.email)
    done(null, user.email)
})

passport.deserializeUser(async (id, done) => {
    try {
        console.log("DeSerialize")
        const user = await UserTest.findOne({email:id})
        if (!user) {
            throw new Error("User not found")
        }
        // console.log("user: " + user)
        done(null, user);  //success
    }catch (e) {
        done(e, null);  //fail - next mw
    }
})

//option + verify func
export default passport.use(
    new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        //getUser +  //check password
        try{
            const user = await UserTest.findByEmail(username)
            console.log(user);
            if (!user) {
                throw new Error("User not found")
            }

            const match = await user.comparePassword(password)

            if(!match) {
                throw new Error("Password mismatch")
            }
            done(null, user);  //success
        } catch(err) {
            done(err, null);  //fail - next mw
        }

    })
)