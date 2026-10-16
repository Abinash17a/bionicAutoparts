// src/lib/nhtsa/types.ts
/**
 * Types for NHTSA vPIC integration and Bionic Auto Parts Vehicle Guide
 */

import { InventoryItem } from '../inventory/inventoryRepository';

export interface MakeOption {
  makeId: number;
  makeName: string;
  isPopular?: boolean;
}

export interface ModelOption {
  makeId: number;
  makeName: string;
  modelId: number;
  modelName: string;
}

export interface DecodedVehicle {
  vin: string;
  isValidFormat: boolean;
  checkDigitValid: boolean;
  make: string;
  model: string;
  modelYear: string;
  trim: string;
  series: string;
  bodyClass: string;
  vehicleType: string;
  driveType: string;
  displacementL: string;
  engineCylinders: string;
  fuelTypePrimary: string;
  transmissionStyle: string;
  plantCountry: string;
  plantCity: string;
  manufacturer: string;
  errorCode: string;
  errorText: string;
  additionalErrorText?: string;
  isDecodeClean: boolean;
  hasDiscrepancy?: boolean;
  discrepancyMessage?: string;
  rawAttributes: Record<string, string>;
}

export interface InventoryCategoryLink {
  categorySlug: string;
  categoryTitle: string;
  url: string;
  inStockCount: number;
}

export interface VehicleVerificationResult {
  verified: boolean;
  make: string;
  model: string;
  modelYear: number;
  makeId?: number;
  modelId?: number;
  catalogStatus: 'CONFIRMED' | 'NOT_FOUND' | 'ERROR';
  message: string;
  availableModelsCount: number;
  matchingInventory: InventoryItem[];
  inventoryCategoryLinks: InventoryCategoryLink[];
  fitmentNotice: string;
  decodedVin?: DecodedVehicle;
}
