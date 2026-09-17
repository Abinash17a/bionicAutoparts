// src/app/data/blogs/index.ts
import { BlogArticle } from './types';
import { article1_salvageYards } from './article1_salvageYards';
import { article2_qualityUsedParts } from './article2_qualityUsedParts';
import { article3_usedOemParts } from './article3_usedOemParts';
import { article4_gmPartsOnline } from './article4_gmPartsOnline';
import { article5_usedAutoPartsOnline } from './article5_usedAutoPartsOnline';
import { article6_genuineOemVerification } from './article6_genuineOemVerification';
import { article7_recycledAutoPartsBenefits } from './article7_recycledAutoPartsBenefits';
import { legacyArticles } from './legacyArticles';

export * from './types';
export {
  article1_salvageYards,
  article2_qualityUsedParts,
  article3_usedOemParts,
  article4_gmPartsOnline,
  article5_usedAutoPartsOnline,
  article6_genuineOemVerification,
  article7_recycledAutoPartsBenefits,
  legacyArticles,
};

export const blogs: BlogArticle[] = [
  article1_salvageYards,
  article2_qualityUsedParts,
  article3_usedOemParts,
  article4_gmPartsOnline,
  article5_usedAutoPartsOnline,
  article6_genuineOemVerification,
  article7_recycledAutoPartsBenefits,
  ...legacyArticles,
];

export default blogs;
