export function validateVin(value) { return /^[A-HJ-NPR-Z0-9]{17}$/i.test(value); }
export function extractVin(text) { const value=text.match(/\b[A-HJ-NPR-Z0-9]{17}\b/i)?.[0]?.toUpperCase(); return value ? {value,valid:validateVin(value)} : null; }
