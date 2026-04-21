const Document = require("../models/Document");

async function getContext(query, role) {
  const docs = await Document.find({
    $text: { $search: query },
    access: role
  });

  return docs.map(d => d.content).join("\n");
}

module.exports = { getContext };