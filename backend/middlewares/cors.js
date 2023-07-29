const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const allowedCors = [
  'http://domainsanyaman.students.nomoredomains.xyz/',
  'https://domainsanyaman.students.nomoredomains.xyz/',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://api.domainsanyaman.nomoredomains.xyz/',
  'https://api.domainsanyaman.nomoredomains.xyz/',
  'http://localhost:3001',
  'https://localhost:3001',
];

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    });
  }

  if (method === 'OPTIONS') {
    res.header({
      'Access-Control-Allow-Headers': requestHeaders,
      'Access-Control-Allow-Methods': DEFAULT_ALLOWED_METHODS,
    });
    return res.end();
  }
  next();
};
