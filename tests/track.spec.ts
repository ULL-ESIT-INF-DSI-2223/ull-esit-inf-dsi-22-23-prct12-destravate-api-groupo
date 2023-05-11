import * as request from 'supertest';
import { app } from '../src/destravate';
import { Track } from '../src/models/track';
import { Challenge } from '../src/models/challenge';
import { User } from '../src/models/user';
import { Group } from '../src/models/group';
import { expect } from 'chai';

const firstTrack = {
  startGeolocation: {
    latitude: "28.4103 N",
    longitude: "16.5514 W"
  },
  endGeolocation: {
    latitude: "28.2277 N",
    longitude: "16.4820 W"
  },
  name: "Ruta del bosque encantado",
  length: 7,
  unevenness: 220,
  activity: "running",
  rating: 8.1
}

let trackId = '';

beforeEach(async () => {
  await Track.deleteMany();
  await Challenge.deleteMany();
  await User.deleteMany();
  await Group.deleteMany();
  const newTrack = await new Track(firstTrack).save();  
  trackId = newTrack._id.toString();  
  const firstChallenge = {
      name: "Exploracion Magica",
      tracks: [
        trackId
      ],
      activity: "running"
  }
  const newChallenge = await new Challenge(firstChallenge).save();
  const challengeId = newChallenge._id.toString();
  const firstUser = {
    name: "Pablo",
    activity: "running",
    friends: [
      
    ],
    friendsGroups: [
      {
        name: "grupo1",
        friends: [

        ]
      }
    ],
    trainingStats: {
      weekly: {
        length: 1,
        unevenness: 1
      },
      monthly: {
        length: 2,
        unevenness: 2
      },
      yearly: {
        length: 3,
        unevenness: 3
        }
      },
    favoriteTracks: [
      trackId
    ],
    activeChallenges: [
      challengeId
    ],
    trackHistory: [
      {
        tracks: [
          trackId
        ],
        date: "13-11-2021"
       }
    ]
  }  
  await new User(firstUser).save();
  const firstGroup = {
    name: "Grupo de senderismo",
    members: [

    ],
    favoriteTracks: [
      trackId
    ],
    trackHistory: [
      {
        tracks: [
          trackId
        ],
        date: "13-11-2021"
      },    
    ]
  }
  await new Group(firstGroup).save();
});

describe('POST /tracks', () => {
  it('Should successfully create a new track', async () => {
    const response = await request(app).post('/tracks').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(201);

    expect(response.body).to.include({
      name: "Ruta de los volcanes"
    });

    const track = await Track.findById(response.body._id);
    expect(track).not.to.be.null;
  });

  it('Should throw an 500 error when creating a track due to the name is not according the validator (Uso characters that are not alphanumeric)', async () => {
    await request(app).post('/tracks').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los -----",
      length: 8,
      unevenness: 4,
      activity: "running",
      rating: 13
    }).expect(500);
  });

  it('Should throw an 500 error when creating a track due to the length and unevenness are not according the validator (they are not > 0)', async () => {
    await request(app).post('/tracks').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta 12",
      length: -8,
      unevenness: -4,
      activity: "running",
      rating: 13
    }).expect(500);
  });

  it('Should throw an 404 error when creating a track', async () => {
    await request(app).post('/trac').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 12,
      unevenness: 20,
      activity: "bike",
      rating: 3
    }).expect(404);
  });
});

describe('GET /tracks', () => {
  it('Should successfully consult all tracks', async () => {
    await request(app).get('/tracks').expect(200);
  });

  it('Should successfully consult a specific track by name', async () => {
    await request(app).get('/tracks?name=Ruta del bosque encantado').expect(200);
  });

  it('Should successfully consult a specific track by ID', async () => {
    await request(app).get(`/tracks/${trackId}`).expect(200);
  });

  it('Should throw an 404 error due to not find a user by name', async () => {
    await request(app).get('/tracks?name=Ruta de la arena').expect(404);
  });

  it('Should throw an 404 error due to not find a user by ID', async () => {
    await request(app).get('/tracks/645a0a15771f91e5f8d60c17').expect(404);
  });

  it('Should throw an 500 error due to consult an invalid ID', async () => {
    await request(app).get('/tracks/invalid-id').expect(500);
  });
}); 

