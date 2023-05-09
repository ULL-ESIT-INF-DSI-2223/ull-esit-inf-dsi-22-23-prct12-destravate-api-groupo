import * as express from "express";
import { User } from "../models/user";
import { Track } from "../models/track"
import { Group } from "../models/group";
import { Challenge } from "../models/challenge";

export const userRouter = express.Router();

export async function checkErrors(user, res) {

  // Comprobar que los amigos existen en la base de datos.
  for (let i = 0; i < user.friends.length; i++) {
    const checkUser = await User.findById(user.friends[i]);
    if (!checkUser) {
      return res.status(404).send({error: "Any friend is not in the database"})
    }
  }

  // Comprobar que los amigos dentro de grupo de amigos existen en la base de datos.
  for (let i = 0; i < user.friendsGroups.length; i++) {
    for (let j = 0; j < user.friendsGroups[i].friends.length; j++) {
      const checkUser = await User.findById(user.friendsGroups[i].friends[j]);
      if (!checkUser) {
        return res.status(404).send({error: 'Any friend in friendsGroup is not in the database'})
      }
    }
  }

  // Comprobar que las rutas favoritas del usuario existen en la base de datos.
  for (let i = 0; i < user.favoriteTracks.length; i++) {
    const checkTrack = await Track.findById(user.favoriteTracks[i]);
    if (!checkTrack) {
      return res.status(404).send({error: "Any track in favoriteTracks is not in the database"})
    }
  }

  // Comprobar que los retos activos del usuario existen en la base de datos.
  for (let i = 0; i < user.activeChallenges.length; i++) {
    const checkChallenge = await Challenge.findById(user.activeChallenges[i]);
    if (!checkChallenge) {
      return res.status(404).send({error: "Any challenge in activeChallenges is not in the database"})
    }
  }

  // Comprobar que las rutas dentro del historial de rutas existen en la base de datos.
  for (let i = 0; i < user.trackHistory.length; i++) {
    for (let j = 0; j < user.trackHistory[i].tracks.length; j++) {
      const checkTrack = await Track.findById(user.trackHistory[i].tracks[j]);
      if (!checkTrack) {
        return res.status(404).send({error: 'Any track in trackHistory is not in the database'})
      }
    }
  }
}

userRouter.get('/', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.send(users);
    }    
    return res.status(404).send();    
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      return res.send(user);
    }
    return res.status(404).send();    
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.post('/', async (req, res) => {
  const user = new User(req.body);

  //await checkErrors(user, res)

  // Comprobar que los amigos existen en la base de datos.
  for (let i = 0; i < user.friends.length; i++) {
    const checkUser = await User.findById(user.friends[i]);
    if (!checkUser) {
      return res.status(404).send({error: "Any friend is not in the database"})
    }
  }

  // Comprobar que los amigos dentro de grupo de amigos existen en la base de datos.
  for (let i = 0; i < user.friendsGroups.length; i++) {
    for (let j = 0; j < user.friendsGroups[i].friends.length; j++) {
      const checkUser = await User.findById(user.friendsGroups[i].friends[j]);
      if (!checkUser) {
        return res.status(404).send({error: 'Any friend in friendsGroup is not in the database'})
      }
    }
  }

  // Comprobar que las rutas favoritas del usuario existen en la base de datos.
  for (let i = 0; i < user.favoriteTracks.length; i++) {
    const checkTrack = await Track.findById(user.favoriteTracks[i]);
    if (!checkTrack) {
      return res.status(404).send({error: "Any track in favoriteTracks is not in the database"})
    }
  }

  // Comprobar que los retos activos del usuario existen en la base de datos.
  for (let i = 0; i < user.activeChallenges.length; i++) {
    const checkChallenge = await Challenge.findById(user.activeChallenges[i]);
    if (!checkChallenge) {
      return res.status(404).send({error: "Any challenge in activeChallenges is not in the database"})
    }
  }

  // Comprobar que las rutas dentro del historial de rutas existen en la base de datos.
  for (let i = 0; i < user.trackHistory.length; i++) {
    for (let j = 0; j < user.trackHistory[i].tracks.length; j++) {
      const checkTrack = await Track.findById(user.trackHistory[i].tracks[j]);
      if (!checkTrack) {
        return res.status(404).send({error: 'Any track in trackHistory is not in the database'})
      }
    }
  }

  try {
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A user name must be provided',
    });
  }

  const allowedUpdates = ['name', 'activity', 'friends', 'friendsGroups', 'trainingStats', 'favoriteTracks', 'activeChallenges', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const user = await User.findOneAndUpdate({
      name: req.query.name.toString()
    },
    req.body,
    { 
      new: true,
      runValidators: true }
    );

    if (user) {

      // Comprobar que los amigos existen en la base de datos.
      for (let i = 0; i < user.friends.length; i++) {
        const checkUser = await User.findById(user.friends[i]);
        if (!checkUser) {
          return res.status(404).send({error: "Any friend is not in the database"})
        }
      }

      // Comprobar que los amigos dentro de grupo de amigos existen en la base de datos.
      for (let i = 0; i < user.friendsGroups.length; i++) {
        for (let j = 0; j < user.friendsGroups[i].friends.length; j++) {
          const checkUser = await User.findById(user.friendsGroups[i].friends[j]);
          if (!checkUser) {
            return res.status(404).send({error: 'Any friend in friendsGroup is not in the database'})
          }
        }
      }

      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['name', 'activity', 'friends', 'friendsGroups', 'trainingStats', 'favoriteTracks', 'activeChallenges', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Update is not permitted",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    });

    if (user) {

      // Comprobar que los amigos existen en la base de datos.
      for (let i = 0; i < user.friends.length; i++) {
        const checkUser = await User.findById(user.friends[i]);
        if (!checkUser) {
          return res.status(404).send({error: "Any friend is not in the database"})
        }
      }

      // Comprobar que los amigos dentro de grupo de amigos existen en la base de datos.
      for (let i = 0; i < user.friendsGroups.length; i++) {
        for (let j = 0; j < user.friendsGroups[i].friends.length; j++) {
          const checkUser = await User.findById(user.friendsGroups[i].friends[j]);
          if (!checkUser) {
            return res.status(404).send({error: 'Any friend in friendsGroup is not in the database'})
          }   
        }
      }

      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

userRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A user name must be provided',
    });
  }
  try {
    const user = await User.findOneAndDelete({
      name: req.query.name.toString(),
    });

    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    } 

    // Cuando se elimina una usuario también lo hace de los grupos a los que pertenezca.
    const userGroup = await Group.find({
      members: user._id,
    });
      
    userGroup.forEach(async (item) => {
      const index = item.members.indexOf(user.id);
  
      if (index > -1) {
        item.members.splice(index, 1);
        await item.save();
      }
    });

    } catch (error) {
      return res.status(500).send(error);
    }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    }

    // Cuando se elimina una usuario también lo hace de los grupos a los que pertenezca.
    const userGroup = await Group.find({
      members: user._id,
    });
      
    userGroup.forEach(async (item) => {
      const index = item.members.indexOf(user.id);
  
      if (index > -1) {
        item.members.splice(index, 1);
        await item.save();
      }
    });

  } catch (error){
    return res.status(500).send(error);
  }
});