import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db.js';
import { HospitalModel } from '../models/Hospital.js';
import { ProcedureCostModel } from '../models/ProcedureCost.js';
import {
  parseCSVLine,
  parseCSVRecords,
  CITY_CANONICAL_TIERS
} from '../services/hospitalService.js';
import { sanitizeHospitalSpecialties } from '../utils/specialtySanitizer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const possibleHospPaths = [
  path.resolve(process.cwd(), 'hospitals.csv'),
  path.resolve(__dirname, '../../../hospitals.csv'),
  path.resolve(__dirname, '../../hospitals.csv'),
  path.resolve(__dirname, '../../../cost/hospitals.csv'),
  path.resolve(process.cwd(), 'cost/hospitals.csv')
];
const possiblePvtPaths = [
  path.resolve(process.cwd(), 'pvt_costs.csv'),
  path.resolve(__dirname, '../../../pvt_costs.csv'),
  path.resolve(__dirname, '../../pvt_costs.csv'),
  path.resolve(__dirname, '../../../cost/pvt_costs.csv'),
  path.resolve(process.cwd(), 'cost/pvt_costs.csv')
];
const possibleGovtPaths = [
  path.resolve(process.cwd(), 'govt_costs.csv'),
  path.resolve(__dirname, '../../../govt_costs.csv'),
  path.resolve(__dirname, '../../govt_costs.csv'),
  path.resolve(__dirname, '../../../cost/govt_costs.csv'),
  path.resolve(process.cwd(), 'cost/govt_costs.csv')
];

function resolveFilePath(paths: string[]): string {
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return paths[0];
}

const INDIAN_STATES = new Set([
  'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh',
  'goa', 'gujarat', 'haryana', 'himachal pradesh', 'jharkhand', 'karnataka',
  'kerala', 'madhya pradesh', 'maharashtra', 'manipur', 'meghalaya', 'mizoram',
  'nagaland', 'odisha', 'punjab', 'rajasthan', 'sikkim', 'tamil nadu',
  'telangana', 'tripura', 'uttar pradesh', 'uttarakhand', 'west bengal',
  'andaman and nicobar islands', 'chandigarh', 'dadra and nagar haveli and daman and diu',
  'delhi', 'jammu and kashmir', 'ladakh', 'lakshadweep', 'puducherry',
  'daman and diu', 'dadra and nagar haveli', 'uttaranchal', 'orissa', 'pondicherry', 'nct of delhi'
]);

