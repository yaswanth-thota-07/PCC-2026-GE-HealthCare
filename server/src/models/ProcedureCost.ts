import mongoose, { Schema, Document } from 'mongoose';
import { CostRecord } from '../types/hospital.js';

export interface IProcedureCostDocument extends Document, Omit<CostRecord, '_id'> {
  cost_type: 'private' | 'government';
  tierNormalized: string;
  specialtyNormalized: string;
  procedureNormalized: string;
}

const ProcedureCostSchema = new Schema(
  {
    cost_type: { type: String, enum: ['private', 'government'], required: true, index: true },
    tier: { type: String, required: true, index: true },
    tierNormalized: { type: String, required: true, index: true },
    specialty: { type: String, required: true, index: true },
    specialtyNormalized: { type: String, required: true, index: true },
    procedure: { type: String, required: true, index: true },
    procedureNormalized: { type: String, required: true, index: true },
    low_cost: { type: Number, default: 0 },
    highest_cost: { type: Number, default: 0 },
    mean_cost: { type: Number, default: 0 },
    estimated_stay_days: { type: Number, default: 0 },
    general_ward_cost_per_day: { type: Number, default: 0 },
    twin_sharing_cost_per_day: { type: Number, default: 0 },
    single_private_room_cost_per_day: { type: Number, default: 0 }
  },
  { timestamps: true }
);

ProcedureCostSchema.index({ cost_type: 1, tierNormalized: 1, specialtyNormalized: 1, procedureNormalized: 1 });
ProcedureCostSchema.index({ cost_type: 1, tierNormalized: 1, specialtyNormalized: 1 });
ProcedureCostSchema.index({ cost_type: 1, tierNormalized: 1 });

export const ProcedureCostModel =
  mongoose.models.ProcedureCost ||
  mongoose.model<IProcedureCostDocument>('ProcedureCost', ProcedureCostSchema);
