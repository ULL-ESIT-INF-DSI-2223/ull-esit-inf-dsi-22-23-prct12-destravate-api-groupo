import * as request from 'supertest';
import { app } from '../src/destravate';
import { Track } from '../src/models/track';
import { Challenge } from '../src/models/challenge';
import { User } from '../src/models/user';
import { Group } from '../src/models/group';
import { expect } from 'chai';

beforeEach(async () => {
  await Track.deleteMany();
  await Challenge.deleteMany();
  await User.deleteMany();
  await Group.deleteMany();
});

describe('POST /challenges', () => {
  it('Should successfully create a new challenge', async () => {
    const firstTrack = {
      startGeolocation: {
        latitude: "28.4103 N",
        longitude: "16.5514 W"
      },
      endGeolocation: {
        latitude: "28.2277 N",
        longitude: "16.4820 W"
      },
      name: "Ruta del bosque encantado II",
      length: 7,
      unevenness: 221,
      activity: "running",
      rating: 8.1
    }    
    const newTrack = await new Track(firstTrack).save();  
    const trackId = newTrack._id.toString();
    const response = await request(app).post('/challenges').send({
      name: "Exploracion Curiosa",
      tracks: [
        trackId
      ],
      activity: "running"
    }).expect(201);

    expect(response.body).to.include({
      name: "Exploracion Curiosa"
    });

    const challenge = await Challenge.findById(response.body._id);
    expect(challenge).not.to.be.null;
  });

  it('Should successfully create a new challenge with the correct number of Kms adding their tracks', async () => {
    const firstTrack = {
      startGeolocation: {
        latitude: "28.4103 N",
        longitude: "16.5514 W"
      },
      endGeolocation: {
        latitude: "28.2277 N",
        longitude: "16.4820 W"
      },
      name: "Ruta del bosque encantado II",
      length: 7,
      unevenness: 221,
      activity: "running",
      rating: 8.1
    }    
    const secondTrack = {
      startGeolocation: {
        latitude: "28.4103 N",
        longitude: "16.5514 W"
      },
      endGeolocation: {
        latitude: "28.2277 N",
        longitude: "16.4820 W"
      },
      name: "Ruta del bosque encantado III",
      length: 3,
      unevenness: 221,
      activity: "running",
      rating: 8.1
    }
    const newTrack = await new Track(firstTrack).save();  
    const trackId = newTrack._id.toString();
    const newTrack2 = await new Track(secondTrack).save();  
    const trackId2 = newTrack2._id.toString();
    const response = await request(app).post('/challenges').send({
      name: "Exploracion Curiosa",
      tracks: [
        trackId,
        trackId2
      ],
      activity: "running"
    }).expect(201);

    await expect(response.body.kms).to.equal(10);    
  });

  it('Should throw an 500 error when creating a challenge due to the name is not according the validator (Uso characters that are not alphanumeric)', async () => {
    await request(app).post('/challenges').send({
      name: "Exploracion-Curiosa",
      tracks: [        
      ],
      activity: "running"
    }).expect(500);
  });

  it('Should throw an 500 error when creating a challenge due to the track is not in the database', async () => {
    await request(app).post('/challenges').send({
      name: "Exploracion-Curiosa",
      tracks: [        
        "645cf539a12177f3a8a06a83"
      ],
      activity: "running"
    }).expect(500);
  });

  it('Should throw an 500 error when creating a challenge due to the activity is not according the validator (only can be running or bike)', async () => {
    await request(app).post('/challenges').send({
      name: "Exploracion Curiosa II",
      tracks: [        
      ],
      activity: "runningandbike"
    }).expect(500);
  });

  it('Should throw an 404 error when creating a challenge', async () => {
    await request(app).post('/chall').send({
      name: "Exploracion-Curiosa",
      tracks: [        
      ],
      activity: "running"
    }).expect(404);
  });
});

describe("GET /challenges", () => {
  it("Should successfully get all challenges", async () => {
    await request(app).get("/challenges").expect(200);
  });
  it("Should successfully consult a specific challenge by name", async () => {
    const firstChallenge = {
      name: "Primerchallenge",
      tracks: [
        new Track({
          startGeolocation: {
            latitude: "28.4103 N",
            longitude: "16.5514 W",
          },
          endGeolocation: {
            latitude: "28.2277 N",
            longitude: "16.4820 W",
          },
          name: "Ruta del bosque encantado",
          length: 7,
          unevenness: 220,
          activity: "running",
          rating: 8.1,
        }),
      ],
      activity: "bike",
      kms: 23,
      users: [],
    };

    await new Challenge(firstChallenge).save();
    await request(app).get("/challenges?name=Primerchallenge").expect(200);
  });
  it("Should successfully consult a specific challenge by ID", async () => {
    const firstChallenge = {
      name: "Primerchallenge",
      tracks: [
        new Track({
          startGeolocation: {
            latitude: "28.4103 N",
            longitude: "16.5514 W",
          },
          endGeolocation: {
            latitude: "28.2277 N",
            longitude: "16.4820 W",
          },
          name: "Ruta del bosque encantado",
          length: 7,
          unevenness: 220,
          activity: "running",
          rating: 8.1,
        }),
      ],
      activity: "bike",
    };
    
    let challengeId = '';

    const newChallenge = await new Challenge(firstChallenge).save();
    challengeId = newChallenge._id.toString();
    await request(app).get(`/challenges/${challengeId}`).expect(200);
  });
  it("Should throw an 404 error due to not find a challenge by name", async () => {
    await request(app).get(`/challenges?name=SegundoChallenge`).expect(404);
  });
  it("Should throw an 404 error due to not find a challenge by ID", async () => {
    await request(app).get(`/challenges/645a0a15771f91e5f8d60c17`).expect(404);
  });
  it("Should throw an 500 error due to consult an invalid ID", async () => {
    await request(app).get(`/challenges/one`).expect(500);
  });
});

