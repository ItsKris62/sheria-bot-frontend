/**
 * Mock Data Generation for SheriaBot Dashboard
 * Generates realistic Kenyan fintech and regulatory organization data
 */

// ── Kenyan First Names & Surnames ──
const KENYAN_FIRST_NAMES = [
  'James', 'Peter', 'Mary', 'Grace', 'Samuel', 'Jane', 'David', 'Lucy', 'Joseph', 'Martha',
  'Robert', 'Patricia', 'Michael', 'Christine', 'William', 'Jennifer', 'Charles', 'Margaret',
  'Daniel', 'Elizabeth', 'Henry', 'Sandra', 'Samson', 'Rose', 'Felix', 'Anne', 'Isaac',
  'Rebecca', 'Jude', 'Deborah', 'Paul', 'Carol', 'Sylvester', 'Beatrice', 'Bernard',
  'Catherine', 'Elijah', 'Josephine', 'Ezra', 'Clara', 'Mathew', 'Linda', 'Zacharias',
];

const KENYAN_SURNAMES = [
  'Kipchoge', 'Omondi', 'Kamau', 'Kiplagat', 'Kemboi', 'Chepkwony', 'Kimani', 'Kipchoge',
  'Kipketer', 'Kinyanjui', 'Kiplagat', 'Rono', 'Kemboi', 'Kiprotich', 'Kipkech', 'Bett',
  'Kiplagat', 'Kipchoge', 'Cheruiyot', 'Kipchoge', 'Kiplagat', 'Kemboi', 'Kipkemboi',
  'Kipketer', 'Rotich', 'Kemboi', 'Kipchoge', 'Kiprotich', 'Kiplagat', 'Cherono', 'Kipkemboi',
  'Cheptoo', 'Kipkemboi', 'Kiplogech', 'Kipkemboi', 'Kipketer', 'Kipkemboi', 'Kipchoge',
];

// ── Organizations ──
const FINTECH_ORGANIZATIONS = [
  { name: 'M-Pesa', type: 'Mobile Money', sector: 'Digital Payments' },
  { name: 'Airtel Money', type: 'Mobile Money', sector: 'Digital Payments' },
  { name: 'Equity Bank', type: 'Commercial Bank', sector: 'Banking' },
  { name: 'Kenya Commercial Bank', type: 'Commercial Bank', sector: 'Banking' },
  { name: 'Safaricom PLC', type: 'Telecom/Fintech', sector: 'Digital Payments' },
  { name: 'Pesapal', type: 'Payment Processor', sector: 'Payments' },
  { name: 'Cellulant', type: 'Payment Gateway', sector: 'Payments' },
  { name: 'iHub', type: 'Startup Hub', sector: 'Tech Ecosystem' },
  { name: 'FSD Kenya', type: 'Development Fund', sector: 'Financial Services' },
  { name: 'Lemonade Kenya', type: 'Insurtech', sector: 'Insurance' },
  { name: 'CoverGenius', type: 'Insurtech', sector: 'Insurance' },
  { name: 'Fintech Sandbox', type: 'Regulatory Hub', sector: 'Compliance' },
  { name: 'Twiga Foods', type: 'Agritech', sector: 'Agriculture' },
  { name: 'Branch', type: 'Loantech', sector: 'Credit' },
  { name: 'Tala', type: 'Loantech', sector: 'Credit' },
  { name: 'Branch Kenya', type: 'Loantech', sector: 'Credit' },
  { name: 'Jijenge', type: 'Crowdfunding', sector: 'Finance' },
  { name: 'Blueflame', type: 'Energy Tech', sector: 'Energy' },
  { name: 'Collin', type: 'Marketplace', sector: 'Commerce' },
  { name: 'Herding', type: 'Supply Chain', sector: 'Agriculture' },
  { name: 'SambaSafari', type: 'Travel Fintech', sector: 'Travel' },
  { name: 'Khipu', type: 'Payments', sector: 'Digital Payments' },
  { name: 'Integrated Finance', type: 'Investment', sector: 'Finance' },
  { name: 'Kiwi Finance', type: 'Marketplace Lending', sector: 'Credit' },
  { name: 'Flutterwave', type: 'Payment Platform', sector: 'Payments' },
  { name: 'Stripe Kenya', type: 'Payment Processor', sector: 'Payments' },
  { name: 'easyJet Kenya', type: 'Travel', sector: 'Travel' },
  { name: 'Uber Kenya', type: 'Mobility', sector: 'Transportation' },
  { name: 'Digital Yard', type: 'Marketplace', sector: 'Commerce' },
  { name: 'Karaka', type: 'Lending Platform', sector: 'Credit' },
];