function normalize(value: unknown): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .split(/\s+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function cleanCandidateCity(s: string): string {
  if (!s) return '';
  let str = s.trim();
  str = str.replace(/\bpin(?:\s*code)?\s*[-:]?\s*\d+/gi, '')
    .replace(/\b\d{6}\b/g, '')
    .replace(/\b\d+\b/g, '')
    .trim();
  str = str.replace(/^[\s,.\-:/()]+|[\s,.\-:/()]+$/g, '').trim();

  const roadKeywords = [
    'bye\\s*pass\\s*road', 'bypass\\s*road', 'bye\\s*pass', 'bypass',
    'national\\s*highway', 'ring\\s*road', 'main\\s*road',
    'road', 'rd\\b', 'street', 'st\\b', 'marg', 'lane', 'highway', 'hwy',
    'talab', 'chowk', 'chowka', 'circle', 'complex'
  ];

  for (const kw of roadKeywords) {
    const re = new RegExp(`\\b${kw}\\b(.*)$`, 'i');
    const match = str.match(re);
    if (match && match[1]) {
      const rest = match[1].replace(/^[,\s\-/()]+/, '').trim();
      if (rest.length >= 2) {
        str = rest;
      }
    }
  }

  str = str.replace(/^[\s,.\-:/()]+|[\s,.\-:/()]+$/g, '').trim();
  return str;
}

function extractCity(address: string): string {
  if (!address) return 'Unknown';
  const parts = address.split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return 'Unknown';

  const meaningful = parts.filter(p => !/^\d{6}$/.test(p) && !/^pin(?:\s*code)?\s*[-:]?\s*\d+$/i.test(p));
  if (meaningful.length === 0) return 'Unknown';

  for (let i = meaningful.length - 1; i >= 0; i--) {
    const candidate = meaningful[i];
    const cleaned = cleanCandidateCity(candidate);
    const norm = normalize(cleaned);
    if (!norm) continue;

    if (INDIAN_STATES.has(norm)) {
      if (i > 0) {
        const prevCleaned = cleanCandidateCity(meaningful[i - 1]);
        if (prevCleaned && !INDIAN_STATES.has(normalize(prevCleaned))) {
          return prevCleaned;
        }
      }
      continue;
    }
    return cleaned;
  }

  return cleanCandidateCity(meaningful[0]) || 'Unknown';
}

function normalizeCity(rawCity: string): string {
  let c = cleanCandidateCity(rawCity);
  if (!c || c.length < 2) return 'Other';

  const n = normalize(c);
  const cityAliases: Record<string, string> = {
    'bangalore': 'Bengaluru',
    'bengaluru': 'Bengaluru',
    'bombay': 'Mumbai',
    'mumbai': 'Mumbai',
    'calcutta': 'Kolkata',
    'kolkata': 'Kolkata',
    'madras': 'Chennai',
    'chennai': 'Chennai',
    'delhi': 'Delhi',
    'new delhi': 'Delhi',
    'gurgaon': 'Gurugram',
    'gurugram': 'Gurugram',
    'hyderabad': 'Hyderabad',
    'secunderabad': 'Hyderabad',
    'pune': 'Pune',
    'ahmedabad': 'Ahmedabad',
    'jaipur': 'Jaipur',
    'lucknow': 'Lucknow',
    'chandigarh': 'Chandigarh',
    'coimbatore': 'Coimbatore',
    'kochi': 'Kochi',
    'cochin': 'Kochi',
    'indore': 'Indore',
    'nagpur': 'Nagpur',
    'patna': 'Patna',
    'bhopal': 'Bhopal',
    'vadodara': 'Vadodara',
    'ludhiana': 'Ludhiana',
    'agra': 'Agra',
    'nashik': 'Nashik',
    'varanasi': 'Varanasi',
    'visakhapatnam': 'Visakhapatnam',
    'vizag': 'Visakhapatnam',
    'jammu': 'Jammu',
    'srinagar': 'Srinagar'
  };

  if (cityAliases[n]) return cityAliases[n];
  return toTitleCase(c);
}

export async function seedDatasets(force = false): Promise<{ hospitalsCount: number; costBenchmarksCount: number }> {
  const existingHospitals = await HospitalModel.countDocuments();
  const existingCosts = await ProcedureCostModel.countDocuments();

  if (!force && existingHospitals > 50000 && existingCosts > 300) {
    console.log(`[SeedDatabase] MongoDB already contains ${existingHospitals} hospitals and ${existingCosts} procedure costs.`);
    console.log('[SeedDatabase] Dataset creation skipped. Use force=true to re-seed.');
    return { hospitalsCount: existingHospitals, costBenchmarksCount: existingCosts };
  }

  console.log('[SeedDatabase] Initializing MongoDB dataset seeding from CSV authoritative sources...');

  if (force || existingHospitals > 0) {
    console.log('[SeedDatabase] Clearing existing collections for clean seed...');
    await HospitalModel.deleteMany({});
    await ProcedureCostModel.deleteMany({});
  }

  // 1. Seed Hospital records
  const hospPath = resolveFilePath(possibleHospPaths);
  console.log(`[SeedDatabase] Reading and parsing hospital dataset from ${hospPath}...`);

  const fileStream = fs.createReadStream(hospPath, { encoding: 'utf8' });
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let headers: string[] = [];
  let isFirstLine = true;
  let batch: any[] = [];
  let totalHospitals = 0;
  const BATCH_SIZE = 5000;

  for await (const line of rl) {
    if (!line.trim()) continue;
    if (isFirstLine) {
      headers = parseCSVLine(line).map(h => h.trim());
      isFirstLine = false;
      continue;
    }

    const cols = parseCSVLine(line);
    if (cols.length < headers.length) continue;

    const obj: Record<string, string> = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = cols[j] !== undefined ? cols[j].trim() : '';
    }

    const hospitalName = obj.hospital_name || '';
    const address = obj.address || '';
    if (!hospitalName.trim() && !address.trim()) continue;

    const extractedCity = extractCity(address);
    const city = normalizeCity(extractedCity);
    const cityNormalized = normalize(city);

    let ratingVal = parseFloat(obj.rating);
    if (isNaN(ratingVal) || ratingVal <= 0) {
      ratingVal = 0;
    }

    const rawSpecialties = (obj.specialties || '')
      .split(';')
      .map(s => s.trim())
      .filter(Boolean);

    const specialties = sanitizeHospitalSpecialties(hospitalName, rawSpecialties);

    const insurersList = (obj.insurers || '')
      .split(',')
      .map(ins => ins.trim())
      .filter(Boolean);

    const canonicalTier = CITY_CANONICAL_TIERS[cityNormalized] || obj.tier || 'City 1';

    batch.push({
      hospital_name: hospitalName || 'Unnamed Hospital',
      nameNormalized: normalize(hospitalName),
      hospital_type: obj.hospital_type || 'Private',
      address,
      city,
      cityNormalized,
      insurers: insurersList,
      insurersRaw: obj.insurers || '',
      rating: ratingVal,
      specialties,
      tier: canonicalTier,
      segment: obj.segment || 'Standard Private'
    });

    if (batch.length >= BATCH_SIZE) {
      await HospitalModel.insertMany(batch, { ordered: false });
      totalHospitals += batch.length;
      console.log(`[SeedDatabase] Inserted ${totalHospitals} hospitals...`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await HospitalModel.insertMany(batch, { ordered: false });
    totalHospitals += batch.length;
    console.log(`[SeedDatabase] Inserted final batch. Total hospitals: ${totalHospitals}`);
    batch = [];
  }

  // 2. Seed Procedure & Room Cost Benchmarks (Private and Government)
  const pvtPath = resolveFilePath(possiblePvtPaths);
  const govtPath = resolveFilePath(possibleGovtPaths);

  const costDatasets = [
    { type: 'private' as const, filePath: pvtPath },
    { type: 'government' as const, filePath: govtPath }
  ];

  let totalCosts = 0;
  for (const ds of costDatasets) {
    console.log(`[SeedDatabase] Parsing ${ds.type} cost benchmarks from ${ds.filePath}...`);
    const content = fs.readFileSync(ds.filePath, 'utf8');
    const records = parseCSVRecords(content);
    if (records.length < 2) continue;

    const costHeaders = records[0].map(h => h.trim());
    const expectedCols = costHeaders.length;
    const costDocs: any[] = [];

    for (let i = 1; i < records.length; i++) {
      const cols = records[i];
      if (cols.length !== expectedCols) continue;

      const obj: Record<string, string> = {};
      for (let j = 0; j < expectedCols; j++) {
        obj[costHeaders[j]] = cols[j] !== undefined ? cols[j].trim() : '';
      }

      costDocs.push({
        cost_type: ds.type,
        tier: obj.tier || '',
        tierNormalized: normalize(obj.tier),
        specialty: obj.specialty || '',
        specialtyNormalized: normalize(obj.specialty),
        procedure: obj.procedure || '',
        procedureNormalized: normalize(obj.procedure),
        low_cost: parseFloat(obj.low_cost) || 0,
        highest_cost: parseFloat(obj.highest_cost) || 0,
        mean_cost: parseFloat(obj.mean_cost) || 0,
        estimated_stay_days: parseFloat(obj.estimated_stay_days) || 0,
        general_ward_cost_per_day: parseFloat(obj.general_ward_cost_per_day) || 0,
        twin_sharing_cost_per_day: parseFloat(obj.twin_sharing_cost_per_day) || 0,
        single_private_room_cost_per_day: parseFloat(obj.single_private_room_cost_per_day) || 0
      });
    }

    if (costDocs.length > 0) {
      await ProcedureCostModel.insertMany(costDocs, { ordered: false });
      totalCosts += costDocs.length;
      console.log(`[SeedDatabase] Inserted ${costDocs.length} ${ds.type} cost benchmarks.`);
    }
  }

  console.log(`[SeedDatabase] Seeding completed successfully!`);
  console.log(` - Total Hospital documents in MongoDB: ${totalHospitals}`);
  console.log(` - Total Procedure Cost documents in MongoDB: ${totalCosts}`);

  return { hospitalsCount: totalHospitals, costBenchmarksCount: totalCosts };
}

// Direct execution CLI runner
if (process.argv[1] && process.argv[1].endsWith('seedDatasetsToMongo.ts')) {
  (async () => {
    try {
      await connectDB();
      const force = process.argv.includes('--force');
      await seedDatasets(force);
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('[SeedDatabase] Fatal seeding error:', err);
      process.exit(1);
    }
  })();
}
