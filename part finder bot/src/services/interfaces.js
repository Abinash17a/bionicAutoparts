export class InventorySearchService { async search() { return { available: false, reason: 'inventory integration not configured' }; } }
export class VehicleLookupService { async lookup() { return { available: false, reason: 'vehicle lookup integration not configured' }; } }
export class VINDecoderService { async decode() { return { available: false, reason: 'VIN decoder integration not configured' }; } }
export class PartCompatibilityService { async check() { return { available: false, reason: 'compatibility integration not configured' }; } }
export class PricingService { async quote() { return { available: false, reason: 'pricing integration not configured' }; } }
export class ShippingService { async quote() { return { available: false, reason: 'shipping integration not configured' }; } }
export class AuthProvider { async authenticate() { return { authenticated: false, reason: 'auth hook not configured' }; } }
