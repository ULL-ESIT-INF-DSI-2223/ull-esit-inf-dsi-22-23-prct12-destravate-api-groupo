// //en los delete tener en cuenta los ultimos de track

// import * as request from 'supertest';
// import { app } from '../src/destravate';
// import { Track } from '../src/models/track';
// import { Challenge } from '../src/models/challenge';
// import { User } from '../src/models/user';
// import { Group } from '../src/models/group';
// import { expect } from 'chai';

// const firstUser = {
//     name: 'UserTest',
//     activity: 'bike',
//     friends: [],
//     friendsGroups: [{
//         name: 'GroupTest',
//         members: [],
//     }],
//     trainingStats: {
//         weekly: {
//             length: 0,
//             uneveness: 0,
//         },
//         monthly: {
//             length: 0,
//             uneveness: 0,
//         },
//         yearly: {
//             length: 0,
//             uneveness: 0,
//         },
//     },
//     favoriteTracks: [],
//     activeChallenges: [],
//     trackHistory: [{
//         track: [],
//         date: '13-05-2021',
//     }],
// }

// let userID = '';

// beforeEach(async () => {
//     await User.deleteMany({});
//     await Track.deleteMany({});
//     await Challenge.deleteMany({});
//     await Group.deleteMany({});
    
//     const newUser = await new User(firstUser).save();
//     userID = newUser._id.toString();
//     //...
// });