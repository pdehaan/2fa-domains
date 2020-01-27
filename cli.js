#!/usr/bin/env node

const lib = require("./lib");

main();

async function main() {
  const domains = await lib.fetchDomains();
  console.log(JSON.stringify(domains));
}
