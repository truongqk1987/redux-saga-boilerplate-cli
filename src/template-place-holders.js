const fs = require("fs-extra");
const { lowerCaseFirst } = require("lower-case-first");
const { upperCaseFirst } = require("upper-case-first");

const { getConfig } = require("./share-objects");

module.exports.replaceByEntityName = async (filePath, entityName) => {
  const { ENCODING, BASE_API } = getConfig();

  const fileContent = await fs.readFile(filePath, ENCODING);

  const result = fileContent
    .replace(/'<nameOf>'/g, lowerCaseFirst(entityName))
    .replace(/'<NameOf>'/g, upperCaseFirst(entityName))
    .replace(/'<nameof>'/g, entityName.toLowerCase())
    .replace(/'<NAMEOF>'/g, entityName.toUpperCase())
    .replace(/'<BaseAPI>'/g, BASE_API);

  await fs.writeFile(filePath, result, ENCODING);
};
