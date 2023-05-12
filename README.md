# Práctica 12 - Destravate: API Node/Express
Esta práctica consiste en la realización de una API REST, realizada mediante el uso de Node/Express, que nos permite hacer las operaciones CRUD (_Create_, _Read_, _Update_, _Delete_), para registrar actividades deportivas.
\
\
Esta práctica se ha realizado en grupo por los siguientes alumnos:
- Pablo de la Fuente Rodríguez (alu0101336152@ull.edu.es)
- José David Mur Álvarez (alu0101052168@ull.edu.es)
- Carlos Pío Reyes (alu0101132945@ull.edu.es)
\
\
El código fuente del proyecto se encuentra organizado en diferentes directorios y se hace uso de sintaxis ES para importar/exportar las distintas entidades.
## Requisitos del sistema
Para la creación de este sistema se proponen 4 elementos fundamentales: _Tracks_, Usuarios, Grupos y Retos. Para cada uno de ellos se ha creado en el directorio _models_ sus respectivas interfaces y esquemas para crear el modelo que será usado en la base de datos. Cabe destacar que algunos de los elementos de información se han omitidos con el fin de evitar bucles, tal y cómo comentó el profesor, es por ello que en _Tracks_ y Retos no se incluyen los Usuarios, pero sí a la inversa, para así evitar bucles.
### Track
```TypeScript
/**
 * Track interface for apply it in the Track schema
 */
export interface TrackDocumentInterface extends Document {
  name: string,
  startGeolocation: {
    latitude: string,
    longitude: string
  },
  endGeolocation: {
    latitude: string,
    longitude: string
  },
  length: number,
  unevenness: number,  
  activity: 'bike' | 'running',
  rating: number
}

/**
 * Track Schema for create Track objects in the database
 */
export const TrackSchema = new Schema<TrackDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Track name must start with a capital letter');
      } else if (!validator.default.isAlphanumeric(value.replace(/\s/g, ''))) {
        throw new Error('Track name must contain alphanumeric characters and spaces only')
      }
    }
  },
  startGeolocation: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    }
  },
  endGeolocation: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    }
  },
  length: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value <= 0) {
        throw new Error('Unevenness must be greater than 0');
      }
    } 
  },
  unevenness: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value <= 0) {
        throw new Error('Unevenness must be greater than 0');
      }
    } 
  },
  activity: {
    type: String,
    required: true,
    enum: ['bike', 'running'],
  },
  rating: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0 || value > 10) {
        throw new Error('Rating must be greater than or equal to 0 and lower than or equal to 10');
      }
    }    
  }
});

export const Track = model<TrackDocumentInterface>('Track', TrackSchema);
```
En el código anterior podemos, ver primero la declaración de la interfaz y su posterior esquema, con todos los campos solicitados en el guion de la práctica. En el esquema se ha añadido además una serie de validadores gracias al módulo _validator_, para asegurarnos que a la hora de crear el objeto se introducen valores válidos, como que el nombre de la ruta deba de empezar por mayúscula y que solamente pueda usar caractéres alphanuméricos y espacios, además de que la longitud de la ruta y la pendiente debe de ser un número positivo y finalmente la clafisicación de la ruta debe de estar entre 0 y 10.
### Challenge
```TypeScript
/**
 * Challenge interface for apply it in the challenge schema
 */
export interface ChallengeDocumentInterface extends Document {
  name: string,
  tracks: TrackDocumentInterface[],
  activity: 'bike' | 'running',
  kms: number,
}

/**
 * Challenge Schema for create challenge objects in the database
 */
export const ChallengeSchema = new Schema<ChallengeDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Challenge name must start with a capital letter');
      } else if (!validator.default.isAlphanumeric(value.replace(/\s/g, ''))) {
        throw new Error('Track name must contain alphanumeric characters and spaces only')
      }
    }
  },
  tracks: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: 'Track'
  },
  activity: {
    type: String,
    required: true,
    enum: ['bike', 'running'],
  },
  kms: {
    type: Number,
    required: false,
  }
});

export const Challenge = model<ChallengeDocumentInterface>('Challenge', ChallengeSchema);
```
En el caso de los retos, al igual que en rutas, declaramos la interfaz y su posterior esquema. Podemos ver que _tracks_ y _users_ son arrays de _ObjectId_, que hacen referencia a los documentos de _Track_ y _User_ respectivamente. Además, se ha añadido un validador para asegurarnos que el nombre del reto empieza por mayúscula y que solamente puede usar caractéres alphanuméricos y espacios.
### User
```TypeScript
/**
 * User interface for apply it in the User schema
 */
export interface UserDocumentInterface extends Document {
  _id: string;
  name: string;
  activity: "bike" | "running";
  friends: UserDocumentInterface[];
  friendsGroups: {
    name: string;
    friends: UserDocumentInterface[];
  }[];
  trainingStats: {
    weekly: {
      length: number;
      unevenness: number;
    };
    monthly: {
      length: number;
      unevenness: number;
    };
    yearly: {
      length: number;
      unevenness: number;
    };
  };
  favoriteTracks: TrackDocumentInterface[];
  activeChallenges: ChallengeDocumentInterface[];
  trackHistory: {
    tracks: TrackDocumentInterface[];
    date: string;
  }[];
}

/**
 * User Schema for create User objects in the database
 */
export const UserSchema = new Schema<UserDocumentInterface>({
  _id: {
    type: String,
    required: false,
    auto: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('User name must start with a capital letter');
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error('User name must contain alphanumeric characters only')
      }
    }
  },
  activity: {
      type: String,
      required: true,
      enum: ["running", "bike"],
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      default: []
    },
  ],
  friendsGroups: [
    {
      name: {
        type: String,
        required: true,
      },
      friends: [
        {
          type: Schema.Types.ObjectId,
          required: false,
          default: [],
          ref: "User"
        },
      ],
    },
  ],
  trainingStats: {
    weekly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
    monthly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
    yearly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
  },
  favoriteTracks:
    {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: "Track",
    },
  
  activeChallenges: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Challenge",
    },
  ],
  trackHistory: [
    {
      tracks: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Track",
      }],
      date: {
        type: String,
        required: true,
        validate: (value: string) => {
          if (!value.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/)) {
            throw new Error('Date must have this format: DD-MM-YYYY');
          }
        }
      },
    },
  ],
});

export const User = model<UserDocumentInterface>("User", UserSchema);
```
En el caso de los usuarios, al igual que en rutas y retos, declaramos la interfaz y su posterior esquema. Podemos ver que _friends_ y _activeChallenges_ son arrays de _ObjectId_, que hacen referencia a los documentos de _User_ y _Challenge_ respectivamente. Tenemos en el _id_, que si no se le pasa un valor, se le asigna un _ObjectId_ de mongoose. Además del validador del nombre, hemos añadido también en _trackHistory_ un validador para asegurarnos que la fecha tiene el formato correcto.
### Group
```TypeScript
/**
 * Group interface for apply it in the Group schema
 */
export interface GroupDocumentInterface extends Document {
  name: string;
  members: UserDocumentInterface[];
  groupStats: {
    weekly: {
      length: number;
      unevenness: number;
    };
    monthly: {
      length: number;
      unevenness: number;
    };
    yearly: {
      length: number;
      unevenness: number;
    };
  };
  ranking: {
    byLenght: UserDocumentInterface[];
    byUnevenness: UserDocumentInterface[];
  };
  favoriteTracks: TrackDocumentInterface[];
  trackHistory: {
    tracks: TrackDocumentInterface[];
    date: string;
  }[];
}

/**
 * Group Schema for create Group objects in the database
 */
const GroupSchema = new Schema<GroupDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Group name must start with a capital letter');
      } else if (!validator.default.isAlphanumeric(value.replace(/\s/g, ''))) {
        throw new Error('Track name must contain alphanumeric characters and spaces only')
      }
    }
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  groupStats: {
    weekly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
    monthly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
    yearly: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
  },
  ranking: {
    byLenght: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
      },
    ],
    byUnevenness: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
      },
    ],
  },
  favoriteTracks: [
     {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Track",
      },
    ],
  trackHistory: [
    {
      tracks: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Track",
      }],
      date: {
        type: String,
        required: false,
        validate: (value: string) => {
          if (!value.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/)) {
            throw new Error('Date must have this format: DD-MM-YYYY');
          }
        }
      },
    },
  ],
});

export const Group = model<GroupDocumentInterface>("Group", GroupSchema);
```
En el caso de los grupos tenemos la misma estructura que en el resto. En este caso, _members_ es un array de _ObjectId_ que hace referencia a los documentos de _User_. En _ranking_ tenemos dos arrays de _ObjectId_ que hacen referencia a los documentos de _User_. En _trackHistory_ tenemos un array de objetos que contiene un array de _ObjectId_ que hace referencia a los documentos de _Track_ y una fecha con su validador correspondiente.
## Rutas de la API
El código se encuentra estructurado de la siguiente forma: dentro del directorio _routers_ se encuentra un fichero por cada una de las rutas anteriormente comentadas, las cuales se unen y son usadas por el servidor express, en el fichero _destravate_:
```TypeScript
export const app = express();
app.use(express.json());

app.use('/tracks', trackRouter);
app.use('/users', userRouter);
app.use('/groups', groupRouter);
app.use('/challenges', challengeRouter);

/**
 * Show 404 error if access to a wrong path.
 */
app.all('*', (_, res) => {
  res.status(404).send();
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000.')
})
```
En cada una de las rutas cuyo código se mostrará y explicará a continuación se han incluido todas las operaciones solicitadas en el enunciado de la práctica (POST, GET, PATCH, DELETE) usando tanto una _query string_ como el _id_.

