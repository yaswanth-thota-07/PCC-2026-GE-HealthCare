import mongoose, { Schema, Document } from 'mongoose';
import { HospitalRecord } from '../types/hospital.js';

export interface IHospitalDocument extends Document, Omit<HospitalRecord, '_id'> {
  cityNormalized: string;
  nameNormalized: string;
}

const HospitalSchema = new Schema(
  {
    hospital_name: { type: String, required: true, trim: true },
    nameNormalized: { type: String, index: true },
    hospital_type: { type: String, default: 'Private' },
    address: { type: String, default: '' },
    city: { type: String, required: true, index: true },
    cityNormalized: { type: String, required: true, index: true },
    insurers: { type: [String], default: [], index: true },
    insurersRaw: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    specialties: { type: [String], default: [], index: true },
    tier: { type: String, default: 'City 1' },
    segment: { type: String, default: 'Standard Private' }
  },
  { timestamps: true }
);

HospitalSchema.index({ cityNormalized: 1, hospital_name: 1 });
HospitalSchema.index({ cityNormalized: 1, specialties: 1 });
HospitalSchema.index({ cityNormalized: 1, insurers: 1 });

export const HospitalModel =
  mongoose.models.Hospital ||
  mongoose.model<IHospitalDocument>('Hospital', HospitalSchema);
