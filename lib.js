const fs = require("fs").promises;
const path = require("path");

const yaml = require("js-yaml").safeLoad;

module.exports = {
  fetchDomains,
  getHostname
};

async function fetchDomains() {
  const sections = await loadYaml("sections.yml");
  const res = [];

  for (const section of sections) {
    const data = await loadYaml(`${section.id}.yml`);
    res.push(data.websites.map(obj => getHostname(obj.url)));
  }

  return res.flat().sort();
}

async function loadYaml(
  filename,
  basedir = "./node_modules/twofactorauth/_data"
) {
  const yamlPath = path.join(basedir, filename);
  const yamlString = await fs.readFile(yamlPath);
  return yaml(yamlString);
}

function getHostname(url) {
  return new URL(url).hostname.replace(/^www\./, "");
}
