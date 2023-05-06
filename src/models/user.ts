import { Document, model, Schema } from "mongoose";
import { TrackDocumentInterface } from './track';
import { ChallengeDocumentInterface } from './challenge';


export interface UserDocumentInterface extends Document {
  id: string;
  name: string;
  activity: "bike" | "running";
  friends: UserDocumentInterface[];
  friendGroups: {
    name: string;
    friends: string[];
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
      unevenness: number;trackHistory: {
        track: TrackDocumentInterface;
        date: Date;
      }[];
    };
  };
  favoriteTracks: TrackDocumentInterface[];
  activeChallenges: ChallengeDocumentInterface[];
  trackHistory: {
    track: TrackDocumentInterface;
    date: Date;
  }[];
}

export const UserSchema = new Schema<UserDocumentInterface>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  activity: [
    {
      type: String,
      required: true,
      enum: ["run", "bike"],
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  friendGroups: [
    {
      name: {
        type: String,
        required: true,
      },
      friends: [
        {
          type: String,
          required: true,
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
      routeId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Track",
      },
      date: {
        type: Date,
        required: true,
      },
    },
  ],
});

export const User = model<UserDocumentInterface>("User", UserSchema);