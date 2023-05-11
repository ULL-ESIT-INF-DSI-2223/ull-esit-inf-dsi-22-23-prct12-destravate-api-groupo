import * as request from 'supertest';
import { app } from '../src/destravate';
import { Track } from '../src/models/track';
import { Challenge } from '../src/models/challenge';
import { User } from '../src/models/user';
import { Group } from '../src/models/group';
import { expect } from 'chai';


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

let challengeId = '';


beforeEach(async () => {
  await Track.deleteMany();
  await Challenge.deleteMany();
  await User.deleteMany();
  await Group.deleteMany();

  const newChallenge = await new Challenge(firstChallenge).save();
  challengeId = newChallenge._id.toString();

 

  // const firstChallenge = {
  //   name: "Exploracion Magica",
  //   tracks: [
  //     trackId
  //   ],
  //   activity: "running"
  // }
  // const newChallenge = await new Challenge(firstChallenge).save();
  // const challengeId = newChallenge._id.toString();
  // const firstUser = {
  //   name: "Pablo",
  //   activity: "running",
  //   friends: [
  //     trackId
  //   ],
  //   friendsGroups: [
  //     {
  //       name: "grupo1",
  //       friends: [

  //       ]
  //     }
  //   ],
  //   trainingStats: {
  //     weekly: {
  //       length: 1,
  //       unevenness: 1
  //     },
  //     monthly: {
  //       length: 2,
  //       unevenness: 2
  //     },
  //     yearly: {
  //       length: 3,
  //       unevenness: 3
  //       }
  //     },
  //     favoriteTracks: [
  //       trackId
  //     ],
  //     activeChallenges: [
  //       challengeId
  //     ],
  //     trackHistory: [
  //       {
  //         tracks: [
  //           trackId
  //       ],
  //         date: "13-11-2021"
  //       }
  //     ]
  //   }  
  // await new User(firstUser).save();
  // const firstGroup = {
  //   name: "Grupo de senderismo",
  //   members: [

  //   ],
  //   favoriteTracks: [
  //     trackId
  //   ],
  //   trackHistory: [
  //     {
  //       tracks: [
  //         trackId
  //       ],
  //       date: "13-11-2021"
  //     },    
  //   ]
  // }
  // await new Group(firstGroup).save();
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
    await request(app).get("/challenges?name=Primerchallenge").expect(200);
  });
  it("Should successfully consult a specific challenge by ID", async () => {
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