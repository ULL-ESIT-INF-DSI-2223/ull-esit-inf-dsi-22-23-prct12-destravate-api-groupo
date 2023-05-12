import * as express from "express";
import { User } from "../models/user";
import { Track } from "../models/track"
import { Group } from "../models/group";
import { Challenge } from "../models/challenge";

export const userRouter = express.Router();

/**
 * Check if an item exists in the database when its ID is going to use for create/modify a user, in this case the tracks, users and challenges.
 * @param user User which tracks, users and challenges will be checked
 */
export async function checkItemsExists(user) {

  // Comprobar que los amigos existen en la base de datos.
  for (let i = 0; i < user.friends.length; i++) {
    const checkUser = await User.findById(user.friends[i]);
    if (!checkUser) {
      throw new Error("Any friend is not in the database")      
    }
  }

  // Comprobar que los amigos dentro de grupo de amigos existen en la base de datos.
  for (let i = 0; i < user.friendsGroups.length; i++) {
    for (let j = 0; j < user.friendsGroups[i].friends.length; j++) {
      const checkUser = await User.findById(user.friendsGroups[i].friends[j]);
      if (!checkUser) {
        throw new Error("Any friend in friendsGroup is not in the database")            
      }
    }
  }

  // Comprobar que las rutas favoritas del usuario existen en la base de datos.
  for (let i = 0; i < user.favoriteTracks.length; i++) {
    const checkTrack = await Track.findById(user.favoriteTracks[i]);
    if (!checkTrack) {
      throw new Error("Any track in favoriteTracks is not in the database")           
    }
  }

  // Comprobar que los retos activos del usuario existen en la base de datos.
  for (let i = 0; i < user.activeChallenges.length; i++) {
    const checkChallenge = await Challenge.findById(user.activeChallenges[i]);
    if (!checkChallenge) {
      throw new Error("Any challenge in activeChallenges is not in the database")        
    }
  }

  // Comprobar que las rutas dentro del historial de rutas existen en la base de datos.
  for (let i = 0; i < user.trackHistory.length; i++) {
    for (let j = 0; j < user.trackHistory[i].tracks.length; j++) {
      const checkTrack = await Track.findById(user.trackHistory[i].tracks[j]);
      if (!checkTrack) {
        throw new Error("Any track in trackHistory is not in the database")        
      }
    }
  }
}

/**
 * When a user is deleted, this is deleted in the rest of the items that include it.
 * @param user User that will be deleted in the rest of the items.
 */
export async function deleteInOtherObjects(user) {

  // Cuando se elimina un usuario también lo hace de los grupos a los que pertenezca.
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

  // Cuando se elimina un usuario también lo hace de los amigos de otros usuarios.
  const userFriends = await User.find({
    friends: user._id,
  });
      
  userFriends.forEach(async (item) => {
    const index = item.friends.indexOf(user.id);

    if (index > -1) {
      item.friends.splice(index, 1);
      await item.save();
    }
  });
}

/**
 * Get all the users in the database or only one if the query string name exists
 */
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

/**
 * Get a specify user according to its ID
 */
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

/**
 * Create a user in the database
 */
userRouter.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    await checkItemsExists(user);
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a user in the database using its name as query string
 */
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
      await checkItemsExists(user);
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a user in the database using its ID
 */
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
      await checkItemsExists(user);
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Delete a user in the database using its name as query string
 */
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

    await deleteInOtherObjects(user);

    } catch (error) {
      return res.status(500).send(error);
    }
});

/**
 * Delete a user in the database using its ID
 */
userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    }

    await deleteInOtherObjects(user);

  } catch (error){
    return res.status(500).send(error);
  }
});