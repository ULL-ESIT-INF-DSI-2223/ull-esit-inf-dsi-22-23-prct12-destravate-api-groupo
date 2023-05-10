import { Document, model, Schema } from 'mongoose';
import * as validator from 'validator';

export interface TrackDocumentInterface extends Document {
  name: string,
  startGeolocation: {
    latitude: string,
    longitude: string
  },
  endGeolocation: {
    latitude: string,
    longitude: string
  },
  length: number,
  unevenness: number,  
  activity: 'bike' | 'running',
  rating: number
}

export const TrackSchema = new Schema<TrackDocumentInterface>({
  name: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Track name must start with a capital letter');
      } else if (!validator.default.isAlphanumeric(value.replace(/\s/g, ''))) {
        throw new Error('Track name must contain alphanumeric characters and spaces only')
      }
    }
  },
  startGeolocation: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    }
  },
  endGeolocation: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    }
  },
  length: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value <= 0) {
        throw new Error('Unevenness must be greater than 0');
      }
    } 
  },
  unevenness: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value <= 0) {
        throw new Error('Unevenness must be greater than 0');
      }
    } 
  },
  activity: {
    type: String,
    required: true,
    enum: ['bike', 'running'],
  },
  rating: {
    type: Number,
    required: true,
    validate(value: number) {
      if (value < 0 || value > 10) {
        throw new Error('Rating must be greater than or equal to 0 and lower than or equal to 10');
      }
    }    
  }
});

export const Track = model<TrackDocumentInterface>('Track', TrackSchema);