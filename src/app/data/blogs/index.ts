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
import { article11_checkUsedEngine } from './article11_checkUsedEngine';
import { article12_checkUsedTransmission } from './article12_checkUsedTransmission';
import { article13_vinNumberGuide } from './article13_vinNumberGuide';
import { article14_oemVsAftermarketVsUsed } from './article14_oemVsAftermarketVsUsed';
import { article15_whatIsSalvageYard } from './article15_whatIsSalvageYard';
import { article16_usedEngineBuyingGuide } from './article16_usedEngineBuyingGuide';
import { article17_usedTransmissionBuyingGuide } from './article17_usedTransmissionBuyingGuide';
import { article18_hollanderInterchange } from './article18_hollanderInterchange';
import { article19_partGradingGuide } from './article19_partGradingGuide';
import { article20_nationwideShipping } from './article20_nationwideShipping';
import { article21_engineAssemblyGuide } from './article21_engineAssemblyGuide';

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
  article11_checkUsedEngine,
  article12_checkUsedTransmission,
  article13_vinNumberGuide,
  article14_oemVsAftermarketVsUsed,
  article15_whatIsSalvageYard,
  article16_usedEngineBuyingGuide,
  article17_usedTransmissionBuyingGuide,
  article18_hollanderInterchange,
  article19_partGradingGuide,
  article20_nationwideShipping,
  article21_engineAssemblyGuide,
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
  article11_checkUsedEngine,
  article12_checkUsedTransmission,
  article13_vinNumberGuide,
  article14_oemVsAftermarketVsUsed,
  article15_whatIsSalvageYard,
  article16_usedEngineBuyingGuide,
  article17_usedTransmissionBuyingGuide,
  article18_hollanderInterchange,
  article19_partGradingGuide,
  article20_nationwideShipping,
  article21_engineAssemblyGuide,
];

export default blogs;
