// The CSV export file format (no browser needed).
import { test, expect } from '@playwright/test';
import { tripsToCsv } from '../app/(workspace)/export.js';

const trip = (over = {}) => ({ name: 'Lisbon Retreat', start: '2027-04-01', end: '2027-04-05', travellers: 20, currency: 'EUR', suppliers: [], ...over });
const rows = csv => csv.slice(1).split('\r\n').slice(0, -1); // drop the BOM and the final empty line

test('starts with a BOM and the import template’s column names', () => {
  const csv = tripsToCsv([trip()]);
  expect(csv[0]).toBe('﻿');
  expect(rows(csv)[0]).toBe('Trip,Trip start,Trip end,Travellers,Currency,Supplier name,Category,Location,Confirmation,Contact,Deposit amount,Deposit due date,Deposit paid,Final balance amount,Final balance due date,Final balance paid,Notes');
});

test('one row per supplier; a trip with no suppliers still gets a row', () => {
  const csv = tripsToCsv([
    trip({ suppliers: [
      { name: 'Hotel A', category: 'Hotel', place: 'Lisbon', status: 'Confirmed', contact: 'a@x.test', deposit: { amount: 1000, due: '2027-02-01', paid: true }, balance: { amount: 2500.5, due: '2027-03-01', paid: false }, notes: '' },
      { name: 'Coach B', status: 'Pending', notes: '' },
    ] }),
    trip({ name: 'Empty Trip' }),
  ]);
  const r = rows(csv);
  expect(r).toHaveLength(4);
  expect(r[1]).toBe('Lisbon Retreat,2027-04-01,2027-04-05,20,EUR,Hotel A,Hotel,Lisbon,Confirmed,a@x.test,1000,2027-02-01,Yes,2500.5,2027-03-01,No,');
  expect(r[2]).toBe('Lisbon Retreat,2027-04-01,2027-04-05,20,EUR,Coach B,,,Pending,,,,,,,,');
  expect(r[3]).toBe('Empty Trip,2027-04-01,2027-04-05,20,EUR,,,,,,,,,,,,');
});

test('commas, quotes and line breaks stay inside their cell', () => {
  const csv = tripsToCsv([trip({ suppliers: [{ name: 'Hotel "Sol", Porto', notes: 'Line one\nLine two' }] })]);
  expect(csv).toContain('"Hotel ""Sol"", Porto"');
  expect(csv).toContain('"Line one\nLine two"');
});

test('formula-looking text is neutralised (CSV injection protection)', () => {
  const csv = tripsToCsv([trip({ suppliers: [{ name: '=HYPERLINK("http://evil.test")', notes: '+44 20 1234', contact: '@handle' }] })]);
  expect(csv).toContain(`"'=HYPERLINK(""http://evil.test"")"`);
  expect(csv).toContain(",'@handle,");
  expect(csv).toContain(",'+44 20 1234");
  expect(csv).not.toMatch(/,=|,\+|,@/);
});
