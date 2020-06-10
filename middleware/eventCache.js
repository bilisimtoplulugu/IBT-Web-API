import {client as redisClient} from '../server';

export default async (req, res, next) => {
  console.log(req.route.path);
  switch (req.route.path) {
    case '/past':
      const pastValue = await redisClient.get('pastEvents');
      if (pastValue) return res.send(JSON.parse(pastValue));
      return next();
    case '/near':
      const nearValue = await redisClient.get('nearEvents');
      if (nearValue) return res.send(JSON.parse(nearValue));
      return next();
    default:
      //:eventUrl
      const {eventUrl} = req.params;
      const event = await redisClient.get(eventUrl);
      if (event) return res.send(JSON.parse(event));
      return next();
  }
};
