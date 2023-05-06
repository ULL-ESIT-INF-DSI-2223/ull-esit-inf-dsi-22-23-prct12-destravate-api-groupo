import { Document, model, Schema } from 'mongoose';
import { TrackDocumentInterface } from './track';
import { UserDocumentInterface } from './user';
//import validator from 'validator';

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
    unique: true
  },
  tracks: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Track'
  }],
  activity: {
    type: String,
    required: true,
    enum: ['bike', 'running'],
  },
  kms: {
    type: Number,
    required: false,
  },
  users: [{
    type: Schema.Types.ObjectId,
    required: false,
    default: [],
  }]
});

export const Challenge = model<ChallengeDocumentInterface>('Challenge', ChallengeSchema);