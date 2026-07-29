export interface RippleAcquisition {
  id: string; date: string; shares: number; pricePerShareUsd: number;
}
export interface RippleSale {
  id: string; date: string; shares: number; pricePerShareUsd: number; settlementDate?: string;
}
export interface RipplePricePoint { date: string; priceUsd: number; }
export interface RippleHoldingRow { saleId: string; settlementDate: string; sharesSold: number; sharesHeldAfter: number; }

export const RIPPLE_ACQUISITIONS: RippleAcquisition[] = [];
export const RIPPLE_SALES: RippleSale[] = [];
export const RIPPLE_PRICE_HISTORY: RipplePricePoint[] = [];
export const RIPPLE_CURRENT_PRICE_USD = 0;
export const RIPPLE_IMPLIED_OPENING_SHARES = 0;
export const RIPPLE_SOLD_SHARES_TOTAL = 0;
export const RIPPLE_REMAINING_SHARES = 0;
export const RIPPLE_HOLDINGS_AFTER_EACH_SALE: RippleHoldingRow[] = [];
