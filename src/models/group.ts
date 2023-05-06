import mongoose, { Document, model, Schema } from "mongoose";
import { TrackDocumentInterface } from "./track";
import { UserDocumentInterface } from "./user";

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
        required: true,
        ref: "Track",
      }],
      date: {
        type: String,
        required: true,
      },
    },
  ],
});


// const GroupSchema = new Schema<GroupDocumentInterface>({
//   name: {
//     type: String,
//     required: true,
//   },
//   members: [
//     {
//       type: Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//   ],
//   groupStats: {
//     weekly: {
//       length: {
//         type: Number,
//         default: 0,
//       },
//       unevenness: {
//         type: Number,
//         default: 0,
//       },
//     },
//     monthly: {
//       length: {
//         type: Number,
//         default: 0,
//       },
//       unevenness: {
//         type: Number,
//         default: 0,
//       },
//     },
//     yearly: {
//       length: {
//         type: Number,
//         default: 0,
//       },
//       unevenness: {
//         type: Number,
//         default: 0,
//       },
//     },
//   },
//   ranking: {
//     byLenght: [
//       {
//         type: Schema.Types.ObjectId,
//         required: false,
//         ref: "User",
//       },
//     ],
//     byUnevenness: [
//       {
//         type: Schema.Types.ObjectId,
//         required: false,
//         ref: "User",
//       },
//     ],
//   },
//   favoriteTracks: [
//      {
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "Track",
//       },
//     ],
//   trackHistory: [
//     {
//       tracks: [{
//         type: Schema.Types.ObjectId,
//         required: true,
//         ref: "Track",
//       }],
//       date: {
//         type: String,
//         required: true,
//       },
//     },
//   ],
// });

export const Group = model<GroupDocumentInterface>("Group", GroupSchema);