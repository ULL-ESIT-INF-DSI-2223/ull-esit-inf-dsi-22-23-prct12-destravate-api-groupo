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