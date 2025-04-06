import passport from "passport";
import User from "../models/user.model.js";
import {hash} from "../utility/hashString.js";
import {MESSAGES} from "../enums/messages.js";
import {STATUS} from "../enums/statusTypes.js";


// export const loginUser = async (req, res) => {
//     app.post("/api/auth", passport.authenticate('local'), (req, res) => {
//         res.status(200);
//     })
// }

export const checkTurnstileToken = async (req, res) => {
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
    const body = req.body;


    const formData = new FormData();
    formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
    formData.append('response', body.token);

    try {
        const result = await fetch(url, {
            body: formData,
            method: 'POST',
        });

        const outcome = await result.json();
        if (outcome.success) {
            return true;
        }
    } catch (err) {
        console.error(err);
    }
    return false;
}
export const loginUser = async (req, res, next) => {

    const validateCaptcha = await checkTurnstileToken(req, res)

    //TODO activate captha
    // if (!validateCaptcha) {
    //     return res.status(500).json({ message: "Failed to validate CAPTCHA response" });
    // }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err); // Passes error to Express's default error handler
        }
        if (!user) {
            return res.status(401).json({message: 'Invalid username or password', success: false});
        }

        // Log the user in
        req.logIn(user, (err) => {
            if (err) {
                return next(err); // Handle error during login
            }

            //TODO hash token
            const token = "testToken";

            return res.status(200).json({message: 'Login successful', success: true, user, token});
        });
    })(req, res, next); // Call the passport.authenticate function
};



const handleError = (res, message, error, status = STATUS.SERVER_ERROR) => {
    console.error(message, error || "");
    res.status(status).json({ success: false, message, error: error?.message });
};

export const registerUser = async (req, res) => {
    const { username = null, password = null, email = null } = req.body;

    if (!username || !password || !email) {
        return res
            .status(STATUS.BAD_REQUEST)
            .json({ success: false, message: MESSAGES.MISSING_FIELDS });
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ username, password: hashedPassword, email, isRegistered: true });

    try {
        await user.save();
        res.status(STATUS.SUCCESS).json({
            success: true,
            message: MESSAGES.USER_SAVED,
            data: user,
        });
    } catch (error) {
        handleError(res, MESSAGES.USER_SAVE_FAILED, error);
    }
};

export const status = async (req, res) => {
    const user = req.user;
    const session = req.session;
    console.log(session);
    if (!user) {
        res.status(401);
    } else {
        res.status(200).json({
            user,
            session
        });
    }
}

export const logout = async (req, res) => {
    const user = req.user;
    if (!user) {
        res.status(401);
    } else {
        req.logout((err) => {
            if (err) {
                res.status(400);
            } else {
                res.status(200).json({
                    message:
                        "User logged out"
                })
            }
        })
    }
}


// app.get("/api/auth/status", (req, res) => {
//     const user = req.user;
//     const session = req.session;
//     console.log(session);
//     if (!user) {
//         res.status(401);
//     } else {
//         res.status(200).json({
//             user,
//             session
//         });
//     }
//
// })
// app.post("/api/auth/logout", (req, res) => {
//     const user = req.user;
//     if (!user) {
//         res.status(401);
//     } else {
//         req.logout((err) => {
//             if (err) {
//                 res.status(400);
//             } else {
//                 res.status(200).json({
//                     message:
//                         "User logged out"
//                 })
//             }
//         })
//     }
// })