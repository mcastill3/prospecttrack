import { CompanySector } from '@prisma/client';

const normalizeSector = (input: string): CompanySector => {
  const sectorMap: Record<string, CompanySector> = {
    'agriculture': CompanySector.AGRICULTURE_AND_FARMING,
    'farming': CompanySector.AGRICULTURE_AND_FARMING,
    'agribusiness': CompanySector.AGRICULTURE_AND_FARMING,
    'construction': CompanySector.CONSTRUCTION_AND_INFRASTRUCTURE,
    'infrastructure': CompanySector.CONSTRUCTION_AND_INFRASTRUCTURE,
    'consumer': CompanySector.CONSUMER_AND_RETAIL,
    'retail': CompanySector.CONSUMER_AND_RETAIL,
    'ecommerce': CompanySector.CONSUMER_AND_RETAIL,
    'shopping': CompanySector.CONSUMER_AND_RETAIL,
    'defense': CompanySector.DEFENSE_AND_SECURITY,
    'security': CompanySector.DEFENSE_AND_SECURITY,
    'military': CompanySector.DEFENSE_AND_SECURITY,
    'design': CompanySector.DESIGN_AND_CREATIVE,
    'creative': CompanySector.DESIGN_AND_CREATIVE,
    'advertising': CompanySector.DESIGN_AND_CREATIVE,
    'branding': CompanySector.DESIGN_AND_CREATIVE,
    'education': CompanySector.EDUCATION,
    'school': CompanySector.EDUCATION,
    'university': CompanySector.EDUCATION,
    'academy': CompanySector.EDUCATION,
    'energy': CompanySector.ENERGY_AND_ENVIRONMENT,
    'environment': CompanySector.ENERGY_AND_ENVIRONMENT,
    'utilities': CompanySector.ENERGY_AND_ENVIRONMENT,
    'green': CompanySector.ENERGY_AND_ENVIRONMENT,
    'events': CompanySector.EVENTS_AND_HOSPITALITY,
    'hospitality': CompanySector.EVENTS_AND_HOSPITALITY,
    'travel': CompanySector.EVENTS_AND_HOSPITALITY,
    'tourism': CompanySector.EVENTS_AND_HOSPITALITY,
    'hotels': CompanySector.EVENTS_AND_HOSPITALITY,
    'finance': CompanySector.FINANCE_AND_INSURANCE,
    'financial': CompanySector.FINANCE_AND_INSURANCE,
    'banking': CompanySector.FINANCE_AND_INSURANCE,
    'insurance': CompanySector.FINANCE_AND_INSURANCE,
    'health': CompanySector.HEALTH_AND_WELLNESS,
    'wellness': CompanySector.HEALTH_AND_WELLNESS,
    'healthcare': CompanySector.HEALTH_AND_WELLNESS,
    'fitness': CompanySector.HEALTH_AND_WELLNESS,
    'industry': CompanySector.INDUSTRY_AND_MANUFACTURING,
    'manufacturing': CompanySector.INDUSTRY_AND_MANUFACTURING,
    'industrial': CompanySector.INDUSTRY_AND_MANUFACTURING,
    'production': CompanySector.INDUSTRY_AND_MANUFACTURING,
    'information technology': CompanySector.INFORMATION_TECHNOLOGY_AND_SERVICES,
    'it': CompanySector.INFORMATION_TECHNOLOGY_AND_SERVICES,
    'services': CompanySector.INFORMATION_TECHNOLOGY_AND_SERVICES,
    'logistics': CompanySector.LOGISTICS_AND_TRANSPORTATION,
    'transport': CompanySector.LOGISTICS_AND_TRANSPORTATION,
    'transportation': CompanySector.LOGISTICS_AND_TRANSPORTATION,
    'shipping': CompanySector.LOGISTICS_AND_TRANSPORTATION,
    'media': CompanySector.MEDIA_AND_ENTERTAINMENT,
    'entertainment': CompanySector.MEDIA_AND_ENTERTAINMENT,
    'tv': CompanySector.MEDIA_AND_ENTERTAINMENT,
    'radio': CompanySector.MEDIA_AND_ENTERTAINMENT,
    'non-profit': CompanySector.NON_PROFITS_AND_PHILANTHROPY,
    'nonprofit': CompanySector.NON_PROFITS_AND_PHILANTHROPY,
    'charity': CompanySector.NON_PROFITS_AND_PHILANTHROPY,
    'foundation': CompanySector.NON_PROFITS_AND_PHILANTHROPY,
    'other': CompanySector.OTHER_MATERIALS_AND_PRODUCTION,
    'misc': CompanySector.OTHER_MATERIALS_AND_PRODUCTION,
    'materials': CompanySector.OTHER_MATERIALS_AND_PRODUCTION,
    'pharma': CompanySector.PHARMACEUTICALS,
    'pharmaceuticals': CompanySector.PHARMACEUTICALS,
    'biotech': CompanySector.PHARMACEUTICALS,
    'consulting': CompanySector.PROFESSIONAL_SERVICES_AND_CONSULTING,
    'professional': CompanySector.PROFESSIONAL_SERVICES_AND_CONSULTING,
    'public': CompanySector.PUBLIC_SECTOR_AND_GOVERNMENT,
    'government': CompanySector.PUBLIC_SECTOR_AND_GOVERNMENT,
    'municipal': CompanySector.PUBLIC_SECTOR_AND_GOVERNMENT,
    'real estate': CompanySector.REAL_ESTATE,
    'property': CompanySector.REAL_ESTATE,
    'realty': CompanySector.REAL_ESTATE,
    'technology': CompanySector.TECHNOLOGY_AND_TELECOMMUNICATIONS,
    'telecom': CompanySector.TECHNOLOGY_AND_TELECOMMUNICATIONS,
    'telecommunications': CompanySector.TECHNOLOGY_AND_TELECOMMUNICATIONS,
    'tech': CompanySector.TECHNOLOGY_AND_TELECOMMUNICATIONS,
  };

  const cleanedInput = input.toLowerCase();

  for (const keyword in sectorMap) {
    if (cleanedInput.includes(keyword)) {
      return sectorMap[keyword];
    }
  }

  // Si no encontró coincidencias, retorna OTHER_MATERIALS_AND_PRODUCTION
  return CompanySector.OTHER_MATERIALS_AND_PRODUCTION;
};

export default normalizeSector;