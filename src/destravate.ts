import * as express from 'express';
import tracks from './tracks';
import users from './users';
import groups from './groups';
import challenges from './challenges';

const app = express();
app.use(express.json());

app.use('/tracks', tracks);
app.use('/users', users);
app.use('/groups', groups);
app.use('/challenges', challenges);

/**
 * Show 404 error if access to a wrong path.
 */
app.get('*', (_, res) => {
  res.status(404).send();
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000.')
})