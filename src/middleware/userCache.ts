import {client as redisClient} from '../server';

export default async (req: any, res: any, next: any) => {
  switch (req.route.path) {
    case '/all-joined-events': {
      const {username} = req.query;
      const joinedEvents: any = await redisClient.get(
        `${username}-joined-events`
      );
      if (joinedEvents) return res.send(JSON.parse(joinedEvents));
      return next();
    }
    case '/:username': {
      const {username} = req.params;
      const user: any = await redisClient.get(username);
      if (user) return res.send(JSON.parse(user));
      return next();
    }
    case '/change-personal': {
      console.log('hiır');
      const {username} = req.body;
      await redisClient.del(username);
      return next();
    }
  }
};
