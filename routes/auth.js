/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require("express");

const authProvider = require("../auth/AuthProvider");
const { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } = require("../authConfig");

const router = express.Router();

router.get(
  "/signin",
  authProvider.login({
    scopes: [
      "User.Read",
      "Files.Read",
      "Files.ReadWrite",
      "Files.Read.All",
      "Files.ReadWrite.All",
      "Sites.Read.All",
      "Sites.ReadWrite.All",
    ],
    redirectUri: REDIRECT_URI,
    successRedirect: "/",
  })
);

router.get("/acquireToken", function (req, res) {
  authProvider.acquireToken({
    scopes: [
      "User.Read",
      "Files.Read",
      "Files.ReadWrite",
      "Files.Read.All",
      "Files.ReadWrite.All",
      "Sites.Read.All",
      "Sites.ReadWrite.All",
    ],
    redirectUri: REDIRECT_URI,
    successRedirect: "/users/profile",
  });
});

router.post("/redirect", authProvider.handleRedirect());

router.get(
  "/signout",
  authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI,
  })
);

module.exports = router;
