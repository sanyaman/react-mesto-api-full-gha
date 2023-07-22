const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const allowedCors = [
  'http://domainSanyaman.students.nomoredomains.xyz',
  'http://127.0.0.1:3000',
  'https://domainSanyaman.students.nomoredomains.xyz',
  'https://127.0.0.1:3000',
  'http://domainSanyaman.students.nomoredomains.xyz',
  'https://domainSanyaman.students.nomoredomains.xyz',
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

