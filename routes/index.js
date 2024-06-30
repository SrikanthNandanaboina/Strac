/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require("express");
var router = express.Router();

const authProvider = require("../auth/AuthProvider");
const { REDIRECT_URI } = require("../authConfig");

router.get("/", function (req, res) {
  res.render("index", {
    isAuthenticated: req.session.isAuthenticated,
  });
});

// router.get("/", function (req, res, next) {
//   res.send({
//     title: "MSAL Node & Express Web App",
//     isAuthenticated: req.session.isAuthenticated,
//     username: req.session.account?.username,
//   });
// });

module.exports = router;