const REGULATOR_ORGANIZATIONS = [
  { name: 'Central Bank of Kenya', type: 'Regulator', sector: 'Central Banking' },
  { name: 'CMA', type: 'Regulator', sector: 'Securities' },
  { name: 'Insurance Regulatory Authority', type: 'Regulator', sector: 'Insurance' },
  { name: 'ICTA', type: 'Regulator', sector: 'Telecommunications' },
  { name: 'Data Protection Office', type: 'Regulator', sector: 'Data Privacy' },
];

// ── Regulatory Topics ──
const REGULATORY_TOPICS = [
  'CBK Circular on KYC Requirements',
  'AML/KYC Compliance Framework',
  'Data Protection Act Implementation',
  'Digital Payment Regulations',
  'Fintech Sandbox Guidelines',
  'Cryptocurrency Regulation',
  'Mobile Money Security Standards',
  'Cross-Border Payment Rules',
  'Financial Reporting Standards',
  'Consumer Protection Measures',
];

// ── Activity Types ──
const ACTIVITY_TYPES = [
  'Policy Updated', 'Compliance Check', 'Gap Analysis Completed', 'Document Uploaded',
  'User Logged In', 'Settings Changed', 'Permission Granted', 'Report Generated',
];

/**
 * Generate random Kenyan name
 */
function generateKenyanName(): string {
  const firstName = KENYAN_FIRST_NAMES[Math.floor(Math.random() * KENYAN_FIRST_NAMES.length)];
  const surname = KENYAN_SURNAMES[Math.floor(Math.random() * KENYAN_SURNAMES.length)];
  return `${firstName} ${surname}`;
}

/**
 * Generate random email
 */
function generateEmail(name: string): string {
  const [first, last] = name.toLowerCase().split(' ');
  const domains = ['sheriabot.com', 'fintech.ke', 'bankmail.ke', 'gmail.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${first}.${last}@${domain}`;
}

/**
 * Generate random date within last 6 months
 */
function generateRecentDate(): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000);
  return pastDate;
}

/**
 * Generate users
 */
export function generateUsers(count: number = 200) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const name = generateKenyanName();
    const role = ['Admin', 'Manager', 'Analyst', 'Viewer', 'Editor'][Math.floor(Math.random() * 5)];
    const org = FINTECH_ORGANIZATIONS[Math.floor(Math.random() * FINTECH_ORGANIZATIONS.length)];

    users.push({
      id: `usr_${i + 1}`,
      name,
      email: generateEmail(name),
      role,
      organization: org.name,
      tier: ['Free', 'Pro', 'Enterprise'][Math.floor(Math.random() * 3)],
      createdAt: generateRecentDate().toISOString(),
      lastLogin: generateRecentDate().toISOString(),
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });
  }
  return users;
}

/**
 * Generate fintech organizations
 */
export function generateFintechOrganizations() {
  return FINTECH_ORGANIZATIONS.map((org, idx) => ({
    id: `org_fin_${idx + 1}`,
    ...org,
    tier: ['Free', 'Pro', 'Enterprise'][Math.floor(Math.random() * 3)],
    usersCount: Math.floor(Math.random() * 500) + 5,
    createdAt: generateRecentDate().toISOString(),
    complianceScore: Math.floor(Math.random() * 100),
    status: Math.random() > 0.15 ? 'active' : 'inactive',
  }));
}

/**
 * Generate regulator organizations
 */
export function generateRegulatorOrganizations() {
  return REGULATOR_ORGANIZATIONS.map((org, idx) => ({
    id: `org_reg_${idx + 1}`,
    ...org,
    usersCount: Math.floor(Math.random() * 100) + 10,
    createdAt: new Date(2018, 0, 1).toISOString(),
    status: 'active',
  }));
}

/**
 * Generate audit logs
 */
