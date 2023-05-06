import { Document, model, Schema } from 'mongoose';
import { TrackDocumentInterface } from './track';
//import validator from 'validator';

export interface ChallengeDocumentInterface extends Document {
  name: string,
  tracks: TrackDocumentInterface[],
  activity: 'bike' | 'running',
  kms: number,
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
  }
});

export const Challenge = model<ChallengeDocumentInterface>('Challenge', ChallengeSchema);