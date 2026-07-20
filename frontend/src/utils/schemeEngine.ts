/**
 * CreditBridge Scheme Eligibility Engine
 * Rule-based matching for Indian Government Schemes.
 */

export interface UserProfile {
  age: number;
  monthlyIncome: number;
  occupation: string;
  state: string;
  familySize: number;
  ownsHouse: boolean;
  hasGirlChild: boolean;
  isFarmer: boolean;
  hasBankAccount: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  benefit: string;
  description: string;
  matchScore: number;
  reasons: string[];
}

export const matchSchemes = (profile: UserProfile): Scheme[] => {
  const annualIncome = profile.monthlyIncome * 12;
  const schemes: Scheme[] = [];

  // 1. Ayushman Bharat PMJAY
  if (annualIncome < 250000 && !['Salaried', 'Freelancer'].includes(profile.occupation)) {
    schemes.push({
      id: 'pmjay',
      name: 'Ayushman Bharat PMJAY',
      ministry: 'Ministry of Health',
      benefit: '₹5 Lakh per family/year',
      description: 'Free healthcare for the bottom 40% of the population.',
      matchScore: 95,
      reasons: ['Income within limits', 'Occupation category matched']
    });
  }

  // 2. PM Awas Yojana
  if (!profile.ownsHouse && annualIncome < 600000) {
    schemes.push({
      id: 'pmay',
      name: 'PM Awas Yojana (PMAY)',
      ministry: 'Ministry of Housing',
      benefit: 'Interest subsidy up to ₹2.67 Lakh',
      description: 'Subsidy on home loans for first-time urban/rural home buyers.',
      matchScore: 90,
      reasons: ['First-time home buyer', 'Income within EWS/LIG slab']
    });
  }

  // 3. Mudra Yojana (Shishu)
  if (['Self Employed', 'Street Vendor', 'Gig Worker'].includes(profile.occupation)) {
    schemes.push({
      id: 'mudra',
      name: 'PM Mudra Yojana (Shishu)',
      ministry: 'Ministry of Finance',
      benefit: 'Loans up to ₹50,000',
      description: 'Collateral-free loans for micro-enterprises and small businesses.',
      matchScore: 85,
      reasons: ['Small business/Gig worker category', 'No collateral needed']
    });
  }

  // 4. Atal Pension Yojana
  if (profile.age >= 18 && profile.age <= 40) {
    schemes.push({
      id: 'apy',
      name: 'Atal Pension Yojana',
      ministry: 'Ministry of Finance',
      benefit: 'Pension up to ₹5,000/month',
      description: 'Guaranteed pension for workers in the unorganized sector.',
      matchScore: 80,
      reasons: ['Age within eligible bracket', 'Post-retirement security']
    });
  }

  // 5. PM Kisan Samman Nidhi
  if (profile.isFarmer) {
    schemes.push({
      id: 'pmkisan',
      name: 'PM Kisan Samman Nidhi',
      ministry: 'Ministry of Agriculture',
      benefit: '₹6,000 per year',
      description: 'Direct income support for farmer families.',
      matchScore: 98,
      reasons: ['Farmer status verified']
    });
  }

  // 6. PM SVANidhi
  if (profile.occupation === 'Street Vendor') {
    schemes.push({
      id: 'svanidhi',
      name: 'PM SVANidhi',
      ministry: 'Ministry of Housing and Urban Affairs',
      benefit: 'Micro-credit up to ₹50,000',
      description: 'Working capital loan for street vendors.',
      matchScore: 99,
      reasons: ['Street vendor occupation matched', 'Low interest rate']
    });
  }

  return schemes.sort((a, b) => b.matchScore - a.matchScore);
};
