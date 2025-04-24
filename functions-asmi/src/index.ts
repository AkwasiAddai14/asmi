import { onRequest } from "firebase-functions/v2/https";
import { default as next } from "next";
import express from "express";
import { config } from "firebase-functions";

const clerkKey = config().clerk.publishable_key;
const clerkSecret = config().clerk.secret_key;

const app = next({
  dev: false,
  conf: {
    env: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: clerkKey,
      CLERK_SECRET_KEY: clerkSecret,
    },
  },
});

const handle = app.getRequestHandler();
const server = express();

// 👇 Eerst prepare(), dan pas de server starten:
const readyPromise = app.prepare().then(() => {
  server.all("*", (req, res) => {
    return handle(req, res);
  });
});

export const nextApp = onRequest({ timeoutSeconds: 300 }, async (req, res) => {
  await readyPromise;  // 👈 Zorg dat Next.js klaar is!
  server(req, res);    // 👈 Daarna het request afhandelen
});


/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

/* import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger"; */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
