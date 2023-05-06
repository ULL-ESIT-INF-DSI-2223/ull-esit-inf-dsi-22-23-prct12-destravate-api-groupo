import { Document, model, Schema } from "mongoose";
import { TrackDocumentInterface } from "./track";
import { UserDocumentInterface } from "./user";

export interface GroupDocumentInterface extends Document {
  id: string;
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
    trackId: TrackDocumentInterface;
    date: Date;
  }[];
}

const GroupSchema = new Schema<GroupDocumentInterface>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  groupStats: {
    km: {
      length: {
        type: Number,
        default: 0,
      },
      unevenness: {
        type: Number,
        default: 0,
      },
    },
    ranking: {
      byLenght: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      ],
      byUnevenness: [
        {
          type: Schema.Types.ObjectId,
          required: true,
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
        trackId: {
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
  },
});

export const Group = model<GroupDocumentInterface>("Group", GroupSchema);