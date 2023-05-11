import { Document, model, Schema } from 'mongoose';
import { TrackDocumentInterface } from './track';
import { UserDocumentInterface } from './user';
import * as validator from 'validator';

/**
 * Challenge interface for apply it in the challenge schema
 */
export interface ChallengeDocumentInterface extends Document {
  name: string,
  tracks: TrackDocumentInterface[],
  activity: 'bike' | 'running',
  kms: number,
  users: UserDocumentInterface[]
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