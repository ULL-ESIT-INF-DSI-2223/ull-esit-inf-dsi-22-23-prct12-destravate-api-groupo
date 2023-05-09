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
export async function updateKms(challenge, res) {
  let kms = 0;

  for (let i = 0; i < challenge.tracks.length; i++) {
    const track = await Track.findById(challenge.tracks[i]);
    if (!track) {
      return res.status(404).send();
    }
    kms += track.length;
  }
  challenge.kms = kms;
  await challenge.save();
}

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

challengeRouter.post('/', async (req, res) => {
  const challenge = new Challenge(req.body);

  // Comprobar que los tracks existen en la base de datos.
  for (let i = 0; i < challenge.tracks.length; i++) {
    const checkTrack = await Track.findById(challenge.tracks[i]);
    if (!checkTrack) {
      return res.status(404).send({error: "Any track is not in the database"})
    }
  }

  // Comprobar que los usuarios existen en la base de datos.
  for (let i = 0; i < challenge.users.length; i++) {
    const checkUser = await User.findById(challenge.users[i]);
    if (!checkUser) {
      return res.status(404).send({error: "Any user is not in the database"})
    }
  }
  
  try {
    await updateKms(challenge, res);
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send(error);
  }
});

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
      
      // Comprobar que los tracks existen en la base de datos.
      for (let i = 0; i < challenge.tracks.length; i++) {
        const checkTrack = await Track.findById(challenge.tracks[i]);
        if (!checkTrack) {
          return res.status(404).send({error: "Any track is not in the database"})
        }
      }

      // Comprobar que los usuarios existen en la base de datos.
      for (let i = 0; i < challenge.users.length; i++) {
        const checkUser = await User.findById(challenge.users[i]);
        if (!checkUser) {
          return res.status(404).send({error: "Any user is not in the database"})
        }
      }      
      
      await updateKms(challenge, res);  
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

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

      // Comprobar que los tracks existen en la base de datos.
      for (let i = 0; i < challenge.tracks.length; i++) {
        const checkTrack = await Track.findById(challenge.tracks[i]);
        if (!checkTrack) {
          return res.status(404).send({error: "Any track is not in the database"})
        }
      }

      // Comprobar que los usuarios existen en la base de datos.
      for (let i = 0; i < challenge.users.length; i++) {
        const checkUser = await User.findById(challenge.users[i]);
        if (!checkUser) {
          return res.status(404).send({error: "Any user is not in the database"})
        }
      }  

      await updateKms(challenge, res);  
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


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

  } catch (error) {
    return res.status(500).send(error);
  }  
});

challengeRouter.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return res.status(404).send();
    } else {
      res.send(challenge);
    }

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

  } catch (error) {
    return res.status(500).send(error);
  }
});