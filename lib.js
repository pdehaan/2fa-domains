const fs = require("fs").promises;
const path = require("path");

const yaml = require("js-yaml").safeLoad;

const BASE_DIR = path.dirname(
  require.resolve("twofactorauth/_data/sections.yml")
);

module.exports = {
  fetchDomains,
  getHostname
};

async function fetchDomains() {
  const sections = await loadYaml("sections.yml");
  const res = [];

  for (const section of sections) {
    const data = await loadYaml(`${section.id}.yml`);
    const websites = data.websites
      .filter(website => website.hasOwnProperty("tfa"))
      .map(website => getHostname(website.url));
    res.push(websites);
  }

  return res.flat().sort();
}

async function loadYaml(filename, basedir = BASE_DIR) {
  const yamlPath = path.join(basedir, filename);
  const yamlString = await fs.readFile(yamlPath);
  return yaml(yamlString);
}

function getHostname(url) {
  return new URL(url).hostname.replace(/^www\./, "");
}
