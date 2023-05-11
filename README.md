# Práctica 12 - Destravate: API Node/Express
Esta práctica consiste en la realización de una API REST, realizada mediante el uso de Node/Express, que nos perminte hacer las opereciones CRUD (_Create_, _Read_, _Update_, _Delete_), para registar actividades deportivas.
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
En el código anterior podemos ver primero la declaración de la interfaz y su posterior esquema, con todos los campos solicitados en el guion de la práctica. En le esquema se ha añadido además una serie de validadores gracias al módulo _validator_, para asegurarnos que a la hora de crear el objeto se introducen valores válidos, como que el nombre de la ruta deba de empezar por mayúscula y que solamente pueda usar caractéres alphanuméricos y espacios, además de que la longitud de la ruta y la pendiente debe de ser un número positivo y finalmente la clafisicación de la ruta debe de estar entre 0 y 10.
### Challenge
```TypeScript
export interface ChallengeDocumentInterface extends Document {
  name: string,
  tracks: TrackDocumentInterface[],
  activity: 'bike' | 'running',
  kms: number,
  users: UserDocumentInterface[]
}

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
  },
});

export const Challenge = model<ChallengeDocumentInterface>('Challenge', ChallengeSchema);
```
En el caso de los retos, al igual que en rutas, declaramos la interfaz y su posterior esquema. Podemos ver que _tracks_ y _users_ son arrays de _ObjectId_, que hacen referencia a los documentos de _Track_ y _User_ respectivamente. Además, se ha añadido un validador para asegurarnos que el nombre del reto empieza por mayúscula y que solamente puede usar caractéres alphanuméricos y espacios.
### User
```TypeScript
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
En el caso de los usuarios, al igual que en rutas y retos, declaramos la interfaz y su posterior esquema. Podemos ver que _friends_ y _activeChallenges_ son arrays de _ObjectId_, que hacen referencia a los documentos de _User_ y _Challenge_ respectivamente. Tenemos en el _id_ que si no se le pasa un valor, se le asigna un _ObjectId_ de mongoose. Además del validador del nombre, hemos añadido también en _trackHistory_ un validador para asegurarnos que la fecha tiene el formato correcto.
### Group
```TypeScript
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
app.get('*', (_, res) => {
  res.status(404).send();
});

app.post('*', (_, res) => {
  res.status(404).send();
});

app.patch('*', (_, res) => {
  res.status(404).send();
});

app.delete('*', (_, res) => {
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

trackRouter.post('/', async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(500).send(error);
  }
});

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
Lo primero que observamos es una función _deleteInOtherObjects_ la cual es llamada cada vez que se elimina una ruta para así actualizar el resto de objetos que incluyen dicha ruta, siendo estos los retos, los usuarios y los grupos. A continuación se implementan las operaciones a través de los métodos HTTP, comenzando con el GET, donde mediante el filtro y una _query_ _string_ podemos seleccionar mostrar una ruta en concreto o todas las que se encuentran en la base de datos, también se ha incluido el get, donde la busqueda de la ruta se lleva a cabo por su identificador único dentro de la base de datos.
\
\
En cuanto al POST, se recupero lo que ha introducido el usuario a través del body y si pasa todos los requisitos introducidos en el modelo, se añadirá la ruta a la base de datos. El PATCH sigue el mismo espíritu, primero tiene que encontrar la ruta que se desea modificar de distinta manera dependiendo si es con ID o mediante una _query string_, posteriormente se comprueba si los campos introducidos en el _body_ son aptos para la modificación, y si es así, se actualiza.
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
### Challenge

### User

### Group

## Conclusión
Con la realización de este proyecto hemos aprendido a crear nuestra propia API REST, lo cual es fundamental en el desarrollo de aplicaciones, permitiendo que diferentes sistemas y aplicaciones se comuniquen de manera eficiente. También cómo se relaciona esta con una base de datos, en nuestro caso mongoose, donde hemos implementado las 4 funciones basicas (inserción, consulta, borrado y modificación). También hemos implementado el uso de async/await, lo que nos permite trabajar con código asíncrono de manera más legible.
\
\
Finalmente hemos podido consolidar los conocimientos relacionados con el servidor Express y el uso de las peticiones HTTP para llevar a cabo las operaciones anteriormente mencionadas (POST, GET, DELETE, PATCH).
\
\
Al igual que en las prácticas anteriores se han incluido los flujos de trabajo de GitHub Actions:
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