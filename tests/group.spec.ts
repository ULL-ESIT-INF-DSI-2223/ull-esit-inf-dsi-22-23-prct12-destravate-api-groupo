import * as request from 'supertest';
import { app } from '../src/destravate';
import { User } from '../src/models/user';
import { Group } from '../src/models/group';
import { expect} from 'chai';

const firstGroup = {
  name: "Grupo de senderismo",
  members: [

  ],
  favoriteTracks: [

  ],
  trackHistory: [
    {
      tracks: [

      ],
      date: "13-11-2021"
    },    
  ]
}

let groupID = '';

beforeEach(async () => {
    await Group.deleteMany();
    
    const newGroup = await new Group(firstGroup).save();
    groupID = newGroup._id.toString();
});

describe('POST /groups', () => {
  it('Should successfully create a new group', async () => {
    const response = await request(app).post('/groups').send({
      name: "Grupo de senderismo 2",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(201)

    expect(response.body).to.include({
      name: "Grupo de senderismo 2"
    });

    const group = await Group.findById(response.body._id);
    expect(group).not.to.be.null;
  });

  it('Should throw an 500 error when creating a group due to the name is not according the validator (Uso characters that are not alphanumeric)', async () => {
    await request(app).post('/groups').send({
      name: "Grupo de senderismo -",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating a group due to the users in members are not in the database', async () => {
    await request(app).post('/groups').send({
      name: "Grupo de senderismo -",
      members: [
        "645cf539a12177f3a8a06a83"
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating a group due to the tracks in favoriteTracks are not in the database', async () => {
    await request(app).post('/groups').send({
      name: "Grupo de senderismo -",
      members: [

      ],
      favoriteTracks: [
        "645cf539a12177f3a8a06a83"
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating a group due to the tracks in trackHistory are not in the database', async () => {
    await request(app).post('/groups').send({
      name: "Grupo de senderismo -",
      members: [

      ],
      favoriteTracks: [

      ],
      trackHistory: [
        {
          tracks: [
            "645cf539a12177f3a8a06a83"
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating a group due to group name doesn\'t start by a capital letter', async () => {
    await request(app).post('/groups').send({
      name: "grupo de senderismo",
      members: [

      ],
      favoriteTracks: [

      ],
      trackHistory: [
        {
          tracks: [
            "645cf539a12177f3a8a06a83"
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(500)
  });

  it('Should throw an 404 error when creating a group, due to an invalid path', async () => {
    await request(app).post('/gro').send({
      name: "grupo de senderismo",
      members: [

      ],
      favoriteTracks: [

      ],
      trackHistory: [
        {
          tracks: [
            "645cf539a12177f3a8a06a83"
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(404)
  });
});

describe('GET /groups', () => {
  it('Should successfully consult all groups', async () => {
    await request(app).get('/groups').expect(200);
  });

  it('Should successfully consult a specific group by name', async () => {
    await request(app).get('/groups?name=Grupo de senderismo').expect(200);
  });

  
  it('Should successfully consult a specific group by ID', async () => {
    const secondGroup = {
      name: "Grupo de senderismo 2",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }
    
    let groupID2 = '';

    const newGroup2 = await new Group(secondGroup).save();
    groupID2 = newGroup2._id.toString();

    await request(app).get(`/groups/${groupID2}`).expect(200);
  });

  it('Should throw an 404 error due to not find a group by name', async () => {
    await request(app).get('/groups?name=No es un grupo').expect(404);
  });

  it('Should throw an 404 error due to not find a group by ID', async () => {
    await request(app).get('/groups/645a0a15771f91e5f8d60c17').expect(404);
  });

  it('Should throw an 500 error due to ge by an invlid ID', async () => {
    await request(app).get('/groups/invalid-id').expect(500);
  });
}); 

describe('PATCH /groups', () => {
  const secondGroup = {
    name: "Grupo de senderismo 2",
    members: [
  
    ],
    favoriteTracks: [
  
    ],
    trackHistory: [
      {
        tracks: [
  
        ],
        date: "13-11-2021"
      },    
    ]
  }
  
  let groupID2 = '';

  it('Should successfully modify a group by ID', async () => {    
    const newGroup = await new Group(secondGroup).save();
    groupID2 = newGroup._id.toString();
    await request(app).patch(`/groups/${groupID2}`).send({
      name: "Grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(200);
  });

  it('Should successfully modify a user by name', async () => {    
    await new Group(secondGroup).save();
    await request(app).patch('/groups?name=Grupo de senderismo 2').send({
      name: "Grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(200);
  });

  it('Should throw an 404 error due to not find a group to modify by name', async () => {    
    await new Group(secondGroup).save();
    await request(app).patch('/groups?name=Grupo de escalada').send({
      name: "Grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(404);
  });

  it('Should throw an 404 error due to not find a group to modify by ID', async () => {    
    await new Group(secondGroup).save();
    await request(app).patch('/groups/645a0a15771f91e5f8d60c17').send({
      name: "Grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(404);
  });

  it('Should throw an 400 error due to not provide a group name', async () => {    
    await new Group(secondGroup).save();
    await request(app).patch('/groups').send({
      name: "Grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by name', async () => {    
    await new Group(secondGroup).save();
    await request(app).patch('/groups?name=Grupo de senderismo 2').send({
      newname: "Grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by ID', async () => {    
    const newGroup = await new Group(secondGroup).save();
    groupID2 = newGroup._id.toString();
    await request(app).patch(`/groups/${groupID2}`).send({
      newname: "Grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(400);
  });

  it('Should throw an 500 error due to do an invalid modification by name (The group name must start with a capital letter)', async () => {    
    await new Group(secondGroup).save();
    await request(app).patch('/groups?name=Grupo de senderismo 2').send({
      name: "grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(500);
  });

  it('Should throw an 500 error due to do an invalid modification by ID (The group name must start with a capital letter)', async () => {    
    const newGroup = await new Group(secondGroup).save();
    groupID2 = newGroup._id.toString();
    await request(app).patch(`/groups/${groupID2}`).send({
      name: "grupo de senderismo 3",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }).expect(500);
  });
  
});

describe('DELETE /groups', () => {
  it('Should successfully delete an group by name', async () => {
    await request(app).delete('/groups?name=Grupo de senderismo').expect(200);
  });
  
  it('Should successfully delete an group by ID', async () => {
    const secondGroup = {
      name: "Grupo de senderismo 2",
      members: [
    
      ],
      favoriteTracks: [
    
      ],
      trackHistory: [
        {
          tracks: [
    
          ],
          date: "13-11-2021"
        },    
      ]
    }
    
    let groupID2 = '';
    const newGroup = await new Group(secondGroup).save();
    groupID2 = newGroup._id.toString();
    await request(app).delete(`/groups/${groupID2}`).expect(200);
  });
  
  it('Should throw an 404 error due to not find an group to delete by name', async () => {
    await request(app).delete(`/groups?name=Grupo no existe`).expect(404);
  });
  
  it('Should throw an 404 error due to not find an group to delete by ID', async () => {
    await request(app).delete(`/groups/645a0a15771f91e5f8d60c17`).expect(404);
  });

  it('Should throw an 500 error due to try to delete an group with an invalid ID', async () => {
    await request(app).delete(`/challenges/invalid-id`).expect(500);
  });
});