import * as express from 'express';
import { Document, connect, model, Schema } from 'mongoose';

const router = express.Router();

connect('mongodb://127.0.0.1:27017/destravate-app').then(() => {
  console.log('Connected to the database');
}).catch(() => {
  console.log('Something went wrong when conecting to the database');
});

interface TrackDocumentInterface extends Document {
  name: string,
  startGeolocation: {
    latitude: string,
    longitude: string
  },
  endGeolocation: {
    latitude: string,
    longitude: string
  },
  length: number,
  unevenness: number,  
  activity: 'bike' | 'running',
  rating: number
}

const TrackSchema = new Schema<TrackDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  startGeolocation: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    }
  },
  endGeolocation: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    }
  },
  length: {
    type: Number,
    required: true,
  },
  unevenness: {
    type: Number,
    required: true,
  },
  activity: {
    type: String,
    required: true,
    enum: ['bike', 'running'],
  },
  rating: {
    type: Number,
    required: true,
  }
});

const Track = model<TrackDocumentInterface>('Track', TrackSchema);

router.get('/', (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  Track.find(filter).then((tracks) => {
    if (Track.length !== 0) {
      res.send(tracks);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  })
});

router.get('/:id', (req, res) => {
  Track.findById(req.params.id).then((track) => {
    if (!track) {
      res.status(404).send();
    } else {
      res.send(track);
    }
  }).catch(() => {
    res.status(500).send();
  })
})

router.post('/', (req, res) => {
  const track = new Track(req.body);

  track.save().then((result) => {
    res.status(201).send(result);
  }).catch((error) => {
    res.status(400).send(error);
  })
})

router.delete('/', (req, res) => {
  if (!req.query.name) {
    res.status(400).send({
      error: 'A name must be provided',
    });
  } else {
    Track.findOneAndDelete({name: req.query.name.toString()}).then((track) => {
      if (!track) {
        res.status(404).send();
      } else {
        res.send(track);
      }
    }).catch(() => {
      res.status(400).send();
    })
  }
})

router.delete('/:id', (req, res) => {
  Track.findByIdAndDelete(req.params.id).then((track) => {
    if (!track) {
      res.status(404).send();
    } else {
      res.send(track);
    }
  }).catch(() => {
    res.status(400).send();
  })
})

export default router;