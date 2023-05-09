import * as request from 'supertest';
import { app } from '../src/app';
import { Track } from '../src/models/track';
import { expect } from 'chai';

beforeEach(async () => {
  await Track.deleteMany();
});

describe('POST /tracks', () => {
  it('Should successfully create a new track', async () => {
    await request(app).post('/tracks').send({
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
      rating: 7.2
    }).expect(201);
  });
});
