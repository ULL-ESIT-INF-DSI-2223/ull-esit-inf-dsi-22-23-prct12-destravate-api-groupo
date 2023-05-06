import * as express from 'express';
import { Track } from '../models/track'
import { Challenge } from '../models/challenge';

export const challengeRouter = express.Router();


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

  let kms = 0;
  
  try {
    for (let i = 0; i < challenge.tracks.length; i++) {
      const track = await Track.findById(challenge.tracks[i]);
      if (!track) {
        return res.status(404).send();
      }
      kms += track.length;
    }
    challenge.kms = kms;
    await challenge.save();
    return res.status(201).send(challenge);
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
      res.status(404).send();
    } else {
      res.send(challenge);
    }
  } catch {
    res.status(400).send();
  }  
});

challengeRouter.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      res.status(404).send();
    } else {
      res.send(challenge);
    }
  } catch {
    res.status(400).send();
  }
});