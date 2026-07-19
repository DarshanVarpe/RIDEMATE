const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const userModel = require("../models/user.models");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || "missing_client_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing_client_secret",
            callbackURL: `${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/google/callback`,
            scope: ["profile", "email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                if (!profile.emails || profile.emails.length === 0) {
                    return done(null, false, { message: "Google did not provide an email address." });
                }

                const email = profile.emails[0].value.toLowerCase();
                const googleId = profile.id;

                let user = await userModel.findOne({
                    $or: [{ googleId: googleId }, { email: email }]
                });

                if (user) {
                    if (!user.googleId) {
                        user.googleId = googleId;
                        if (!user.img && profile.photos && profile.photos.length > 0) {
                            user.img = profile.photos[0].value;
                        }
                        await user.save();
                    }
                    return done(null, user);
                }

                // Create new user automatically on first Google login
                user = await userModel.create({
                    googleId: googleId,
                    email: email,
                    firstName: profile.name.givenName || profile.displayName || "Google",
                    lastName: profile.name.familyName || "User",
                    img: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
                    role: "user"
                });

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn("WARNING: Google OAuth credentials are missing. Google login will not work.");
}

module.exports = passport;
