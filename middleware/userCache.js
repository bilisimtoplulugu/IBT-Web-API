import {client as redisClient} from '../server';

export default async (req, res, next) => {
  console.log(req.route.path);
  switch (req.route.path) {
    case '/all-joined-events': {
      const {username} = req.query;
      const joinedEvents = await redisClient.get(`${username}-joined-events`);
      if (joinedEvents) return res.send(JSON.parse(joinedEvents));
      return next();
    }
    case '/auth':{
        console.log(req.qqq)
        next();
        console.log(req.qqq)
    }
    default: {
      //:username
      console.log('l')
      const {username} = req.params;
      const user = await redisClient.get(username);
      if (user) return res.send(JSON.parse(user));
      return next();
    }
  }
};
