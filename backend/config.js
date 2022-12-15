const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  doc_ID: process.env.doc_ID,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
};
