import * as express from 'express';
import './mongoose'
import { trackRouter } from './routers/track';
import { userRouter } from './routers/user';
import { groupRouter } from './routers/group';
import { challengeRouter } from './routers/challenge';

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