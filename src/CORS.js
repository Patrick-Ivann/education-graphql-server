import cors from 'cors';

const originWhitelist = [
  'http://localhost:3000',
];

const corsOptions = {
  origin(origin, callback) {
    const originIsWhitelisted = originWhitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },



  credentials: true, // Set true if response to preflight request doesn't pass access control check
};

export const corsWrapper = () => cors(corsOptions);

