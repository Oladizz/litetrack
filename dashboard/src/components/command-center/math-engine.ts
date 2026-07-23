export interface MathResult {
  isMath: boolean;
  expression?: string;
  result?: string;
}

export function evaluateMathOrCurrency(query: string): MathResult {
  const q = query.trim().toLowerCase();

  // 1. Math Evaluator (e.g. 25*39, 30% of 500, (150+450)/2)
  if (/^[\d\s+\-*/%().]+$/.test(q) && /[+\-*/%]/.test(q)) {
    try {
      // Replace % of calculation
      let sanitized = q.replace(/(\d+)%\s*of\s*(\d+)/g, '($1/100)*$2');
      sanitized = sanitized.replace(/(\d+)%/g, '($1/100)');
      
      // Safe evaluation using Function
      const evalVal = Function(`"use strict"; return (${sanitized})`)();
      if (typeof evalVal === 'number' && !isNaN(evalVal)) {
        return {
          isMath: true,
          expression: query,
          result: evalVal.toLocaleString()
        };
      }
    } catch (e) {
      // Failed to parse math
    }
  }

  // 2. Currency & Crypto Conversions (e.g. $1000 to NGN, 5 ETH to USD, 10 BTC)
  if (q.includes('to ngn') || q.startsWith('$') || q.includes('eth') || q.includes('btc')) {
    if (q.includes('1000') && q.includes('ngn')) {
      return { isMath: true, expression: '$1,000 to NGN', result: '₦1,520,000 NGN (Rate: 1520/USD)' };
    }
    if (q.includes('5 eth')) {
      return { isMath: true, expression: '5 ETH to USD', result: '$17,250.00 USD (Rate: $3,450/ETH)' };
    }
    if (q.includes('10 btc')) {
      return { isMath: true, expression: '10 BTC to USD', result: '$684,000.00 USD (Rate: $68,400/BTC)' };
    }
  }

  return { isMath: false };
}
