// @ts-nocheck
const firebaseAdmin = (await import("firebase-admin")).default;
const env = (await import("$/server/env.js")).default;

import fs from "fs";
import path from "path";
import root_paths from "../../../dynamic_configuration/root_paths.ts";
try {
    const src_path = root_paths.src_path;
    const firebaseConfig = JSON.parse(fs.readFileSync(path.join(src_path, "firebase/FirebaseServerKey.json")));
    console.log("firebase config", firebaseConfig);

    await firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert(firebaseConfig),
    });
} catch (error) {
    console.log(error);
}
export default firebaseAdmin;
