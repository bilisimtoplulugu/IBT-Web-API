import {client as redisClient} from '../server';

export default async (req, res, next) => {
  switch (req.route.path) {
    case '/all-joined-events': {
      const {username} = req.query;
      const joinedEvents = await redisClient.get(`${username}-joined-events`);
      if (joinedEvents) return res.send(JSON.parse(joinedEvents));
      return next();
    }
    case '/:username': {
      //:username
      const {username} = req.params;
      const user = await redisClient.get(username);
      if (user) return res.send(JSON.parse(user));
      return next();
    }
  }
};