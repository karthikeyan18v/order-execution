"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeToBestDex = routeToBestDex;
const delay_1 = require("../../utils/delay");
/**
 * Simulate fetching a Raydium quote
 */
async function getRaydiumQuote() {
    await (0, delay_1.delay)(2000); // simulate network delay
    return {
        dex: "Raydium",
        price: 24 + Math.random(), // mock price
        liquidityScore: Math.random(),
    };
}
/**
 * Simulate fetching a Meteora quote
 */
async function getMeteoraQuote() {
    await (0, delay_1.delay)(2000);
    return {
        dex: "Meteora",
        price: 24 + Math.random() * 1.05, // slight variation
        liquidityScore: Math.random(),
    };
}
/**
 * Compare quotes and return the best one
 */
async function routeToBestDex() {
    const [raydium, meteora] = await Promise.all([
        getRaydiumQuote(),
        getMeteoraQuote(),
    ]);
    // Choose best price (simple rule)
    return raydium.price >= meteora.price ? raydium : meteora;
}
