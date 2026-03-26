export const DCOIN_SYMBOL = import.meta.env.VITE_DCOIN_SYMBOL || 'Ð'
export const DCOIN_NAME = import.meta.env.VITE_DCOIN_NAME || 'DLove Coin'
// 1Ð = ¥0.01
// 兑换关系：1Ð = 1¥；所有后端金额均为“分”（整数）
export const RMB_PER_DCOIN = 1

export function formatDCoin(amount) {
  const a = typeof amount === 'number' ? amount : parseInt(amount || 0, 10)
  return `${DCOIN_SYMBOL}${(a / 100).toFixed(2)}`
}

export function toDCoinFromRMB(rmbAmount) {
  const r = typeof rmbAmount === 'number' ? rmbAmount : parseFloat(rmbAmount || 0)
  if (Number.isNaN(r)) return 0
  return Math.floor(r * 100)
}

export function formatRMBFromDCoin(dAmount) {
  const a = typeof dAmount === 'number' ? dAmount : parseInt(dAmount || 0, 10)
  return `¥${(a / 100).toFixed(2)}`
}
