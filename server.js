require("dotenv").config();

const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSION_SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  }),
);

app.use(express.static(path.join(__dirname, "public")));

app.get("/profile", requiresAuth(), (req, res) => {
  res.json({
    message: "You are successfully authenticated!",
    user: req.oidc.user,
  });
});

app.get("/auth-status", (req, res) => {
  res.json({
    isAuthenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user || null,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
