/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require("express");
var router = express.Router();
const http = require("http");
var fetch = require("../fetch");

var { GRAPH_ME_ENDPOINT } = require("../authConfig");
const authProvider = require("../auth/AuthProvider");
const { REDIRECT_URI } = require("../authConfig");
const io = require("socket.io");
// custom middleware to check auth state
function isAuthenticated(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect("/auth/signin"); // redirect to sign-in route
  }

  next();
}

router.get(
  "/id",
  isAuthenticated, // check if user is authenticated
  async function (req, res, next) {
    res.send({ idTokenClaims: req.session.account.idTokenClaims });
  }
);

router.get(
  "/profile",
  isAuthenticated,
  authProvider.acquireToken({
    scopes: ["User.Read"],
    redirectUri: REDIRECT_URI,
  }),
  async function (req, res, next) {
    try {
      const graphResponse = await fetch(
        GRAPH_ME_ENDPOINT,
        req.session.accessToken
      );

      res.render("profile", {
        data: [
          {
            key: "Name",
            value: graphResponse.displayName,
          },
          {
            key: "email",
            value: graphResponse.mail,
          },
        ],
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/files",
  isAuthenticated, // check if user is authenticated
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
  }),
  async function (req, res, next) {
    try {
      const graphResponse = await fetch(
        `${GRAPH_ME_ENDPOINT}/drive/root/children`,
        req.session.accessToken
      );

      if (graphResponse.value) {
        const files = graphResponse.value
          .filter((ele) => ele.file)
          .map((ele) => ({
            ...ele,
            downloadUrl: ele["@microsoft.graph.downloadUrl"],
          }));
        res.render("files", { files });
      } else {
        res.send("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.get(
  "/file/:fileId",
  isAuthenticated, // check if user is authenticated
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
  }),
  async function (req, res, next) {
    try {
      const fileId = req.params.fileId;
      const filePermissions = await fetch(
        `${GRAPH_ME_ENDPOINT}/drive/items/${fileId}/permissions`,
        req.session.accessToken
      );

      const socketResult = await fetch(
        `${GRAPH_ME_ENDPOINT}/drive/root/subscriptions/socketIo`,
        req.session.accessToken
      );
      console.log(socketResult);
      res.render("file-info", {
        users: filePermissions.value,
        socketIoUrl: socketResult.notificationUrl,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = router;