### Tracks
```TypeScript
/**
 * When a track is deleted, this is deleted in other objects that incluid it.
 * @param track The track that is deleted.
 */
export async function deleteInOtherObjects(track) {
  // Cuando se elimina una ruta, también lo hace del reto.
  const trackChallenge = await Challenge.find({
    tracks: track._id
  });
      
  trackChallenge.forEach(async (item) => {
    const index = item.tracks.indexOf(track._id);
  
    if (index > -1) {
      item.tracks.splice(index, 1);
      await item.save();
    }
    await updateKms(item);
  });

  // Cuando se elimina una ruta, también lo hace de las rutas favoritas del usuario.
  const trackUser = await User.find({
    favoriteTracks: track._id
  });
      
  trackUser.forEach(async (item) => {
    const index = item.favoriteTracks.indexOf(track._id);
  
    if (index > -1) {
      item.favoriteTracks.splice(index, 1);
      await item.save();
    }
  });

  // Cuando se elimina una ruta, también lo hace de las rutas favoritas del grupo.
  const trackGroup = await Group.find({
    favoriteTracks: track._id
  });
      
  trackGroup.forEach(async (item) => {
    const index = item.favoriteTracks.indexOf(track._id);
  
    if (index > -1) {
      item.favoriteTracks.splice(index, 1);
      await item.save();
    }
  });
}

/**
 * Get all the tracks in the database or only one if the query string name exists
 */
trackRouter.get('/',  async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.send(tracks);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }  
});

/**
 * Get a specify track according to its ID
 */
trackRouter.get('/:id', async (req, res) => {
  try {
    const track = await Track.findById(req.params.id); 
  
    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  } 
});

/**
 * Create a track in the database
 */
trackRouter.post('/', async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Modify a track in the database using its name as query string
 */
trackRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A track name must be provided',
    });
  } 

  const allowedUpdates = ['name', 'startGeolocation', 'endGeolocation', 'length', 'unevenness', 'activity', 'rating'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const track = await Track.findOneAndUpdate({
      name: req.query.name.toString()
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Modify a track in the database using its ID
 */
trackRouter.patch('/:id', async (req, res) => {  
  const allowedUpdates = ['name', 'startGeolocation', 'endGeolocation', 'length', 'unevenness', 'activity', 'rating'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const track = await Track.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (track) {
      return res.send(track);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Delete a track in the database using its name as query string
 */
trackRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A track name must be provided',
    });
  }
  try {
    const track = await Track.findOneAndDelete({
      name: req.query.name.toString(),
    });
    
    if (!track) {
      return res.status(404).send();
    } else {
      res.send(track);
    }

    await deleteInOtherObjects(track);

    } catch (error) {
      return res.status(500).send(error);
    }  
});

/**
 * Delete a track in the database using its ID
 */
trackRouter.delete('/:id', async (req, res) => {
  try {
    const track = await Track.findByIdAndDelete(req.params.id);

    if (!track) {
      return res.status(404).send();
    } else {
      res.send(track);
    }
 
    await deleteInOtherObjects(track);

  } catch (error) {
    return res.status(500).send(error);
  }
});
```
Lo primero que observamos es una función _deleteInOtherObjects_ la cual es llamada cada vez que se elimina una ruta, para así actualizar el resto de objetos que incluyen dicha ruta, siendo estos los retos, los usuarios y los grupos. A continuación se implementan las operaciones a través de los métodos HTTP, comenzando con el GET, donde mediante el filtro y una _query_ _string_ podemos mostrar una ruta en concreto o todas las que se encuentran en la base de datos, también se ha incluido el get, donde la busqueda de la ruta se lleva a cabo por su identificador único dentro de la base de datos.
\
\
En cuanto al POST, se recuperó lo que ha introducido el usuario a través del body y si pasa todos los requisitos introducidos en el modelo, se añadirá la ruta a la base de datos. El PATCH sigue el mismo espíritu, primero tiene que encontrar la ruta que se desea modificar de distinta manera dependiendo si es con ID o mediante una _query string_, posteriormente se comprueba si los campos introducidos en el _body_ son aptos para la modificación, y si es así, se actualiza.
\
\
Finalmente tenemos el método DELETE, donde una vez más se lleva a cabo de las dos formas solicitadas y en ambas se llama a la función _deleteInOtherObjects_ para eliminar dicha ruta del resto de elementos, tal y como comentábamos anteriormente.
\
\
Para todas las rutas se han realizado una gran cantidad de pruebas con el fin de probar la mayor cantidad de combinaciones posibles y que las operaciones se llevan a cabo sin problema. La principal adición a las pruebas respecto de las prácticas anteriores es el uso de _supertest_. Las pruebas llevadas a cabo para _Tracks_ son las siguientes:
```
  POST /tracks
    ✔ Should successfully create a new track
    ✔ Should throw an 500 error when creating a track due to the name is not according the validator (Uso characters that are not alphanumeric)
    ✔ Should throw an 500 error when creating a track due to the length and unevenness are not according the validator (they are not > 0)
    ✔ Should throw an 500 error when creating a track due to the the activity is not according the validator (only can be running or bike)
    ✔ Should throw an 404 error when creating a track

  GET /tracks
    ✔ Should successfully consult all tracks
    ✔ Should successfully consult a specific track by name
    ✔ Should successfully consult a specific track by ID
    ✔ Should throw an 404 error due to not find a user by name
    ✔ Should throw an 404 error due to not find a user by ID
    ✔ Should throw an 500 error due to consult an invalid ID

  PATCH /tracks
    ✔ Should successfully modify a track by name
    ✔ Should successfully modify a track by ID
    ✔ Should throw an 404 error due to not find a track to modify by name
    ✔ Should throw an 404 error due to not find a track to modify by ID
    ✔ Should throw an 400 error due to not provide a track name
    ✔ Should throw an 400 error due to the update is not permited by name
    ✔ Should throw an 400 error due to the update is not permited by ID
    ✔ Should throw an 500 error due to do an invalid modification by name (length can't be <= 0)
    ✔ Should throw an 500 error due to do an invalid modification by name (The track name must start with a capital letter)
    ✔ Should throw an 500 error due to do an invalid modification by ID (length can't be <= 0)
    ✔ Should throw an 500 error due to do an invalid modification by ID (The track name must start with a capital letter)

  DELETE /tracks
    ✔ Should successfully delete a track by name
    ✔ Should successfully delete a track by ID
    ✔ Should throw an 404 error due to not find a track to delete by name
    ✔ Should throw an 404 error due to not find a track to delete by ID
    ✔ Should throw an 500 error due to try to delete a track with an invalid ID
    ✔ Should delete the track from the tracks that make up the challenge
    ✔ Should delete the track from the user's favoriteTracks
    ✔ Should delete the track from the group's favoriteTracks
```
### Challenges
```Typescript
/**
 * Update Kms when the challenger's tracks are modified
 * @param challenge Challenge whose kms are going to be update
 * @param res Response to the express server
 * @returns void
 */
export async function updateKms(challenge) {
  let kms = 0;

  for (let i = 0; i < challenge.tracks.length; i++) {
    const track = await Track.findById(challenge.tracks[i]);
    if (!track) {
      throw new Error("Any track is not found")
    }
    kms += track.length;
  }
  challenge.kms = kms;
  await challenge.save();
}

/**
 * Check if an item exists in the database when its ID is going to use for create/modify a challenge, in this case the tracks.
 * @param challenge Challenge which tracks will be checked
 */
export async function checkItemsExists(challenge) {
  // Comprobar que los tracks existen en la base de datos.
  for (let i = 0; i < challenge.tracks.length; i++) {
    const checkTrack = await Track.findById(challenge.tracks[i]);
    if (!checkTrack) {
      throw new Error("Any track is not in the database")
    }
  }
}

/**
 * When a challenge is deleted, this is deleted in the rest of the items that include it.
 * @param challenge Challenge that will be deleted in the rest of the items.
 */
export async function deleteInOtherObjects(challenge) {
  // Cuando se elimina un reto, también lo hace de los retos activos del usuario.
  const challengeUser = await User.find({
    activeChallenges: challenge._id
  });
      
  challengeUser.forEach(async (item) => {
    const index = item.activeChallenges.indexOf(challenge._id);
  
    if (index > -1) {
      item.activeChallenges.splice(index, 1);
      await item.save();
    }
  });
}

/**
 * Get all the challenges in the database or only one if the query string name exists
 */
challengeRouter.get('/',  async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const challenge = await Challenge.find(filter);

    if (challenge.length !== 0) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }  
});

/**
 * Get a specify challenge according to its ID
 */
challengeRouter.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id); 
  
    if (challenge) {
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  } 
});

/**
 * Create a challenge in the database
 */
challengeRouter.post('/', async (req, res) => {
  const challenge = new Challenge(req.body);
  
  try {
    await checkItemsExists(challenge);
    await updateKms(challenge);
    return res.status(201).send(challenge);
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a challenge in the database using its name as query string
 */
challengeRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A challenge name must be provided',
    });
  } 

  const allowedUpdates = ['name', 'tracks', 'activity', 'users'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const challenge = await Challenge.findOneAndUpdate({
      name: req.query.name.toString()
    },
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (challenge) { 
       
      await checkItemsExists(challenge);
      await updateKms(challenge);  
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a challenge in the database using its ID
 */
challengeRouter.patch('/:id', async (req, res) => {  
  const allowedUpdates = ['name', 'tracks', 'activity', 'users'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    });

    if (challenge) {

      await checkItemsExists(challenge);
      await updateKms(challenge);  
      return res.send(challenge);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Delete a challenge in the database using its name as query string
 */
challengeRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A challenge name must be provided',
    });
  }
  try {
    const challenge = await Challenge.findOneAndDelete({
      name: req.query.name.toString(),
    });

    if (!challenge) {
      return res.status(404).send();
    } else {
      res.send(challenge);
    }

    await deleteInOtherObjects(challenge);

  } catch (error) {
    return res.status(500).send(error);
  }  
});

/**
 * Delete a challenge in the database using its ID
 */
challengeRouter.delete('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return res.status(404).send();
    } else {
      res.send(challenge);
    }

    await deleteInOtherObjects(challenge);

  } catch (error) {
    return res.status(500).send(error);
  }
});
```
La primera función que encontramos es _updateKms_, que se encarga de actualizar los kilómetros de un reto. Para ello, se recorre el array de tracks del reto y se van sumando los kilómetros de cada uno de ellos. Una vez se ha terminado de recorrer el array, se actualiza el campo _kms_ del reto con el valor obtenido.
\
\
La siguiente función es _checkItemsExists_, que se encarga de comprobar que los tracks de un challenge existen en la base de datos. En caso de que no exista alguno, se lanza un error.
\
\
Tambien tememos _deleteInOtherObjects_, que se encarga de eliminar el reto de los usuarios que lo tienen como reto activo.
\
\
A continuación tenemos las operaciones a través de los métodos HTTP:
- _GET /challenges_: Devuelve todos los retos de la base de datos o uno en concreto si se le pasa el nombre como __query string__. También se puede consultar un reto a través de su ID haciendo uso de la ruta _/challenges/:id_.
- _POST /challenges_: Crea un nuevo reto en la base de datos tal y como se ha explicado anteriormente.
- _PATCH /challenges_: Modifica un reto en la base de datos a través de su nombre como __query string__. También se puede modificar un reto a través de su ID haciendo uso de la ruta _/challenges/:id_. En ambos casos, se pueden modificar los campos _name_, _tracks_, _activity_ y _users_. Si se intenta modificar un campo que no es uno de los mencionados, se lanzará un error.
- _DELETE /challenges_: Elimina un reto en la base de datos a través de su nombre como __query string__. También se puede eliminar un reto a través de su ID haciendo uso de la ruta _/challenges/:id_. En ambos casos, se eliminará el reto de la base de datos y se eliminará de los usuarios que lo tengan como reto activo.

