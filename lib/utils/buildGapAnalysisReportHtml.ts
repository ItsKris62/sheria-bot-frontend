/**
 * Gap Analysis HTML Report Builder
 *
 * Generates a complete, self-contained HTML document for printing to PDF.
 * All content is escaped. No external dependencies or network requests.
 */

// ─── Types ─────────────────────────────────────────────────────────────────

export interface GapAnalysisReportGap {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  regulatoryBasis: string;
  policyCurrentState: string;
  recommendation: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: number;
  evidenceRequired?: string[];
  responsibleRole?: string;
  regulatoryDeadline?: string;
}

export interface GapAnalysisReportFramework {
  id: string;
  name: string;
  score: number;
  summary: string;
  gaps: GapAnalysisReportGap[];
  strengths: string[];
}

export interface GapAnalysisReportActionItem {
  priority: number;
  action: string;
  framework: string;
  deadline: string;
  effort: string;
  resources: string[];
  responsibleRole?: string;
  dependsOn?: string[];
}

export interface GapAnalysisReportResult {
  overallScore: number;
  executiveSummary: string;
  frameworks: GapAnalysisReportFramework[];
  crossCuttingStrengths?: string[];
  actionPlan: GapAnalysisReportActionItem[];
  metadata: {
    totalGaps: number;
    criticalGaps: number;
    highGaps: number;
    mediumGaps?: number;
    lowGaps?: number;
    chunksProcessed?: number;
    analysisDate?: string;
  };
}

