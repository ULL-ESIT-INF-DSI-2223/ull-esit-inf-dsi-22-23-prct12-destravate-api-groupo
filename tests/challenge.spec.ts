import * as request from 'supertest';
import { app } from '../src/destravate';
import { Track } from '../src/models/track';
import { Challenge } from '../src/models/challenge';
import { User } from '../src/models/user';
import { Group } from '../src/models/group';
//import { expect } from 'chai';

  

//let trackId = '';

beforeEach(async () => {
  await Track.deleteMany();
  await Challenge.deleteMany();
  await User.deleteMany();
  await Group.deleteMany();


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
    await request(app).post('/challenges').send({
      name: "Exploracion Curiosa",
      tracks: [
        trackId
      ],
      activity: "running"
    }).expect(201);
  });
});