Las pruebas llevadas a cabo para _Challenges_ son las siguientes:
```
POST /challenges
    ✔ Should successfully create a new challenge (66ms)
    ✔ Should successfully create a new challenge with the correct number of Kms adding their tracks
    ✔ Should throw an 500 error when creating a challenge due to the name is not according the validator (Uso characters that are not alphanumeric)
    ✔ Should throw an 500 error when creating a challenge due to the track is not in the database
    ✔ Should throw an 500 error when creating a challenge due to the activity is not according the validator (only can be running or bike)
    ✔ Should throw an 404 error when creating a challenge

  GET /challenges
    ✔ Should successfully get all challenges
    ✔ Should successfully consult a specific challenge by name
    ✔ Should successfully consult a specific challenge by ID
    ✔ Should throw an 404 error due to not find a challenge by name
    ✔ Should throw an 404 error due to not find a challenge by ID
    ✔ Should throw an 500 error due to consult an invalid ID

  PATCH /challenges
    ✔ Should successfully modify a challenge by name
    ✔ Should successfully modify a challenge by ID
    ✔ Should throw an 404 error due to not find a challange to modify by name
    ✔ Should throw an 404 error due to not find a challange to modify by ID
    ✔ Should throw an 400 error due to not provide a challenge name
    ✔ Should throw an 400 error due to the update is not permited by name
    ✔ Should throw an 400 error due to the update is not permited by ID
    ✔ Should throw an 500 error due to do an invalid modification by name (The challenge name must start with a capital letter)
    ✔ Should throw an 500 error due to do an invalid modification by ID (The challenge name must start with a capital letter)

  DELETE /challenges
    ✔ Should successfully delete a challenge by name
    ✔ Should successfully delete a challenge by ID
    ✔ Should throw an 404 error due to not find a challenge to delete by name
    ✔ Should throw an 404 error due to not find a challenge to delete by ID
    ✔ Should throw an 500 error due to try to delete a challenge with an invalid ID
    ✔ Should delete the challenge from the active challenge from user
```
### Users
```Typescript

/**
 * Check if an item exists in the database when its ID is going to use for create/modify a user, in this case the tracks, users and challenges.
 * @param user User which tracks, users and challenges will be checked
 */
export async function checkItemsExists(user) {

  // Comprobar que los amigos existen en la base de datos.
  for (let i = 0; i < user.friends.length; i++) {
    const checkUser = await User.findById(user.friends[i]);
    if (!checkUser) {
      throw new Error("Any friend is not in the database")      
    }
  }

  // Comprobar que los amigos dentro de grupo de amigos existen en la base de datos.
  for (let i = 0; i < user.friendsGroups.length; i++) {
    for (let j = 0; j < user.friendsGroups[i].friends.length; j++) {
      const checkUser = await User.findById(user.friendsGroups[i].friends[j]);
      if (!checkUser) {
        throw new Error("Any friend in friendsGroup is not in the database")            
      }
    }
  }

  // Comprobar que las rutas favoritas del usuario existen en la base de datos.
  for (let i = 0; i < user.favoriteTracks.length; i++) {
    const checkTrack = await Track.findById(user.favoriteTracks[i]);
    if (!checkTrack) {
      throw new Error("Any track in favoriteTracks is not in the database")           
    }
  }

  // Comprobar que los retos activos del usuario existen en la base de datos.
  for (let i = 0; i < user.activeChallenges.length; i++) {
    const checkChallenge = await Challenge.findById(user.activeChallenges[i]);
    if (!checkChallenge) {
      throw new Error("Any challenge in activeChallenges is not in the database")        
    }
  }

  // Comprobar que las rutas dentro del historial de rutas existen en la base de datos.
  for (let i = 0; i < user.trackHistory.length; i++) {
    for (let j = 0; j < user.trackHistory[i].tracks.length; j++) {
      const checkTrack = await Track.findById(user.trackHistory[i].tracks[j]);
      if (!checkTrack) {
        throw new Error("Any track in trackHistory is not in the database")        
      }
    }
  }
}

/**
 * When a user is deleted, this is deleted in the rest of the items that include it.
 * @param user User that will be deleted in the rest of the items.
 */
export async function deleteInOtherObjects(user) {

  // Cuando se elimina un usuario también lo hace de los grupos a los que pertenezca.
  const userGroup = await Group.find({
    members: user._id,
  });
      
  userGroup.forEach(async (item) => {
    const index = item.members.indexOf(user.id);

    if (index > -1) {
      item.members.splice(index, 1);
      await item.save();
    }
  });

  // Cuando se elimina un usuario también lo hace de los amigos de otros usuarios.
  const userFriends = await User.find({
    friends: user._id,
  });
      
  userFriends.forEach(async (item) => {
    const index = item.friends.indexOf(user.id);

    if (index > -1) {
      item.friends.splice(index, 1);
      await item.save();
    }
  });
}

/**
 * Get all the users in the database or only one if the query string name exists
 */
userRouter.get('/', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const users = await User.find(filter);

    if (users.length !== 0) {
      return res.send(users);
    }    
    return res.status(404).send();    
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get a specify user according to its ID
 */
userRouter.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      return res.send(user);
    }
    return res.status(404).send();    
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Create a user in the database
 */
userRouter.post('/', async (req, res) => {
  const user = new User(req.body);

  try {
    await checkItemsExists(user);
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a user in the database using its name as query string
 */
userRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A user name must be provided',
    });
  }

  const allowedUpdates = ['name', 'activity', 'friends', 'friendsGroups', 'trainingStats', 'favoriteTracks', 'activeChallenges', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const user = await User.findOneAndUpdate({
      name: req.query.name.toString()
    },
    req.body,
    { 
      new: true,
      runValidators: true }
    );

    if (user) {
      await checkItemsExists(user);
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a user in the database using its ID
 */
userRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['name', 'activity', 'friends', 'friendsGroups', 'trainingStats', 'favoriteTracks', 'activeChallenges', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: "Update is not permitted",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    });

    if (user) {
      await checkItemsExists(user);
      return res.send(user);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Delete a user in the database using its name as query string
 */
userRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A user name must be provided',
    });
  }
  try {
    const user = await User.findOneAndDelete({
      name: req.query.name.toString(),
    });

    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    } 

    await deleteInOtherObjects(user);

    } catch (error) {
      return res.status(500).send(error);
    }
});

/**
 * Delete a user in the database using its ID
 */
userRouter.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    } else {
      res.send(user);
    }

    await deleteInOtherObjects(user);

  } catch (error){
    return res.status(500).send(error);
  }
});
```
Tenemos como primera función al igual que en _challengeRouter_ la función _checkItemsExists_ que se encarga de comprobar que los elementos que se quieren añadir al usuario existen en la base de datos. Comprobamos que existan los amigos, los amigos dentro de los
grupos de amigos, las rutas favoritas, los retos activos y las rutas del historial de rutas. En caso de que no exista alguno de estos elementos se lanza un error indicando que el elemento no existe en la base de datos.
\
\
Tambien tenemos _deleteInOtherObjects_ que se encarga de eliminar el usuario de los elementos que lo contienen.
\
\
A continuación tenemos las operaciones a través de los métodos HTTP:
- _GET /users_: Devuelve todos los usuarios de la base de datos. Si usamos el query string _name_ devuelve el usuario con ese nombre.
- _GET /users/:id_: Devuelve un usuario de la base de datos a través de su ID.
- _POST /users_: Crea un usuario en la base de datos.
- _PATCH /users_: Modifica un usuario en la base de datos a través de su nombre.
- _PATCH /users/:id_: Modifica un usuario en la base de datos a través de su ID.
- _DELETE /users_: Elimina un usuario en la base de datos a través de su nombre.
- _DELETE /users/:id_: Elimina un usuario en la base de datos a través de su ID.
\
\
Las pruebas llevadas a cabo para _Users_ son las siguientes:
```
POST /users
    ✔ Should successfully create a new user
    ✔ Should throw an 500 error when creating an user due to the name is not according the validator (Uso characters that are not alphanumeric)
    ✔ Should throw an 500 error when creating an user due to the users in friends is not in the database
    ✔ Should throw an 500 error when creating an user due to the friends in friendsGroup is not in the database
    ✔ Should throw an 500 error when creating an user due to the tracks in favoriteTracks is not in the database
    ✔ Should throw an 500 error when creating an user due to the challenge in activeChallenge is not in the database
    ✔ Should throw an 500 error when creating an user due to the tracks in trackHistory is not in the database
    ✔ Should throw an 500 error when creating an user due to tracks in favoriteTracks is not in the database
    ✔ Should throw an 500 error when creating a user due to the activity is not according the validator (only can be running or bike)
    ✔ Should throw an 404 error when creating a challenge, due to an invalid path

  GET /users
    ✔ Should successfully consult all users
    ✔ Should successfully consult a specific user by name
    ✔ Should successfully consult a specific user by ID
    ✔ Should throw an 404 error due to not find a user by name
    ✔ Should throw an 404 error due to not find a user by ID

  PATCH /users
    ✔ Should successfully modify a user by ID
    ✔ Should successfully modify a user by name
    ✔ Should throw an 404 error due to not find an user to modify by name
    ✔ Should throw an 404 error due to not find an user to modify by ID
    ✔ Should throw an 400 error due to not provide a user name
    ✔ Should throw an 400 error due to the update is not permited by name
    ✔ Should throw an 400 error due to the update is not permited by ID
    ✔ Should throw an 500 error due to do an invalid modification by name (The user name must start with a capital letter)
    ✔ Should throw an 500 error due to do an invalid modification by ID (The user name must start with a capital letter)

  DELETE /users
    ✔ Should successfully delete an user by name
    ✔ Should successfully delete an user by ID
    ✔ Should throw an 404 error due to not find an user to delete by name
    ✔ Should throw an 404 error due to not find an user to delete by ID
    ✔ Should throw an 500 error due to try to delete an user with an invalid ID
    ✔ Should delete the user from the active members from a group
    ✔ Should delete the user from the friends of other users
```
### Groups
```Typescript
/**
 * Update the group stats according to the individual users stats
 * @param group Group whose stats are going to be update
 * @param res Response to the express server
 * @returns void
 */
export async function updateStats(group) {
  let kmsWeekly = 0;
  let unevennessWeekly = 0;
  let kmsMonthly = 0;
  let unevennessMonthly = 0;
  let kmsYearly = 0;
  let unevennessYearly = 0;

  for (let i = 0; i < group.members.length; i++) {
    const user = await User.findById(group.members[i]);
    if (!user) {
      throw new Error("Any user is not found")
    }
    kmsWeekly += user.trainingStats.weekly.length;
    unevennessWeekly += user.trainingStats.weekly.unevenness;
    kmsMonthly += user.trainingStats.monthly.length;
    unevennessMonthly += user.trainingStats.monthly.unevenness;
    kmsYearly += user.trainingStats.yearly.length;
    unevennessYearly += user.trainingStats.yearly.unevenness;
  }
  group.groupStats.weekly.length = kmsWeekly;
  group.groupStats.weekly.unevenness = unevennessWeekly
  group.groupStats.monthly.length = kmsMonthly;
  group.groupStats.monthly.unevenness = unevennessMonthly
  group.groupStats.yearly.length = kmsYearly;
  group.groupStats.yearly.unevenness = unevennessYearly
  await group.save();
}

/**
 * Sort the users that conform a group according to the kms and unevenness
 * @param group The group which members will be sorted
 */
export async function ranking(group) {  
  interface userValue {
    id: string;
    number: number
  }

  const rankByKms: userValue[] = [];
  const rankByUnevenness: userValue[] = [];

  for (let i = 0; i < group.members.length; i++) {
    const user = await User.findById(group.members[i]);
    if (!user) {
      throw new Error("Any user is not found")
    }
    let kmsWeekly = 0;
    let unevennessWeekly = 0;
    let kmsMonthly = 0;
    let unevennessMonthly = 0;
    let kmsYearly = 0;
    let unevennessYearly = 0;
    kmsWeekly += user.trainingStats.weekly.length;
    unevennessWeekly += user.trainingStats.weekly.unevenness;
    kmsMonthly += user.trainingStats.monthly.length;
    unevennessMonthly += user.trainingStats.monthly.unevenness;
    kmsYearly += user.trainingStats.yearly.length;
    unevennessYearly += user.trainingStats.yearly.unevenness;

    const userKms = {id: user.id , number: kmsWeekly + kmsMonthly + kmsYearly}
    const userUnevenness = {id: user.id, number: unevennessWeekly + unevennessMonthly + unevennessYearly}

    rankByKms.push(userKms);
    rankByUnevenness.push(userUnevenness);
  }

  group.ranking.byLenght = rankByKms.sort((a, b) => b.number - a.number).map(item => item.id);
  group.ranking.byUnevenness = rankByUnevenness.sort((a, b) => b.number - a.number).map(item => item.id);

  await group.save()
}

/**
 * Check if an item exists in the database when its ID is going to use for create/modify a group, in this case the tracks and the users.
 * @param group Group which tracks and users will be checked
 */
export async function checkItemsExists(group) {
  // Comprobar que los usuarios participantes del grupo existen en la base de datos.
  for (let i = 0; i < group.members.length; i++) {
    const checkUser = await User.findById(group.members[i]);
    if (!checkUser) {
      throw new Error("Any member is not in the database")      
    }
  }

  // Comprobar que las rutas favoritas del grupo existen en la base de datos.
  for (let i = 0; i < group.favoriteTracks.length; i++) {
    const checkTrack = await Track.findById(group.favoriteTracks[i]);
    if (!checkTrack) {
      throw new Error("Any track in favoriteTracks is not in the database")           
    }
  }
}

/**
 * Get all the groups in the database or only one if the query string name exists
 */
groupRouter.get('/', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

  try {
    const groups = await Group.find(filter);

    if (groups.length !== 0) {
      return res.send(groups);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Get a specify group according to its ID
 */
groupRouter.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (group) {
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * Create a group in the database
 */
groupRouter.post('/', async (req, res) => {
  const group = new Group(req.body);

  try {
    await checkItemsExists(group);
    await updateStats(group);
    await ranking(group);
    return res.status(201).send(group);
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a group in the database using its name as query string
 */
groupRouter.patch('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A group name must be provided',
    });
  }

  const allowedUpdates = ['name', 'members', 'groupStats', 'favoriteTracks', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const group = await Group.findOneAndUpdate({
      name: req.query.name.toString(),
    },
    req.body,
    {
      new: true,
      runValidators: true,
    });

    if (group) {
      await checkItemsExists(group);
      await updateStats(group);
      await ranking(group);
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Modify a group in the database using its ID
 */
groupRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['name', 'members', 'groupStats', 'favoriteTracks', 'trackHistory'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({
      error: 'Update is not permitted',
    });
  }

  try {
    const group = await Group.findByIdAndUpdate(req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    });

    if (group) {
      await checkItemsExists(group);
      await updateStats(group);
      await ranking(group);
      return res.send(group);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send({error: error.message});
  }
});

/**
 * Delete a group in the database using its name as query string
 */
groupRouter.delete('/', async (req, res) => {
  if (!req.query.name) {
    return res.status(400).send({
      error: 'A group name must be provided',
    });
  }
  try {
    const group = await Group.findOneAndDelete({
      name: req.query.name.toString(),
    });

    if (!group) {
      return res.status(404).send();
    } else {
      res.send(group);
    }
  } catch (error) {
    res.status(500).send(error);
  }  
});

/**
 * Delete a group in the database using its ID
 */
groupRouter.delete('/:id', async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) {
      return res.status(404).send();
    } else {
      res.send(group);
    }
  } catch (error) {
    return res.status(500).send(error);
  }
});
```
La primera función que nos encontramos en _Groups_ es _updateStats_, que se encarga de actualizar las estadísticas del grupo. Para ello, se recorre el array de miembros del grupo y se van sumando las estadísticas de cada uno de ellos. Una vez se han sumado todas las estadísticas, se actualizan las estadísticas del grupo. Si alguno de los miembros no existe, se lanza un error.
\
\
A continuación tenemos _ranking_, que se encarga de actualizar el ranking del grupo. Para ello, se recorre el array de miembros del grupo y se van sumando los puntos de cada uno de ellos, tanto por distancia como por elevación. Una vez se han sumado todos los puntos, se ordena el array de miembros del grupo según la puntuación obtenida, y nos quedan los dos arrays ordenados de mayor a menor. Si alguno de los miembros no existe, se lanza un error.
\
\
También tenemos _checkItemsExists_, que se encarga de comprobar que 
los usuarios del grupo y las rutas favoritas del grupo existen en la base de datos. Si alguno de ellos no existe, se lanza un error.
\
\
Por último, tenemos las operaciones a través de los métodos HTTP:
- _GET /groups_: Consulta todos los grupos de la base de datos. Si usamos el query string _name_ devuelve el grupo con ese nombre.
- _GET /groups/:id_: Consulta un grupo de la base de datos a través de su ID.
- _POST /groups_: Crea un grupo en la base de datos.
- _PATCH /groups_: Modifica un grupo en la base de datos a través de su nombre.
- _PATCH /groups/:id_: Modifica un grupo en la base de datos a través de su ID.
- _DELETE /groups_: Elimina un grupo de la base de datos a través de su nombre.
- _DELETE /groups/:id_: Elimina un grupo de la base de datos a través de su ID.
\
\
Las pruebas llevadas a cabo para _Group_ son las siguientes:
```
POST /groups
    ✔ Should successfully create a new group (48ms)
    ✔ Should throw an 500 error when creating a group due to the name is not according the validator (Uso characters that are not alphanumeric)
    ✔ Should throw an 500 error when creating a group due to the users in members are not in the database
    ✔ Should throw an 500 error when creating a group due to the tracks in favoriteTracks are not in the database
    ✔ Should throw an 500 error when creating a group due to the tracks in trackHistory are not in the database
    ✔ Should throw an 500 error when creating a group due to group name doesn't start by a capital letter
    ✔ Should throw an 404 error when creating a group, due to an invalid path

  GET /groups
    ✔ Should successfully consult all groups
    ✔ Should successfully consult a specific group by name
    ✔ Should successfully consult a specific group by ID
    ✔ Should throw an 404 error due to not find a group by name
    ✔ Should throw an 404 error due to not find a group by ID
    ✔ Should throw an 500 error due to ge by an invlid ID

  PATCH /groups
    ✔ Should successfully modify a group by ID
    ✔ Should successfully modify a user by name
    ✔ Should throw an 404 error due to not find a group to modify by name
    ✔ Should throw an 404 error due to not find a group to modify by ID
    ✔ Should throw an 400 error due to not provide a group name
    ✔ Should throw an 400 error due to the update is not permited by name
    ✔ Should throw an 400 error due to the update is not permited by ID
    ✔ Should throw an 500 error due to do an invalid modification by name (The group name must start with a capital letter)
    ✔ Should throw an 500 error due to do an invalid modification by ID (The group name must start with a capital letter)

  DELETE /groups
    ✔ Should successfully delete an group by name
    ✔ Should successfully delete an group by ID
    ✔ Should throw an 404 error due to not find an group to delete by name
    ✔ Should throw an 404 error due to not find an group to delete by ID
    ✔ Should throw an 500 error due to try to delete an group with an invalid ID
```

