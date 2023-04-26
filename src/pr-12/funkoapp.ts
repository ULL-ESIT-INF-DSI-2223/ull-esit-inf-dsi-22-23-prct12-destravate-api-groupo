import * as express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
module.exports = app;

const dbURL = 'mongodb://127.0.0.1:27017';
const dbName = 'funko-app';

interface FunkoInterface {
  name: string,
  description: string,
  type: 'Pop!' | 'Pop! Rides' | 'Vynil Soda' | 'Vynil Gold',
  genre: 'Animación' | 'Películas y TV' | 'Videojuegos' | 'Deportes' | 'Música' | 'Anime',
  franchise: 'The Big Bang Theory' | 'Detective Conan' | 'Mario Bros' | 'Pokémon' | 'Sonic The Hedgehog'
  number: number,
  exclusive: boolean,
  specialFeatures: string,
  marketValue: number
}

/**
 * Show a single funko or the whole list.
 */
app.get('/funkos', (req, res) => {
  const user = req.query.user;
  const funko = req.query.funko;  

  if (user) {
    if (funko) {
      MongoClient.connect(dbURL).then((client) => {
        const db = client.db(dbName);          
        return db.collection<FunkoInterface>(user.toString()).findOne({
          _id: new ObjectId(funko.toString()),
        });
  
      }).then((result) => {
        console.log(result);
        res.send(result);
      }).catch((error) => {
        console.log(error);
      }); 
  
    } else {
      MongoClient.connect(dbURL).then((client) => {
        const db = client.db(dbName);
        return db.collection<FunkoInterface>(user.toString()).find({}).toArray();     
      }).then((result) => {
        console.log(result);
        res.send(result);
      }).catch((error) => {
        console.log(error);
      }); 
    } 
  } else {
    res.status(404).send("No se ha encontrado la colección del usuario que se desea obtener.")
  }  
});

/**
 * Add a funko to the collection.
 */
app.post('/funkos', express.json(), (req, res) => {
  const user = req.query.user;
  if (user) {
    MongoClient.connect(dbURL).then((client) => {
      const db = client.db(dbName);
  
      return db.collection<FunkoInterface>(user.toString()).insertOne(req.body)
    }).then((result) => {
      console.log(result);
      res.send("Funko añadido correctamente.");
    }).catch((error) => {
      console.log(error);
    });
  } else {
    res.status(404).send("No se ha encontrado el funko que se desea modificar.")
  }
});

/**
 * Delete a funko from the collection.
 */
app.delete('/funkos', (req, res) => {
  const user = req.query.user;
  const funko = req.query.funko;

  if (funko) {
    MongoClient.connect(dbURL).then((client) => {
      const db = client.db(dbName);

      if (db.collection<FunkoInterface>(user.toString()).findOne({
        _id: new ObjectId(funko.toString()),
      })){
        return db.collection<FunkoInterface>(user.toString()).deleteOne({
          _id: new ObjectId(funko.toString()),
        });
      } else {
        res.status(404).send("El funko que desea eliminar no existe.")
      }    
     
    }).then((result) => {
      console.log(result);
      res.send("Funko eliminado correctamente.");
    }).catch((error) => {
      console.log(error);
    });
  } else {
    res.status(404).send("No se ha encontrado el funko que se desea eliminar.");
  }  
});

/**
 * Modify a funko from the collection.
 */
app.patch('/funkos', express.json(), (req, res) => {
  const user = req.query.user;
  const funko = req.query.funko;

  if (funko) {
    MongoClient.connect(dbURL).then((client) => {
      const db = client.db(dbName);
    
      return db.collection<FunkoInterface>(user.toString()).updateOne({
        _id: new ObjectId(funko.toString()),
      }, {
        $set: req.body,
      });
    }).then((result) => {
      console.log(result.modifiedCount);
      res.send("Funko modificado correctamente.")
    }).catch((error) => {
      console.log(error);
    });
  } else {
    res.status(404).send("No se ha encontrado el funko que se desea eliminar.")
  }  
});

/**
 * Show 404 error if access to a wrong path.
 */
app.get('*', (_, res) => {
  res.status(404).send();
});

app.listen(3002, () => {
  console.log('Server listening on port 3000');
});
