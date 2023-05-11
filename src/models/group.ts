import { Document, model, Schema } from "mongoose";
import { TrackDocumentInterface } from "./track";
import { UserDocumentInterface } from "./user";
import * as validator from 'validator';

export interface GroupDocumentInterface extends Document {
  name: string;
  members: UserDocumentInterface[];
  groupStats: {
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
  ranking: {
    byLenght: UserDocumentInterface[];
    byUnevenness: UserDocumentInterface[];
  };
  favoriteTracks: TrackDocumentInterface[];
  trackHistory: {
    tracks: TrackDocumentInterface[];
    date: string;
  }[];
}

const GroupSchema = new Schema<GroupDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Group name must start with a capital letter');
      } else if (!validator.default.isAlphanumeric(value.replace(/\s/g, ''))) {
        throw new Error('Track name must contain alphanumeric characters and spaces only')
      }
    }
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  groupStats: {
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
  ranking: {
    byLenght: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
      },
    ],
    byUnevenness: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "User",
      },
    ],
  },
  favoriteTracks: [
     {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Track",
      },
    ],
  trackHistory: [
    {
      tracks: [{
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Track",
      }],
      date: {
        type: String,
        required: false,
        validate: (value: string) => {
          if (!value.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/)) {
            throw new Error('Date must have this format: DD-MM-YYYY');
          }
        }
      },
    },
  ],
});

export const Group = model<GroupDocumentInterface>("Group", GroupSchema);