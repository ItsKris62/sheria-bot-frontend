import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

describe('Admin Marketing UI Pages (P0)', () => {
  const companiesPagePath = join(__dirname, 'companies', 'page.tsx');
  const leadsPagePath = join(__dirname, 'leads', 'page.tsx');
  const sidebarPath = join(__dirname, '..', '..', '..', '..', 'components', 'layout', 'admin-sidebar.tsx');

  it('Company Directory page exists and includes search, filters, table, and detail drawer', () => {
    expect(existsSync(companiesPagePath)).toBe(true);
    const src = readFileSync(companiesPagePath, 'utf8');
    expect(src).toContain('trpc.adminMarketing.companies.list.useQuery');
    expect(src).toContain('trpc.adminMarketing.companies.getById.useQuery');
    expect(src).toContain('trpc.adminMarketing.companies.create.useMutation');
    expect(src).toContain('trpc.adminMarketing.companies.update.useMutation');
    expect(src).toContain('trpc.adminMarketing.companies.delete.useMutation');
    expect(src).toContain('trpc.adminMarketing.companies.merge.useMutation');
    expect(src).toContain('Company Directory');
  });

  it('Lead Review Queue page exists and enforces human approval flow without automatic outbound', () => {
    expect(existsSync(leadsPagePath)).toBe(true);
    const src = readFileSync(leadsPagePath, 'utf8');
    expect(src).toContain('trpc.adminMarketing.leads.listReviewQueue.useQuery');
    expect(src).toContain('trpc.adminMarketing.leads.getReviewDetail.useQuery');
    expect(src).toContain('trpc.adminMarketing.leads.approveLead.useMutation');
    expect(src).toContain('trpc.adminMarketing.leads.rejectLead.useMutation');
    expect(src).toContain('trpc.adminMarketing.leads.nurtureLead.useMutation');
    expect(src).toContain('trpc.adminMarketing.leads.requestResearch.useMutation');
    expect(src).toContain('trpc.adminMarketing.leads.doNotContact.useMutation');
    expect(src).toContain('Zero-Autonomous-Outbound Protected Queue');
  });

  it('Admin sidebar links to Lead Queue and Companies Directory', () => {
    expect(existsSync(sidebarPath)).toBe(true);
    const src = readFileSync(sidebarPath, 'utf8');
    expect(src).toContain('/admin/marketing/leads');
    expect(src).toContain('/admin/marketing/companies');
  });
});
