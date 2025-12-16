import { delay } from "../../utils/delay";

/**
 * Represents a quote returned by a DEX
 */
export interface DexQuote {
  dex: "Raydium" | "Meteora";
  price: number;
  liquidityScore: number;
}

/**
 * Simulate fetching a Raydium quote
 */
async function getRaydiumQuote(): Promise<DexQuote> {
  await delay(2000); // simulate network delay

  return {
    dex: "Raydium",
    price: 24 + Math.random(), // mock price
    liquidityScore: Math.random(),
  };
}

/**
 * Simulate fetching a Meteora quote
 */
async function getMeteoraQuote(): Promise<DexQuote> {
  await delay(2000);

  return {
    dex: "Meteora",
    price: 24 + Math.random() * 1.05, // slight variation
    liquidityScore: Math.random(),
  };
}

/**
 * Compare quotes and return the best one
 */
export async function routeToBestDex(): Promise<DexQuote> {
  const [raydium, meteora] = await Promise.all([
    getRaydiumQuote(),
    getMeteoraQuote(),
  ]);

  // Choose best price (simple rule)
  return raydium.price >= meteora.price ? raydium : meteora;
}
