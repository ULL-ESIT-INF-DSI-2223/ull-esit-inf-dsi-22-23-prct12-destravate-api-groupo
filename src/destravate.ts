import * as express from 'express';
import './mongoose'
import { trackRouter } from './routers/track';
import users from './routers/user';
import groups from './routers/group';
import { challengeRouter } from './routers/challenge';

export const app = express();
app.use(express.json());

app.use('/tracks', trackRouter);
app.use('/users', users);
app.use('/groups', groups);
app.use('/challenges', challengeRouter);

/**
 * Show 404 error if access to a wrong path.
 */
app.get('*', (_, res) => {
  res.status(404).send();
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000.')
})