export interface GapAnalysisReportData {
  result: GapAnalysisReportResult;
  analysisId: string;
  documentName: string;
  regulatoryFrameworks: string[];
  analysisDepth: string;
  ragGrounded: boolean;
  chunksProcessed: number;
  createdAt: string;
  organizationName?: string;
  userName?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function escapeHtml(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function getScoreColor(score: number): string {
  if (score >= 75) return '#00875A';
  if (score >= 50) return '#D4A843';
  return '#DC2626';
}

function getScoreLabel(score: number): string {
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Critical Risk';
}

function getSeverityBg(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return '#FEE2E2';
    case 'HIGH':     return '#FEF3C7';
    case 'MEDIUM':   return '#FEF9C3';
    case 'LOW':      return '#DBEAFE';
    default:         return '#F3F4F6';
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL': return '#DC2626';
    case 'HIGH':     return '#D97706';
    case 'MEDIUM':   return '#CA8A04';
    case 'LOW':      return '#2563EB';
    default:         return '#4A5568';
  }
}

function formatDepth(depth: string): string {
  switch (depth) {
    case 'quick': return 'Quick Scan';
    case 'deep':  return 'Deep Analysis';
    default:      return 'Standard Analysis';
  }
}

/** Split on double newlines and render as <p> tags. */
function renderParagraphs(text: string): string {
  return text
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((p) => `<p style="margin:0 0 12px;line-height:1.65;color:#4A5568;">${escapeHtml(p.trim())}</p>`)
    .join('');
}

// ─── Main export ────────────────────────────────────────────────────────────

export function buildGapAnalysisReportHtml(data: GapAnalysisReportData): string {
  const {
    result,
    analysisId,
    documentName,
    analysisDepth,
    ragGrounded,
    chunksProcessed,
    createdAt,
    organizationName,
    userName,
  } = data;

  const { overallScore, executiveSummary, frameworks, crossCuttingStrengths, actionPlan, metadata } = result;
  const displayName = organizationName ?? userName ?? 'Your Organisation';
  const scoreColor = getScoreColor(overallScore);
  const formattedDate = formatDate(createdAt);

  // Top risks — up to 3 CRITICAL or HIGH gaps sorted by severity then priority
  type GapWithFw = GapAnalysisReportGap & { frameworkName: string };
  const allGaps: GapWithFw[] = frameworks.flatMap((fw) =>
    fw.gaps.map((g) => ({ ...g, frameworkName: fw.name }))
  );
  const sevOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const topRisks = [...allGaps]
    .sort((a, b) => (sevOrder[a.severity] ?? 3) - (sevOrder[b.severity] ?? 3) || a.priority - b.priority)
    .filter((g) => g.severity === 'CRITICAL' || g.severity === 'HIGH')
    .slice(0, 3);

  // Appendix A — regulatory references grouped by framework
  const refsByFramework = new Map<string, string[]>();
  for (const fw of frameworks) {
    const refs: string[] = [];
    const seen = new Set<string>();
    for (const gap of fw.gaps) {
      if (gap.regulatoryBasis && !seen.has(gap.regulatoryBasis)) {
        seen.add(gap.regulatoryBasis);
        refs.push(gap.regulatoryBasis);
      }
    }
    if (refs.length > 0) refsByFramework.set(fw.name, refs);
  }

  // Appendix B — evidence items grouped by framework (deduplicated)
  const evidenceByFramework = new Map<string, Array<{ evidence: string; gapId: string }>>();
  for (const fw of frameworks) {
    const items: Array<{ evidence: string; gapId: string }> = [];
    const seen = new Set<string>();
    for (const gap of fw.gaps) {
      for (const ev of gap.evidenceRequired ?? []) {
        if (ev && !seen.has(ev)) {
          seen.add(ev);
          items.push({ evidence: ev, gapId: gap.id });
        }
      }
    }
    if (items.length > 0) evidenceByFramework.set(fw.name, items);
  }

  const sortedActionPlan = [...actionPlan].sort((a, b) => a.priority - b.priority);

  // ─── CSS ────────────────────────────────────────────────────────────────

  const css = `
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
      font-size: 11pt; color: #4A5568; margin: 0; padding: 0; background: #F7F8FA;
    }
    .wrap { max-width: 860px; margin: 0 auto; background: #fff; }
    h1 { font-size: 26pt; color: #1A2B4A; margin: 0 0 16px; line-height: 1.2; }
    h2 {
      font-size: 18pt; color: #1A2B4A; margin: 0 0 16px;
      padding-bottom: 8px; border-bottom: 2px solid #1A2B4A;
    }
    h3 { font-size: 14pt; color: #00875A; margin: 0 0 10px; }
    h4 { font-size: 11pt; color: #1A2B4A; margin: 0 0 8px; font-weight: bold; }
    p  { margin: 0 0 10px; line-height: 1.65; color: #4A5568; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 18px; font-size: 9pt; }
    th { background: #1A2B4A; color: #fff; padding: 8px 10px; text-align: left; font-weight: bold; }
    td { padding: 7px 10px; border: 1px solid #E2E8F0; vertical-align: top; }
    tr:nth-child(even) td { background: #F7F8FA; }
    ul { margin: 4px 0 0; padding-left: 18px; }
    li { margin-bottom: 3px; line-height: 1.5; }
    code { font-family: monospace; font-size: 8.5pt; background: #F7F8FA; padding: 1px 4px; border-radius: 3px; }

    /* Layout */
    .section { padding: 40px 50px; }
    .cover  { padding: 60px 50px; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
    .page-break { page-break-before: always; }

    /* Logo */
    .logo-wrap  { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
    .logo-icon  {
      width: 44px; height: 44px; background: #1A2B4A; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: #00875A; font-size: 22px; font-weight: 900; line-height: 1;
    }
    .logo-name  { font-size: 20pt; font-weight: bold; color: #1A2B4A; letter-spacing: -0.5px; }

    /* Cover */
    .conf-banner { background: #1A2B4A; color: #D4A843; text-align: center; font-weight: bold; font-size: 13pt; letter-spacing: 3px; padding: 10px; margin: 28px 0; }
    .cover-title { font-size: 28pt; color: #1A2B4A; font-weight: bold; margin: 0 0 12px; line-height: 1.2; }
    .cover-sub   { font-size: 15pt; color: #4A5568; margin: 0 0 28px; }
    .depth-tag   { display: inline-block; background: #EFF6FF; color: #1A2B4A; padding: 3px 10px; border-radius: 4px; font-size: 9pt; border: 1px solid #BFDBFE; margin-bottom: 16px; }
    .score-wrap  { display: flex; align-items: center; gap: 24px; margin: 20px 0; }
    .score-circle {
      width: 120px; height: 120px; border-radius: 50%;
      border: 8px solid ${scoreColor};
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: #fff; flex-shrink: 0;
    }
    .score-num   { font-size: 36pt; font-weight: bold; color: ${scoreColor}; line-height: 1; }
    .score-lbl   { font-size: 9pt; color: #4A5568; margin-top: 3px; }
    .fw-badges   { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
    .fw-badge    { background: #00875A; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 9pt; font-weight: 500; }
    .cover-foot  { font-size: 9pt; color: #718096; border-top: 1px solid #E2E8F0; padding-top: 12px; margin-top: 20px; }

    /* Metrics */
    .metrics-row { display: flex; gap: 10px; margin: 18px 0; }
    .metric-card { flex: 1; padding: 14px 10px; border-radius: 6px; text-align: center; }
    .metric-num  { font-size: 26pt; font-weight: bold; line-height: 1; margin-bottom: 4px; }
    .metric-lbl  { font-size: 9pt; }

    /* Risk cards */
    .risk-card  { border-left: 4px solid; padding: 12px 16px; margin-bottom: 10px; border-radius: 0 6px 6px 0; }
    .risk-title { font-weight: bold; color: #1A2B4A; margin-bottom: 4px; font-size: 11pt; }
    .risk-ref   { font-size: 9pt; color: #4A5568; }

    /* Methodology */
    .method-table td:first-child { width: 200px; font-weight: bold; color: #1A2B4A; background: #F7F8FA; }
    .disclaimer {
      background: #FFFBEB; border: 1px solid #D4A843; border-radius: 6px;
      padding: 14px 18px; margin-top: 20px;
    }
    .disclaimer p { font-size: 9.5pt; color: #78350F; margin: 0; }

    /* Framework score bar */
    .bar-track { height: 16px; border-radius: 8px; background: #E2E8F0; margin: 6px 0 16px; overflow: hidden; }
    .bar-fill  { height: 100%; border-radius: 8px; }

    /* Severity */
    .sev-badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 8.5pt; }

    /* RAG warning */
    .rag-warn {
      background: #FFFBEB; border: 1px solid #F59E0B; border-radius: 6px;
      padding: 10px 14px; margin-bottom: 18px; font-size: 9.5pt; color: #78350F;
    }

    /* Evidence checklist */
    .ev-item { margin-bottom: 6px; font-size: 10pt; line-height: 1.5; }

    /* Report footer */
    .report-foot {
      font-size: 8.5pt; color: #718096; border-top: 1px solid #E2E8F0;
      padding: 8px 50px; background: #fff;
    }

    @media screen {
      body { background: #CBD5E0; }
      .wrap { box-shadow: 0 2px 20px rgba(0,0,0,0.15); margin: 20px auto; }
    }
    @media print {
      body { background: #fff; }
      .wrap { max-width: 100%; box-shadow: none; margin: 0; }
      .no-print { display: none !important; }
      .page-break { page-break-before: always; }
      table { page-break-inside: avoid; }
      tr { page-break-inside: avoid; }
      .cover { page-break-after: always; }
      .risk-card, .disclaimer { page-break-inside: avoid; }
      @page { margin: 1.5cm; }
    }
  `;

  // ─── HTML sections ───────────────────────────────────────────────────────

  const coverHtml = `
<div class="cover">
  <div>
    <div class="logo-wrap">
      <div class="logo-icon">S</div>
      <span class="logo-name">SheriaBot</span>
    </div>

    <div class="conf-banner">CONFIDENTIAL</div>

    <p class="cover-title">Regulatory Compliance Gap Analysis Report</p>
    <p class="cover-sub">Prepared for ${escapeHtml(displayName)}</p>
    <span class="depth-tag">${escapeHtml(formatDepth(analysisDepth))}</span>

    <div class="score-wrap">
      <div class="score-circle">
        <span class="score-num">${overallScore}</span>
        <span class="score-lbl">${getScoreLabel(overallScore)}</span>
      </div>
      <div>
        <p style="font-size:11pt;color:#4A5568;margin-bottom:6px;">Overall Compliance Score</p>
        <p style="font-size:10pt;color:#4A5568;margin-bottom:4px;">Date: <strong>${escapeHtml(formattedDate)}</strong></p>
        <p style="font-size:10pt;color:#4A5568;margin-bottom:4px;">Document: <strong>${escapeHtml(documentName)}</strong></p>
        <p style="font-size:10pt;color:#4A5568;margin-bottom:0;">Report ID: <code>${escapeHtml(analysisId)}</code></p>
      </div>
    </div>

    <p style="font-size:10pt;color:#4A5568;margin:14px 0 8px;font-weight:bold;">Frameworks Analysed:</p>
    <div class="fw-badges">
      ${frameworks.map((fw) => `<span class="fw-badge">${escapeHtml(fw.name)}</span>`).join('\n      ')}
    </div>
  </div>

  <div class="cover-foot">
    Generated by SheriaBot | sheriabot.com | ${escapeHtml(formattedDate)}
  </div>
</div>`;

  const execSummaryHtml = `
<div class="section page-break">
  <h2>Executive Summary</h2>

  ${ragGrounded === false ? `
  <div class="rag-warn">
    <strong>Warning: Limited regulatory grounding.</strong> This analysis was generated without
    access to the SheriaBot regulatory document database. Results are based on AI training
    knowledge only and may not reflect the latest Kenyan regulations or recent amendments.
  </div>` : ''}

  ${renderParagraphs(executiveSummary)}

  <div class="metrics-row" style="margin-top:24px;">
    <div class="metric-card" style="background:#F7F8FA;">
      <div class="metric-num" style="color:#4A5568;">${metadata.totalGaps}</div>
      <div class="metric-lbl" style="color:#4A5568;">Total Gaps</div>
    </div>
    <div class="metric-card" style="background:#FEE2E2;">
      <div class="metric-num" style="color:#DC2626;">${metadata.criticalGaps}</div>
      <div class="metric-lbl" style="color:#DC2626;">Critical</div>
    </div>
    <div class="metric-card" style="background:#FEF3C7;">
      <div class="metric-num" style="color:#D97706;">${metadata.highGaps}</div>
      <div class="metric-lbl" style="color:#D97706;">High</div>
    </div>
    <div class="metric-card" style="background:#FEF9C3;">
      <div class="metric-num" style="color:#CA8A04;">${metadata.mediumGaps ?? 0}</div>
      <div class="metric-lbl" style="color:#CA8A04;">Medium</div>
    </div>
    <div class="metric-card" style="background:#DBEAFE;">
      <div class="metric-num" style="color:#2563EB;">${metadata.lowGaps ?? 0}</div>
      <div class="metric-lbl" style="color:#2563EB;">Low</div>
    </div>
  </div>

  ${topRisks.length > 0 ? `
  <h3 style="margin-top:24px;">Top Risks</h3>
  ${topRisks.map((gap) => `
  <div class="risk-card" style="border-left-color:${getSeverityColor(gap.severity)};background:${getSeverityBg(gap.severity)}40;">
    <div class="risk-title">
      <span class="sev-badge" style="background:${getSeverityBg(gap.severity)};color:${getSeverityColor(gap.severity)};">${escapeHtml(gap.severity)}</span>
      &nbsp;${escapeHtml(gap.title)}
    </div>
    <div class="risk-ref">
      Reg. Reference: ${escapeHtml(gap.regulatoryBasis)}
      &bull; Framework: ${escapeHtml(gap.frameworkName)}
      ${gap.regulatoryDeadline ? `&bull; Deadline: ${escapeHtml(gap.regulatoryDeadline)}` : ''}
    </div>
  </div>`).join('')}
  ` : ''}

  ${crossCuttingStrengths && crossCuttingStrengths.length > 0 ? `
  <h3 style="margin-top:24px;">Cross-Cutting Strengths</h3>
  <ul>
    ${crossCuttingStrengths.map((s) => `<li>${escapeHtml(s)}</li>`).join('\n    ')}
  </ul>` : ''}
</div>`;

  const methodologyHtml = `
<div class="section page-break">
  <h2>Methodology</h2>

  <table class="method-table">
    <tbody>
      <tr><td>Document Analysed</td><td>${escapeHtml(documentName)}</td></tr>
      <tr><td>Analysis Date</td><td>${escapeHtml(formattedDate)}</td></tr>
      <tr><td>Analysis Depth</td><td>${escapeHtml(formatDepth(analysisDepth))}</td></tr>
      <tr><td>Chunks Processed</td><td>${escapeHtml(String(chunksProcessed))} ${chunksProcessed > 1 ? '(Full document multi-pass analysis)' : '(Single-pass analysis)'}</td></tr>
      <tr><td>Frameworks Assessed</td><td>${frameworks.map((f) => escapeHtml(f.name)).join(', ')}</td></tr>
      <tr><td>Regulatory Grounding</td><td>${ragGrounded
        ? '<span style="color:#00875A;font-weight:bold;">Grounded in SheriaBot regulatory document database</span>'
        : '<span style="color:#D97706;font-weight:bold;">Warning: Limited grounding &mdash; AI knowledge only</span>'
      }</td></tr>
      <tr><td>Report ID</td><td><code>${escapeHtml(analysisId)}</code></td></tr>
    </tbody>
  </table>

  <div class="disclaimer">
    <p><strong>Important Disclaimer:</strong> This report is generated by AI-assisted analysis
    and should be reviewed by qualified compliance professionals before being used for regulatory
    submissions. SheriaBot does not provide legal advice. The findings represent an automated
    assessment and may not capture all applicable regulatory obligations specific to your business
    model.</p>
  </div>
</div>`;

  const frameworksHtml = frameworks.map((fw, fwIdx) => {
    const fwColor = getScoreColor(fw.score);
    const scoreW = Math.min(Math.max(Math.round(fw.score), 0), 100);

    const gapsTableHtml = fw.gaps.length === 0
      ? `<p style="color:#00875A;font-weight:bold;padding:12px 0;">No gaps identified for this framework.</p>`
      : `<table>
      <thead>
        <tr>
          <th style="width:28px;">#</th>
          <th style="width:140px;">Gap Title</th>
          <th style="width:72px;">Severity</th>
          <th style="width:120px;">Regulatory Reference</th>
          <th style="width:115px;">Current State</th>
          <th style="width:125px;">Recommendation</th>
          <th style="width:110px;">Evidence Required</th>
          <th style="width:70px;">Owner</th>
          <th style="width:50px;">Effort</th>
          <th style="width:36px;">Pri.</th>
        </tr>
      </thead>
      <tbody>
        ${fw.gaps.map((gap, gi) => {
          const bg = getSeverityBg(gap.severity);
          const col = getSeverityColor(gap.severity);
          const rowBg = gi % 2 === 0 ? '#fff' : '#F7F8FA';
          const evidenceHtml = gap.evidenceRequired && gap.evidenceRequired.length > 0
            ? `<ul style="margin:0;padding-left:14px;">${gap.evidenceRequired.map((ev) => `<li>${escapeHtml(ev)}</li>`).join('')}</ul>`
            : '<span style="color:#9CA3AF;">&#8212;</span>';
          return `<tr style="background:${rowBg};">
            <td style="text-align:center;font-size:8.5pt;color:#718096;">${gi + 1}</td>
            <td style="font-weight:bold;font-size:9pt;">${escapeHtml(gap.title)}</td>
            <td style="background:${bg};">
              <span class="sev-badge" style="background:${bg};color:${col};">${escapeHtml(gap.severity)}</span>
              ${gap.regulatoryDeadline ? `<br/><span style="font-size:7.5pt;color:#4A5568;">Due: ${escapeHtml(gap.regulatoryDeadline)}</span>` : ''}
            </td>
            <td style="font-size:8.5pt;">${escapeHtml(gap.regulatoryBasis)}</td>
            <td style="font-size:8.5pt;">${escapeHtml(gap.policyCurrentState)}</td>
            <td style="font-size:8.5pt;">${escapeHtml(gap.recommendation)}</td>
            <td style="font-size:8.5pt;">${evidenceHtml}</td>
            <td style="font-size:8.5pt;">${escapeHtml(gap.responsibleRole ?? '&#8212;')}</td>
            <td style="font-size:8.5pt;text-align:center;">${escapeHtml(gap.effort)}</td>
            <td style="text-align:center;font-weight:bold;">${gap.priority}</td>
          </tr>`;
        }).join('\n        ')}
      </tbody>
    </table>`;

    return `
<div class="section page-break">
  <h2>Framework ${fwIdx + 1}: ${escapeHtml(fw.name)}</h2>

  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
    <div style="flex:1;">
      <div class="bar-track">
        <div class="bar-fill" style="width:${scoreW}%;background:${fwColor};"></div>
      </div>
    </div>
    <div style="font-size:16pt;font-weight:bold;color:${fwColor};min-width:55px;text-align:right;">${scoreW}%</div>
  </div>

  ${fw.summary ? `<p style="color:#4A5568;font-style:italic;margin-bottom:18px;">${escapeHtml(fw.summary)}</p>` : ''}

  ${fw.strengths.length > 0 ? `
  <h3>Strengths</h3>
  <ul style="margin-bottom:20px;">
    ${fw.strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join('\n    ')}
  </ul>` : ''}

  <h3>Compliance Gaps</h3>
  ${gapsTableHtml}
</div>`;
  }).join('\n');

  const actionPlanHtml = `
<div class="section page-break">
  <h2>Remediation Action Plan</h2>
  <p>The following actions are prioritised by urgency and regulatory impact. Dependencies between
  actions are noted to support implementation sequencing.</p>

  <table>
    <thead>
      <tr>
        <th style="width:50px;">Priority</th>
        <th>Action</th>
        <th style="width:90px;">Responsible</th>
        <th style="width:90px;">Deadline</th>
        <th style="width:130px;">Dependencies</th>
        <th style="width:60px;">Effort</th>
        <th style="width:120px;">Resources</th>
      </tr>
    </thead>
    <tbody>
      ${sortedActionPlan.map((item, idx) => {
        const hi = item.priority <= 3;
        const rowBg = idx % 2 === 0 ? '#fff' : '#F7F8FA';
        const leftBorder = hi ? 'border-left:4px solid #D4A843;' : '';
        const deps = item.dependsOn && item.dependsOn.length > 0
          ? escapeHtml(item.dependsOn.join(', '))
          : 'None';
        return `<tr style="background:${rowBg};${leftBorder}">
          <td style="text-align:center;font-weight:bold;${hi ? 'color:#D4A843;' : ''}">${item.priority}</td>
          <td style="font-size:9pt;font-weight:500;">${escapeHtml(item.action)}</td>
          <td style="font-size:8.5pt;">${escapeHtml(item.responsibleRole ?? '&#8212;')}</td>
          <td style="font-size:8.5pt;">${escapeHtml(item.deadline)}</td>
          <td style="font-size:8.5pt;">${deps}</td>
          <td style="font-size:8.5pt;text-align:center;">${escapeHtml(item.effort)}</td>
          <td style="font-size:8.5pt;">${item.resources.map((r) => escapeHtml(r)).join(', ')}</td>
        </tr>`;
      }).join('\n      ')}
    </tbody>
  </table>
</div>`;

  const appendixAHtml = `
<div class="section page-break">
  <h2>Appendix A: Regulatory References</h2>

  ${refsByFramework.size === 0
    ? `<p style="color:#9CA3AF;">No specific regulatory references were cited in this analysis.</p>`
    : Array.from(refsByFramework.entries()).map(([fwName, refs]) => `
  <h3>${escapeHtml(fwName)}</h3>
  <ol style="margin-bottom:16px;">
    ${refs.map((ref) => `<li style="margin-bottom:4px;font-size:10pt;">${escapeHtml(ref)}</li>`).join('\n    ')}
  </ol>`).join('')
  }
</div>`;

  const appendixBHtml = `
<div class="section page-break">
  <h2>Appendix B: Required Evidence &amp; Documentation Checklist</h2>
  <p style="color:#4A5568;margin-bottom:20px;">
    The following documents must be produced or obtained to close the identified compliance gaps.
    This checklist can be printed and used for manual tracking.
  </p>

  ${evidenceByFramework.size === 0
    ? `<p style="color:#9CA3AF;">No specific evidence requirements were identified in this analysis.</p>`
    : Array.from(evidenceByFramework.entries()).map(([fwName, items]) => `
  <h3>${escapeHtml(fwName)}</h3>
  <div style="margin-bottom:20px;">
    ${items.map((item) => `
    <div class="ev-item">
      &#9744; ${escapeHtml(item.evidence)}
      <span style="font-size:8.5pt;color:#9CA3AF;margin-left:8px;">[Gap: ${escapeHtml(item.gapId)}]</span>
    </div>`).join('')}
  </div>`).join('')
  }
</div>`;

  // Static glossary — no user content, no escaping needed
  const appendixCHtml = `
<div class="section page-break">
  <h2>Appendix C: Glossary of Regulatory Terms</h2>

  <table>
    <thead>
      <tr>
        <th style="width:80px;">Abbreviation</th>
        <th style="width:200px;">Full Name</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>DPA</td><td>Data Protection Act</td><td>Kenya's primary data protection legislation (Act No. 24 of 2019)</td></tr>
      <tr><td>ODPC</td><td>Office of the Data Protection Commissioner</td><td>Regulator responsible for enforcing the DPA 2019</td></tr>
      <tr><td>CBK</td><td>Central Bank of Kenya</td><td>Regulator for banks, microfinance institutions, and payment service providers</td></tr>
      <tr><td>CMA</td><td>Capital Markets Authority</td><td>Regulator for securities and capital markets</td></tr>
      <tr><td>DPO</td><td>Data Protection Officer</td><td>Individual responsible for an organisation's data protection compliance</td></tr>
      <tr><td>DSAR</td><td>Data Subject Access Request</td><td>Formal request by an individual to access their personal data</td></tr>
      <tr><td>DPIA</td><td>Data Protection Impact Assessment</td><td>Assessment of risks posed by data processing activities</td></tr>
      <tr><td>AML/CFT</td><td>Anti-Money Laundering / Combating the Financing of Terrorism</td><td>Regulatory framework for preventing financial crimes</td></tr>
      <tr><td>KYC</td><td>Know Your Customer</td><td>Customer identification and verification requirements</td></tr>
      <tr><td>CDD</td><td>Customer Due Diligence</td><td>Ongoing monitoring and risk assessment of customers</td></tr>
      <tr><td>PEP</td><td>Politically Exposed Person</td><td>Individual with prominent public function requiring enhanced due diligence</td></tr>
      <tr><td>STR</td><td>Suspicious Transaction Report</td><td>Report filed with the Financial Reporting Centre for suspect transactions</td></tr>
      <tr><td>POCAMLA</td><td>Proceeds of Crime and Anti-Money Laundering Act</td><td>Kenya's primary AML legislation</td></tr>
      <tr><td>NPS</td><td>National Payment System</td><td>Kenya's payment system regulated under the NPS Act 2011</td></tr>
      <tr><td>DCPR</td><td>Digital Credit Providers Regulations</td><td>2022 regulations governing digital lending in Kenya</td></tr>
      <tr><td>PCI-DSS</td><td>Payment Card Industry Data Security Standard</td><td>International standard for cardholder data security</td></tr>
      <tr><td>ISO 27001</td><td>ISO/IEC 27001</td><td>International standard for information security management systems</td></tr>
    </tbody>
  </table>
</div>`;

  const reportFooter = `
<div class="report-foot">
  CONFIDENTIAL &mdash; ${escapeHtml(displayName)} &mdash; Generated by SheriaBot on ${escapeHtml(formattedDate)} &mdash; Report ID: ${escapeHtml(analysisId)}
</div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gap Analysis Report &mdash; ${escapeHtml(documentName)}</title>
  <style>${css}</style>
</head>
<body>
<div class="wrap">
${coverHtml}
${execSummaryHtml}
${methodologyHtml}
${frameworksHtml}
${actionPlanHtml}
${appendixAHtml}
${appendixBHtml}
${appendixCHtml}
${reportFooter}
</div>
</body>
</html>`;
}
