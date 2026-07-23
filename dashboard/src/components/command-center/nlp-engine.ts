export interface NLPTranslation {
  isNLP: boolean;
  convertedQuery?: string;
  explanation?: string;
}

export function parseNaturalLanguageQuery(query: string): NLPTranslation {
  const q = query.trim().toLowerCase();

  if (q.includes('users created this week') || q.includes('new users')) {
    return {
      isNLP: true,
      convertedQuery: 'created:last7days role:user',
      explanation: 'Filtered users registered in the last 7 days.'
    };
  }

  if (q.includes('orders above') || q.includes('high value orders')) {
    return {
      isNLP: true,
      convertedQuery: 'amount>500 status:completed',
      explanation: 'Filtered orders with total value greater than $500.'
    };
  }

  if (q.includes('inactive customers') || q.includes('suspended')) {
    return {
      isNLP: true,
      convertedQuery: 'status:disabled role:user',
      explanation: 'Filtered users with disabled account status.'
    };
  }

  if (q.includes('top customers in lagos') || q.includes('lagos')) {
    return {
      isNLP: true,
      convertedQuery: 'country:nigeria city:lagos role:vip',
      explanation: 'Filtered VIP users located in Lagos, Nigeria.'
    };
  }

  return { isNLP: false };
}
