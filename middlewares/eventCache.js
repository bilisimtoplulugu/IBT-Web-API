import {client as redisClient} from '../server';

export default async (req, res, next) => {
  switch (req.route.path) {
    case '/past':
      const pastValue = await redisClient.get('pastEvents');
      if (pastValue) return res.send(JSON.parse(pastValue));
      return next();
    case '/near':
      const nearValue = await redisClient.get('nearEvents');
      if (nearValue) return res.send(JSON.parse(nearValue));
      return next();
    case '/generate':
      await redisClient.del('nearEvents');
      return next();
    case '/join':
    case '/unjoin': {
      const {eventUrl,username} = req.body;
      await redisClient.del(username);
      await redisClient.del(eventUrl);
      return next();
    }
    default:
      //:eventUrl
      const {eventUrl} = req.params;
      const event = await redisClient.get(eventUrl);
      if (event) return res.send(JSON.parse(event));
      return next();
  }
};
