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
```
### User
```TypeScript
```
### Group
```TypeScript
```
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
A continuación veremos el código para cuada una de las rutas:

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