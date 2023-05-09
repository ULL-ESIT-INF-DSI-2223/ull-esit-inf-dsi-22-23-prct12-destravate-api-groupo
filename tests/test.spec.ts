import * as request from 'supertest';
import { app } from '../src/app';
import { Track } from '../src/models/track';
import { expect } from 'chai';

beforeEach(async () => {
  await Track.deleteMany();
  //await new User(firstUser).save();
});

describe('POST /tracks', () => {
  it('Should successfully create a new track', async () => {
    await request(app).post('/tracks').send({
      startGeolocation: {
        latitude: "1.54",
        longitude: "2.32"
      },
      endGeolocation: {
        latitude: "6.43",
        longitude: "7.12"
      },
      name: "Ruta87",
      length: 12,
      unevenness: 20,
      activity: "bike",
      rating: 6.8
    }).expect(201);
  });
});
