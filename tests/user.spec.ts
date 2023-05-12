import * as request from 'supertest';
import { app } from '../src/destravate';
import { User } from '../src/models/user';
import { Group } from '../src/models/group';
import { expect} from 'chai';

const firstUser = {
    name: 'UserTest',
    activity: 'bike',
    friends: [],
    friendsGroups: [{
        name: 'GroupTest',
        friends: [],
    }],
    trainingStats: {
        weekly: {
            length: 0,
            uneveness: 0,
        },
        monthly: {
            length: 0,
            uneveness: 0,
        },
        yearly: {
            length: 0,
            uneveness: 0,
        },
    },
    favoriteTracks: [],
    activeChallenges: [],
    trackHistory: [{
        track: [],
        date: '13-05-2021',
    }],
}

let userID = '';

beforeEach(async () => {
    await User.deleteMany();
    
    const newUser = await new User(firstUser).save();
    userID = newUser._id.toString();
});

describe('POST /users', () => {
  it('Should successfully create a new user', async () => {
    const response = await request(app).post('/users').send({
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

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(201)

    expect(response.body).to.include({
      name: "Pedro"
    });

    const user = await User.findById(response.body._id);
    expect(user).not.to.be.null;
  });

  it('Should throw an 500 error when creating an user due to the name is not according the validator (Uso characters that are not alphanumeric)', async () => {
    await request(app).post('/users').send({
      name: "Pedro-",
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

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating an user due to the users in friends is not in the database', async () => {
    await request(app).post('/users').send({
      name: "Pedro",
      activity: "running",
      friends: [
        "645cf539a12177f3a8a06a83"
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

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating an user due to the friends in friendsGroup is not in the database', async () => {
    await request(app).post('/users').send({
      name: "Pedro",
      activity: "running",
      friends: [

      ],
      friendsGroups: [
        {
          name: "grupo1",
          friends: [
            "645cf539a12177f3a8a06a83"
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

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating an user due to the tracks in favoriteTracks is not in the database', async () => {
    await request(app).post('/users').send({
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
        "645cf539a12177f3a8a06a83"
      ],
      activeChallenges: [

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating an user due to the challenge in activeChallenge is not in the database', async () => {
    await request(app).post('/users').send({
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
        "645cf539a12177f3a8a06a83"
      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating an user due to the tracks in trackHistory is not in the database', async () => {
    await request(app).post('/users').send({
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

      ],
      trackHistory: [
        {
          tracks: [
            "645cf539a12177f3a8a06a83"
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)
  });

  it('Should throw an 500 error when creating an user due to tracks in favoriteTracks is not in the database', async () => {
    await request(app).post('/users').send({
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
        "645cf539a12177f3a8a06a83"
      ],
      activeChallenges: [

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)

    it('Should throw an 500 error when creating an user due to a challenge in activeChallenge is not in the database', async () => {
      await request(app).post('/users').send({
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
          "645cf539a12177f3a8a06a83"
        ],
        trackHistory: [
          {
            tracks: [
                  
            ],
            date: "13-11-2021"
           }
        ]
      }).expect(500)
    });
  });

  it('Should throw an 500 error when creating a user due to the activity is not according the validator (only can be running or bike)', async () => {
    await request(app).post('/users').send({
      name: "Pedro",
      activity: "runningandbike",
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

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500)
  });

  it('Should throw an 404 error when creating a challenge, due to an invalid path', async () => {
    await request(app).post('/us').send({
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

      ],
      trackHistory: [
        {
          tracks: [
                
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(404)
  });  
});

describe('GET /users', () => {
    it('Should successfully consult all users', async () => {
      await request(app).get('/users').expect(200);
    });
  
    it('Should successfully consult a specific user by name', async () => {
      await request(app).get('/users?name=UserTest').expect(200);
    });
  
    it('Should successfully consult a specific user by ID', async () => {
      await request(app).get(`/users/${userID}`).expect(200);
    });
  
    it('Should throw an 404 error due to not find a user by name', async () => {
      await request(app).get('/users?name=Pepe').expect(404);
    });
  
    it('Should throw an 404 error due to not find a user by ID', async () => {
      await request(app).get('/users/645a0a15771f91e5f8d60c17').expect(404);
    });
  }); 

describe('PATCH /users', () => {
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
    ],
    activeChallenges: [
    ],
    trackHistory: [
      {
        tracks: [
        ],
        date: "13-11-2021"
       }
    ]
  }  

  let userId = '';

  it('Should successfully modify a user by ID', async () => {    
    const newUser = await new User(firstUser).save();
    userId = newUser._id.toString();
    await request(app).patch(`/users/${userId}`).send({
      name: "Pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(200);
  });

  it('Should successfully modify a user by name', async () => {    
    await new User(firstUser).save();
    await request(app).patch('/users?name=Pablo').send({
      name: "Pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(200);
  });

  it('Should throw an 404 error due to not find an user to modify by name', async () => {    
    await new User(firstUser).save();
    await request(app).patch('/users?name=Miguel').send({
      name: "Pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(404);
  });

  it('Should throw an 404 error due to not find an user to modify by ID', async () => {    
    const newUser = await new User(firstUser).save();
    userId = newUser._id.toString();
    await request(app).patch(`/users/645a0a15771f91e5f8d60c17`).send({
      name: "Pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(404);
  });  

  it('Should throw an 400 error due to not provide a user name', async () => {    
    await new User(firstUser).save();
    await request(app).patch('/users').send({
      name: "Pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by name', async () => {    
    await new User(firstUser).save();
    await request(app).patch('/users').send({
      newname: "Pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(400);
  });

  it('Should throw an 400 error due to the update is not permited by ID', async () => {    
    const newUser = await new User(firstUser).save();
    userId = newUser._id.toString();
    await request(app).patch(`/users/${userId}`).send({
      newname: "Pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(400);
  });

  it('Should throw an 500 error due to do an invalid modification by name (The user name must start with a capital letter)', async () => {    
    await new User(firstUser).save();
    await request(app).patch('/users?name=Pablo').send({
      name: "pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500);
  });

  it('Should throw an 500 error due to do an invalid modification by ID (The user name must start with a capital letter)', async () => {    
    const newUser = await new User(firstUser).save();
    userId = newUser._id.toString();
    await request(app).patch(`/users/${userId}`).send({
      name: "pablo2",
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
      ],
      trackHistory: [
        {
          tracks: [
          ],
          date: "13-11-2021"
         }
      ]
    }).expect(500);
  });
});

describe('DELETE /users', () => {
  it('Should successfully delete an user by name', async () => {
    await request(app).delete('/users?name=UserTest').expect(200);
  });
  
  it('Should successfully delete an user by ID', async () => {
    await request(app).delete(`/users/${userID}`).expect(200);
  });
  
  it('Should throw an 404 error due to not find an user to delete by name', async () => {
    await request(app).delete(`/users?name=Jaimito`).expect(404);
  });
  
  it('Should throw an 404 error due to not find an user to delete by ID', async () => {
    await request(app).delete(`/users/645a0a15771f91e5f8d60c17`).expect(404);
  });

  it('Should throw an 500 error due to try to delete an user with an invalid ID', async () => {
    await request(app).delete(`/challenges/invalid-id`).expect(500);
  });

  it('Should delete the user from the active members from a group', async () => {
    const firstGroup = {
      name: "Grupo de senderismo 2",
      members: [
        userID
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
    await new Group(firstGroup).save();
    const groupPre = await request(app).get('/groups?name=Grupo de senderismo 2');
    await expect(groupPre.body[0].members.length).to.equal(1);
    await request(app).delete(`/users/${userID}`).expect(200);
    const groupPos = await request(app).get('/groups?name=Grupo de senderismo 2');   
    if (groupPos.body[0].members.length < 1) {
      await expect(groupPos.body[0].members.length).to.equal(0);
    }
  });

  it('Should delete the user from the friends of other users', async () => {
    const secondUser = {
      name: 'UserTest2',
      activity: 'bike',
      friends: [
        userID
      ],
      friendsGroups: [{
          name: 'GroupTest',
          friends: [],
      }],
      trainingStats: {
          weekly: {
              length: 0,
              uneveness: 0,
          },
          monthly: {
              length: 0,
              uneveness: 0,
          },
          yearly: {
              length: 0,
              uneveness: 0,
          },
      },
      favoriteTracks: [],
      activeChallenges: [],
      trackHistory: [{
          track: [],
          date: '13-05-2021',
      }],
  }
    await new User(secondUser).save();
    const userPre = await request(app).get('/users?name=UserTest2');
    await expect(userPre.body[0].friends.length).to.equal(1);
    await request(app).delete(`/users/${userID}`).expect(200);
    const userPos = await request(app).get('/users?name=UserTest2');   
    if (userPos.body[0].friends.length < 1) {
      await expect(userPos.body[0].friends.length).to.equal(0);
    }
  });
}); 