describe('PATCH /tracks', () => {
  it('Should successfully modify a track by name', async () => {
    await request(app).patch('/tracks?name=Ruta del bosque encantado').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(200);
  });

  it('Should successfully modify a track by ID', async () => {
    await request(app).patch(`/tracks/${trackId}`).send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(200);
  });

  it('Should throw an 404 error due to not find a track to modify by name', async () => {
    await request(app).patch('/tracks?name=Ruta del bosque oscuro').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(404);
  });

  it('Should throw an 404 error due to not find a track to modify by ID', async () => {
    await request(app).patch('/tracks/645a0a15771f91e5f8d60c17').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(404);
  });

  it('Should throw an 400 error due to not provide a track name', async () => {
    await request(app).patch('/tracks').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by name', async () => {
    await request(app).patch('/tracks?name=Ruta del bosque encantado').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      newName: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by ID', async () => {
    await request(app).patch(`/tracks/${trackId}`).send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      newName: "Ruta de los volcanes",
      length: 12,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(400);
  });

  it('Should throw an 500 error due to do an invalid modification by name (length can\'t be <= 0)', async () => {
    await request(app).patch('/tracks?name=Ruta del bosque encantado').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 0,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(500);
  });

  it('Should throw an 500 error due to do an invalid modification by name (The track name must start with a capital letter)', async () => {
    await request(app).patch('/tracks?name=Ruta del bosque encantado').send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "ruta de los volcanes",
      length: 34,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(500);
  });

  it('Should throw an 500 error due to do an invalid modification by ID (length can\'t be <= 0)', async () => {
    await request(app).patch(`/tracks/${trackId}`).send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "Ruta de los volcanes",
      length: 0,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(500);
  });

  it('Should throw an 500 error due to do an invalid modification by ID (The track name must start with a capital letter)', async () => {
    await request(app).patch(`/tracks/${trackId}`).send({
      startGeolocation: {
        latitude: "28.3141 N",
        longitude: "16.5538 W"
      },
      endGeolocation: {
        latitude: "28.2186 N",
        longitude: "16.7172 W"
      },
      name: "ruta de los volcanes",
      length: 23,
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(500);
  });
}); 

describe('DELETE /tracks', () => {
  it('Should successfully delete a track by name', async () => {
    await request(app).delete('/tracks?name=Ruta del bosque encantado').expect(200);
  });

  it('Should successfully delete a track by ID', async () => {
    await request(app).delete(`/tracks/${trackId}`).expect(200);
  });

  it('Should throw an 404 error due to not find a track to delete by name', async () => {
    await request(app).delete(`/tracks?name=Ruta del bosque oscuro`).expect(404);
  });

  it('Should throw an 404 error due to not find a track to delete by ID', async () => {
    await request(app).delete(`/tracks/645a0a15771f91e5f8d60c17`).expect(404);
  });

  it('Should throw an 500 error due to try to delete a track with an invalid ID', async () => {
    await request(app).delete(`/tracks/invalid-id`).expect(500);
  });

  it('Should delete the track from the tracks that make up the challenge', async () => {
    const challengePre = await request(app).get('/challenges?name=Exploracion Magica');
    expect(challengePre.body[0].tracks.length).to.equal(1);
    await request(app).delete(`/tracks/${trackId}`).expect(200);
    const challengePos = await request(app).get('/challenges?name=Exploracion Magica');
    expect(challengePos.body[0].tracks.length).to.equal(0);
  });

  // it('Should delete the track from the user\'s and group\'s favoriteTracks', async () => {
  //   const userPre = await request(app).get('/users?name=Pablo');
  //   const groupPre = await request(app).get('/groups?name=Grupo de senderismo');
  //   expect(userPre.body[0].favoriteTracks.length).to.equal(1);
  //   expect(groupPre.body[0].favoriteTracks.length).to.equal(1);
  //   await request(app).delete(`/tracks/${trackId}`).expect(200);
  //   const userPos = await request(app).get('/users?name=Pablo');    
  //   const groupPos = await request(app).get('/groups?name=Grupo de senderismo');
  //   expect(userPos.body[0].favoriteTracks.length).to.equal(0);    
  //   expect(groupPos.body[0].favoriteTracks.length).to.equal(0);     
  // });
}); 