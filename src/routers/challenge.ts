import * as express from 'express';
import { Track } from '../models/track'
import { Challenge } from '../models/challenge';
import { User } from '../models/user'

export const challengeRouter = express.Router();

/**
 * Update Kms when the challenger's tracks are modified
 * @param challenge Challenge whose kms are going to be update
 * @param res Response to the express server
 * @returns void
 */
export async function updateKms(challenge) {
  let kms = 0;

  for (let i = 0; i < challenge.tracks.length; i++) {
    const track = await Track.findById(challenge.tracks[i]);
    if (!track) {
      throw new Error("Any track is not found")
    }
    kms += track.length;
  }
  challenge.kms = kms;
  await challenge.save();
}

/**
 * Check if an item exists in the database when its ID is going to use for create/modify a challenge, in this case the tracks.
 * @param challenge Challenge which tracks will be checked
 */
export async function checkItemsExists(challenge) {
  // Comprobar que los tracks existen en la base de datos.
  for (let i = 0; i < challenge.tracks.length; i++) {
    const checkTrack = await Track.findById(challenge.tracks[i]);
    if (!checkTrack) {
      throw new Error("Any track is not in the database")
    }
  }
}

/**
 * When a challenge is deleted, this is deleted in the rest of the items that include it.
 * @param challenge Challenge that will be deleted in the rest of the items.
 */
export async function deleteInOtherObjects(challenge) {
  // Cuando se elimina un reto, también lo hace de los retos activos del usuario.
  const challengeUser = await User.find({
    activeChallenges: challenge._id
  });
      
  challengeUser.forEach(async (item) => {
    const index = item.activeChallenges.indexOf(challenge._id);
  
    if (index > -1) {
      item.activeChallenges.splice(index, 1);
      await item.save();
    }
  });
}

/**
 * Get all the challenges in the database or only one if the query string name exists
 */
challengeRouter.get('/',  async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const challenge = await Challenge.find(filter);

    if (challenge.length !== 0) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }  
});

/**
 * Get a specify challenge according to its ID
 */
challengeRouter.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id); 
  
    if (challenge) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  } 
});

/**
 * Create a challenge in the database
 */
challengeRouter.post('/', async (req, res) => {
  const challenge = new Challenge(req.body);
  
  try {
    await checkItemsExists(challenge);
    await updateKms(challenge);
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a challenge in the database using its name as query string
 */
challengeRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A challenge name must be provided',
    });
  } 

  const allowedUpdates = ['name', 'tracks', 'activity', 'users'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const challenge = await Challenge.findOneAndUpdate({
      name: req.query.name.toString()
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (challenge) { 
       
      await checkItemsExists(challenge);
      await updateKms(challenge);  
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a challenge in the database using its ID
 */
challengeRouter.patch('/:id', async (req, res) => {  
  const allowedUpdates = ['name', 'tracks', 'activity', 'users'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (challenge) {

      await checkItemsExists(challenge);
      await updateKms(challenge);  
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Delete a challenge in the database using its name as query string
 */
challengeRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A challenge name must be provided',
    });
  }
  try {
    const challenge = await Challenge.findOneAndDelete({
      name: req.query.name.toString(),
    });

    if (!challenge) {
      return res.status(404).send();
    } else {
      res.send(challenge);
    }

    await deleteInOtherObjects(challenge);

  } catch (error) {
    return res.status(500).send(error);
  }  
});

/**
 * Delete a challenge in the database using its ID
 */
challengeRouter.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return res.status(404).send();
    } else {
      res.send(challenge);
    }

    await deleteInOtherObjects(challenge);

  } catch (error) {
    return res.status(500).send(error);
  }
});