export function generateAuditLogs(count: number = 200) {
  const logs = [];
  const users = generateUsers(20);

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = ACTIVITY_TYPES[Math.floor(Math.random() * ACTIVITY_TYPES.length)];

    logs.push({
      id: `log_${i + 1}`,
      userId: user.id,
      userName: user.name,
      action,
      resource: `Resource ${Math.floor(Math.random() * 100)}`,
      status: Math.random() > 0.1 ? 'success' : 'failure',
      timestamp: generateRecentDate().toISOString(),
      details: {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (compatible)',
        duration: Math.floor(Math.random() * 5000),
      },
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Generate time-series analytics data (daily for last 90 days)
 */
export function generateTimeSeriesData(metric: string, days: number = 90) {
  const data = [];
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    let value = 0;
    let compare = 0;

    switch (metric) {
      case 'revenue':
        value = Math.floor(Math.random() * 50000) + 30000;
        compare = Math.floor(Math.random() * 50000) + 25000;
        break;
      case 'users':
        value = Math.floor(Math.random() * 5000) + 1000;
        compare = Math.floor(Math.random() * 4500) + 800;
        break;
      case 'compliance':
        value = Math.floor(Math.random() * 30) + 70;
        compare = Math.floor(Math.random() * 25) + 65;
        break;
      case 'activeUsers':
        value = Math.floor(Math.random() * 2000) + 500;
        compare = Math.floor(Math.random() * 1800) + 400;
        break;
      default:
        value = Math.floor(Math.random() * 100);
        compare = Math.floor(Math.random() * 100);
    }

    data.push({
      date: date.toISOString().split('T')[0],
      value,
      compare,
      change: Math.floor(Math.random() * 20) - 10,
    });
  }

  return data;
}

/**
 * Generate compliance gaps
 */
export function generateComplianceGaps(count: number = 15) {
  const gaps = [];
  const frameworks = ['CBK', 'CMA', 'ICTA', 'DPA', 'AML/KYC'];
  const severities = ['critical', 'high', 'medium', 'low'];

  for (let i = 0; i < count; i++) {
    const framework = frameworks[Math.floor(Math.random() * frameworks.length)];
    gaps.push({
      id: `gap_${i + 1}`,
      framework,
      requirement: `${framework} Requirement ${i + 1}`,
      status: Math.random() > 0.4 ? 'open' : 'resolved',
      severity: severities[Math.floor(Math.random() * severities.length)],
      dueDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      owner: generateKenyanName(),
    });
  }

  return gaps;
}

/**
 * Generate regulatory alerts
 */
export function generateRegulatoryAlerts(count: number = 20) {
  const alerts = [];
  for (let i = 0; i < count; i++) {
    alerts.push({
      id: `alert_${i + 1}`,
      title: REGULATORY_TOPICS[Math.floor(Math.random() * REGULATORY_TOPICS.length)],
      description: 'New regulatory requirement affecting fintech operations',
      priority: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)],
      issuer: REGULATOR_ORGANIZATIONS[Math.floor(Math.random() * REGULATOR_ORGANIZATIONS.length)].name,
      publishedAt: generateRecentDate().toISOString(),
      effectiveDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: Math.random() > 0.5 ? 'new' : 'acknowledged',
    });
  }
  return alerts;
}

/**
 * Generate pilot participants
 */
export function generatePilotParticipants(count: number = 30) {
  const participants = [];
  const organizations = generateFintechOrganizations();

  for (let i = 0; i < count; i++) {
    const org = organizations[Math.floor(Math.random() * organizations.length)];
    const phases = ['screening', 'onboarding', 'active', 'completing'];

    participants.push({
      id: `pilot_${i + 1}`,
      organizationId: org.id,
      organizationName: org.name,
      phase: phases[Math.floor(Math.random() * phases.length)],
      startDate: generateRecentDate().toISOString(),
      completionDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      activationRate: Math.floor(Math.random() * 100),
      engagementScore: Math.floor(Math.random() * 100),
      status: 'active',
    });
  }

  return participants;
}

/**
 * Generate conversation threads (for AI chat simulation)
 */
export function generateConversations(count: number = 50) {
  const conversations = [];
  for (let i = 0; i < count; i++) {
    conversations.push({
      id: `conv_${i + 1}`,
      title: `Conversation about ${REGULATORY_TOPICS[Math.floor(Math.random() * REGULATORY_TOPICS.length)]}`,
      createdAt: generateRecentDate().toISOString(),
      updatedAt: generateRecentDate().toISOString(),
      messageCount: Math.floor(Math.random() * 50) + 5,
      status: Math.random() > 0.2 ? 'active' : 'archived',
    });
  }
  return conversations;
}

/**
 * Export all mock data
 */
export const mockData = {
  users: generateUsers(200),
  fintechOrganizations: generateFintechOrganizations(),
  regulatorOrganizations: generateRegulatorOrganizations(),
  auditLogs: generateAuditLogs(1000),
  complianceGaps: generateComplianceGaps(50),
  regulatoryAlerts: generateRegulatoryAlerts(100),
  pilotParticipants: generatePilotParticipants(50),
  conversations: generateConversations(100),
  timeSeriesData: {
    revenue: generateTimeSeriesData('revenue', 90),
    users: generateTimeSeriesData('users', 90),
    compliance: generateTimeSeriesData('compliance', 90),
    activeUsers: generateTimeSeriesData('activeUsers', 90),
  },
};
