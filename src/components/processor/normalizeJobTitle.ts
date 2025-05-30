// normalizeJobTitle.ts
export enum JobTitle {
  CEO = 'CEO',
  CIO = 'CIO',
  CFO = 'CFO',
  CTO = 'CTO',
  CISO = 'CISO',
  COO = 'COO',
  ARCHITECT = 'ARCHITECT',
  STO = 'STO',
  IT_MANAGEMENT = 'IT_MANAGEMENT',
  INFORMATION_SECURITY = 'INFORMATION_SECURITY',
  INFRAESTRUCTURE = 'INFRAESTRUCTURE',
  OTHER = 'OTHER'
}

const normalizeJobTitle = (input: string): JobTitle => {
  const jobTitleMap: Record<string, JobTitle> = {
    'chief executive officer': JobTitle.CEO,
    'ceo': JobTitle.CEO,

    'chief information officer': JobTitle.CIO,
    'cio': JobTitle.CIO,

    'chief financial officer': JobTitle.CFO,
    'cfo': JobTitle.CFO,

    'chief technology officer': JobTitle.CTO,
    'cto': JobTitle.CTO,

    'chief information security officer': JobTitle.CISO,
    'ciso': JobTitle.CISO,

    'chief operating officer': JobTitle.COO,
    'coo': JobTitle.COO,

    'architect': JobTitle.ARCHITECT,

    'sto': JobTitle.STO,

    'manager': JobTitle.IT_MANAGEMENT,
    'management': JobTitle.IT_MANAGEMENT,
    'director': JobTitle.IT_MANAGEMENT,
    'head': JobTitle.IT_MANAGEMENT,
    'technology' :JobTitle.IT_MANAGEMENT,

    'security': JobTitle.INFORMATION_SECURITY,
    'information security': JobTitle.INFORMATION_SECURITY,

    'infrastructure': JobTitle.INFRAESTRUCTURE,
    'infraestructura': JobTitle.INFRAESTRUCTURE,
  };

  const cleanedInput = input.toLowerCase();

  for (const keyword in jobTitleMap) {
    if (cleanedInput.includes(keyword)) {
      return jobTitleMap[keyword];
    }
  }

  return JobTitle.OTHER;
};

export default normalizeJobTitle;