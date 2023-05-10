import * as request from 'supertest';
import { app } from '../src/app';
import { Track } from '../src/models/track';
import { expect } from 'chai';
import { response } from 'express';

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
  const newTrack = await new Track(firstTrack).save();  
  trackId = newTrack._id.toString();
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
      unevenness: 450,
      activity: "bike",
      rating: 7.2
    }).expect(201);
  });

  it('Should throw an 500 error when creating a track', async () => {
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

  it('Should throw an 500 error due to do an invalid modification by name', async () => {
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

  it('Should throw an 500 error due to do an invalid modification by ID', async () => {
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
}); 

