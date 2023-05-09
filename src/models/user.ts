import mongoose, { Document, model, Schema } from "mongoose";
import { TrackDocumentInterface } from './track';
import { ChallengeDocumentInterface } from './challenge';
import * as validator from 'validator';

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
  favoriteTracks: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Track",
    },
  ],
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