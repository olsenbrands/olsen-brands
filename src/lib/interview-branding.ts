export type InterviewBrandKey = 'subway' | 'wedgies' | 'fiiz';

export type InterviewBranding = {
  key: InterviewBrandKey;
  brandName: string;
  interviewTitle: string;
  pdfFilePrefix: string;
  workQuestion: string;
  workQuestionShort: string;
  strengthQuestion: string;
  favoriteItemQuestion: string;
  favoriteItemLabel: string;
  favoriteItemPlaceholder: string;
};

const BRANDING: Record<InterviewBrandKey, InterviewBranding> = {
  subway: {
    key: 'subway',
    brandName: 'Subway',
    interviewTitle: 'Interview Questionnaire — Subway',
    pdfFilePrefix: 'Subway',
    workQuestion: 'Why do you want to work at Subway?',
    workQuestionShort: 'Why Subway?',
    strengthQuestion: 'What would be your biggest strength in this job?',
    favoriteItemQuestion: "What’s your favorite Subway sandwich?",
    favoriteItemLabel: 'Favorite Subway Sandwich',
    favoriteItemPlaceholder: 'e.g. Italian B.M.T.',
  },
  wedgies: {
    key: 'wedgies',
    brandName: "Wedgie's",
    interviewTitle: "Interview Questionnaire — Wedgie's",
    pdfFilePrefix: 'Wedgies',
    workQuestion: "Why do you want to work at Wedgie's?",
    workQuestionShort: "Why Wedgie's?",
    strengthQuestion: 'What would be your biggest strength in this job?',
    favoriteItemQuestion: "What’s your favorite Wedgie’s menu item?",
    favoriteItemLabel: "Favorite Wedgie's Menu Item",
    favoriteItemPlaceholder: 'e.g. Buffalo chicken salad',
  },
  fiiz: {
    key: 'fiiz',
    brandName: 'FiiZ',
    interviewTitle: 'Interview Questionnaire — FiiZ',
    pdfFilePrefix: 'FiiZ',
    workQuestion: 'Why do you want to work at FiiZ?',
    workQuestionShort: 'Why FiiZ?',
    strengthQuestion: 'What would be your biggest strength in this job?',
    favoriteItemQuestion: "What’s your favorite FiiZ drink?",
    favoriteItemLabel: 'Favorite FiiZ Drink',
    favoriteItemPlaceholder: 'e.g. Dirty Dr Pepper',
  },
};

export function getInterviewBranding(business?: string | null): InterviewBranding {
  const normalized = (business || '').toLowerCase();

  if (normalized.includes('wedgie')) return BRANDING.wedgies;
  if (normalized.includes('fiiz')) return BRANDING.fiiz;
  return BRANDING.subway;
}