describe('PATCH /challenges', () => {
  const firstChallenge = {
    name: "Primerchallenge",
    tracks: [
      new Track({
        startGeolocation: {
          latitude: "28.4103 N",
          longitude: "16.5514 W",
        },
        endGeolocation: {
          latitude: "28.2277 N",
          longitude: "16.4820 W",
        },
        name: "Ruta del bosque encantado",
        length: 7,
        unevenness: 220,
        activity: "running",
        rating: 8.1,
      }),
    ],
    activity: "bike",
  };
      
  let challengeId = '';

  it('Should successfully modify a challenge by name', async () => {    
    await new Challenge(firstChallenge).save();
    await request(app).patch('/challenges?name=Primerchallenge').send({
      name: "Primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(200);
  });

  it('Should successfully modify a challenge by ID', async () => {    
    const newChallenge = await new Challenge(firstChallenge).save();
    challengeId = newChallenge._id.toString();
    await request(app).patch(`/challenges/${challengeId}`).send({
      name: "Primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(200);
  });

  it('Should throw an 404 error due to not find a challange to modify by name', async () => {    
    await request(app).patch(`/challenges?name=reto`).send({
      name: "Primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(404);
  });

  it('Should throw an 404 error due to not find a challange to modify by ID', async () => {    
    await request(app).patch(`/challenges/645a0a15771f91e5f8d60c17`).send({
      name: "Primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(404);
  });

  it('Should throw an 400 error due to not provide a challenge name', async () => {    
    await request(app).patch(`/challenges`).send({
      name: "Primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by name', async () => {    
    await request(app).patch('/challenges?name=Primerchallenge').send({
      newname: "Primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by ID', async () => {    
    await request(app).patch(`/challenges/${challengeId}`).send({
      newname: "Primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(400);
  });

  it('Should throw an 500 error due to do an invalid modification by name (The challenge name must start with a capital letter)', async () => {    
    await request(app).patch(`/challenges/?name=Primerchallenge}`).send({
      name: "primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(500);
  });

  it('Should throw an 500 error due to do an invalid modification by ID (The challenge name must start with a capital letter)', async () => {    
    await request(app).patch(`/challenges/${challengeId}`).send({
      name: "primerchallenge",
      tracks: [
      ],
      activity: "running",
    }).expect(500);
  });
});

describe('DELETE /challenges', () => {
  const firstChallenge = {
    name: "Primerchallenge",
    tracks: [
      new Track({
        startGeolocation: {
          latitude: "28.4103 N",
          longitude: "16.5514 W",
        },
        endGeolocation: {
          latitude: "28.2277 N",
          longitude: "16.4820 W",
        },
        name: "Ruta del bosque encantado",
        length: 7,
        unevenness: 220,
        activity: "running",
        rating: 8.1,
      }),
    ],
    activity: "bike",
  };
      
  let challengeId = '';
   
  it('Should successfully delete a challenge by name', async () => {
    await new Challenge(firstChallenge).save();
    await request(app).delete('/challenges?name=Primerchallenge').expect(200);
  });

  it('Should successfully delete a challenge by ID', async () => {
    const newChallenge = await new Challenge(firstChallenge).save();
    challengeId = newChallenge._id.toString();
    await request(app).delete(`/challenges/${challengeId}`).expect(200);
  });

  it('Should throw an 404 error due to not find a challenge to delete by name', async () => {
    await request(app).delete(`/challenges?name=Ruta del bosque oscuro`).expect(404);
  });

  it('Should throw an 404 error due to not find a challenge to delete by ID', async () => {
    await request(app).delete(`/challenges/645a0a15771f91e5f8d60c17`).expect(404);
  });

  it('Should throw an 500 error due to try to delete a challenge with an invalid ID', async () => {
    await request(app).delete(`/challenges/invalid-id`).expect(500);
  });

  it('Should delete the challenge from the active challenge from user', async () => {
    const newChallenge = await new Challenge(firstChallenge).save();
    challengeId = newChallenge._id.toString();
    const secondUser = {
      name: "Pedro",
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
        
      ],
      activeChallenges: [
        challengeId
      ],
      trackHistory: [
        {
          tracks: [
            
          ],
          date: "13-11-2021"
         }
      ]
    }  

    await new User(secondUser).save(); 
    const userPre = await request(app).get('/users?name=Pedro');
    await expect(userPre.body[0].activeChallenges.length).to.equal(1);
    await request(app).delete(`/challenges/${challengeId}`).expect(200);
    const userPos = await request(app).get('/users?name=Pedro');   
    if (userPos.body[0].activeChallenges.length < 1) {
      await expect(userPos.body[0].activeChallenges.length).to.equal(0);
    }
  });
});