## Despliegue de la API en cyclic y MongoDB Atlas
Para llevar a cabo el despliegue, lo primero es crear un clúster en MongoDB Atlas, en cuyo sitio web nos debemos de registrar previamente, para realizar esta parte correctamente se han seguido los apuntes sobre dicho tema. Una vez creado el clúster con un determinado usuario y contraseña obtendremos la URL de la conexión al clúster, que en nuestro caso es la siguiente:
```
mongodb+srv://DSI-API:dsiapi@cluster0.2my5da6.mongodb.net/destravate-app
```
A continuación llevamos a cabo el despliegue en sí, en Cylic, donde también se han seguido los pasos indicados por el profesor para llevarlo a cabo. Tras registrarnos debemos de incluir el repositorio donde se encuentra nuestra aplicación y para vincularla a la base de datos de MongoDB Atlas debemos de definir la variable de entorno _MONGODB\_URL_ con la URL que habíamos obtenido anteriormente. Una vez hecho esto podremos ver en la pestaña _logs_ cómo se ha conectado correctamente y obtendremos una URL por la cual podremos llevar a cabo las peticiones que en nuestro caso es la siguiente:
```
https://lively-ox-cowboy-hat.cyclic.app/
```
## Conclusión
Con la realización de este proyecto hemos aprendido a crear nuestra propia API REST, lo cual es fundamental en el desarrollo de aplicaciones, permitiendo que diferentes sistemas y aplicaciones se comuniquen de manera eficiente. También cómo se relaciona esta con una base de datos, en nuestro caso mongoose, donde hemos implementado las 4 funciones basicas (inserción, consulta, borrado y modificación). También hemos mejorado el uso de promesas implementado el uso de async/await, lo que nos permite trabajar con código asíncrono de manera más legible. Además, hemos podido consolidar los conocimientos relacionados con el servidor Express y el uso de las peticiones HTTP para llevar a cabo las operaciones anteriormente mencionadas (POST, GET, DELETE, PATCH).
\
\
Tras todo el trabajo de desarrollo de la API-REST, documentación, pruebas, etc hemos realizado el despliegue, una parte que consideramos de gran valor, ya que nos permite ver nuestra aplicación en funcionamiento y cómo se relaciona con una base de datos en la nube (MonboDB Atlas) que configuramos anteriormente.
\
\
En esta práctica tuvimos que realizar ciertas modificaciones en los workflows para conseguir que funcionaran correctamente los flujos de trabajo con acciones de GitHub para integración continua, tanto para los tests, coveralls y sonar-cloud, tras los cambios pertinentes todo funciona correctamente, consiguiendo los siguientes _badgets_:
* Tests: [![Tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-groupo/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-groupo/actions/workflows/node.js.yml)
* Coveralls: [![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-groupo/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-groupo?branch=main)
* Sonar-Cloud: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-groupo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-groupo)

## Bibliografía
Para la realización de esta práctica se han consultado las siguientes fuentes bibliográficas:
* [Guion de la práctica 12](https://ull-esit-inf-dsi-2223.github.io/prct12-destravate-api/)
* [Apuntes API REST](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-rest-api.html)
* [Apuntes Async/Await](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-rest-api-async-await.html)
* [Apuntes Pruebas en la API REST](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-rest-api-testing.html)
* [Apuntes Despliegue del API REST](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/nodejs-deployment.html)