// This file is used to run npm commands in PM2
const { execSync } = require("child_process");

const [_0, _1, ...args] = process.argv;
execSync(`npm ${args.join(" ")}`, { windowsHide: true, stdio: "inherit" });
