import * as express from 'express';
import { Track } from '../models/track'
import { Challenge } from '../models/challenge';
import { User } from '../models/user';
import { Group } from '../models/group';
import { updateKms } from './challenge';

export const trackRouter = express.Router();

export async function deleteInOtherObjects(track) {
  // Cuando se elimina una ruta, también lo hace del reto.
  const trackChallenge = await Challenge.find({
    tracks: track._id
  });
      
  trackChallenge.forEach(async (item) => {
    const index = item.tracks.indexOf(track._id);
  
    if (index > -1) {
      item.tracks.splice(index, 1);
      await item.save();
    }
    await updateKms(item);
  });

  // Cuando se elimina una ruta, también lo hace de las rutas favoritas del usuario.
  const trackUser = await User.find({
    favoriteTracks: track._id
  });
      
  trackUser.forEach(async (item) => {
    const index = item.favoriteTracks.indexOf(track._id);
  
    if (index > -1) {
      item.favoriteTracks.splice(index, 1);
      await item.save();
    }
  });

  // Cuando se elimina una ruta, también lo hace de las rutas favoritas del grupo.
  const trackGroup = await Group.find({
    favoriteTracks: track._id
  });
      
  trackGroup.forEach(async (item) => {
    const index = item.favoriteTracks.indexOf(track._id);
  
    if (index > -1) {
      item.favoriteTracks.splice(index, 1);
      await item.save();
    }
  });
}

trackRouter.get('/',  async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.send(tracks);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }  
});

trackRouter.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id); 
  
    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  } 
});

trackRouter.post('/', async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A track name must be provided',
    });
  } 

  const allowedUpdates = ['name', 'startGeolocation', 'endGeolocation', 'length', 'unevenness', 'activity', 'rating'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const track = await Track.findOneAndUpdate({
      name: req.query.name.toString()
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.patch('/:id', async (req, res) => {  
  const allowedUpdates = ['name', 'startGeolocation', 'endGeolocation', 'length', 'unevenness', 'activity', 'rating'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const track = await Track.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

trackRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A track name must be provided',
    });
  }
  try {
    const track = await Track.findOneAndDelete({
      name: req.query.name.toString(),
    });
    
    if (!track) {
      return res.status(404).send();
    } else {
      res.send(track);
    }

    await deleteInOtherObjects(track);

    } catch (error) {
      return res.status(500).send(error);
    }  
});

trackRouter.delete('/:id', async (req, res) => {
  try {
    const track = await Track.findByIdAndDelete(req.params.id);

    if (!track) {
      return res.status(404).send();
    } else {
      res.send(track);
    }
 
    await deleteInOtherObjects(track);

  } catch (error) {
    return res.status(500).send(error);
  }
});