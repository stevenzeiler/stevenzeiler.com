'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  RIPPLE_ACQUISITIONS,
  RIPPLE_CURRENT_PRICE_USD,
  RIPPLE_HOLDINGS_AFTER_EACH_SALE,
  RIPPLE_IMPLIED_OPENING_SHARES,
  RIPPLE_PRICE_HISTORY,
  RIPPLE_REMAINING_SHARES,
  RIPPLE_SALES,
  RIPPLE_SOLD_SHARES_TOTAL,
} from '@/data/ripple-labs-portfolio';
import { computeRipplePortfolio } from '@/lib/finance/ripple-labs/compute';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const usd2 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatShares(n: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n);
}

export default function RipplePortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user || user.email !== 'me@stevenzeiler.com') {
        router.push('/');
        return;
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [router, supabase]);

  const computed = useMemo(
    () =>
      computeRipplePortfolio(
        RIPPLE_ACQUISITIONS,
        RIPPLE_SALES,
        RIPPLE_PRICE_HISTORY,
        RIPPLE_CURRENT_PRICE_USD
      ),
    []
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 flex items-center justify-center">
        <div
          className="w-12 h-12 border-2 border-forest-700 border-t-leaf-500 rounded-full animate-spin"
          aria-hidden
        />
      </div>
    );
  }

  const chartShares = computed.sharesTimeline.map((p) => ({
    ...p,
    label: new Date(p.date + 'T12:00:00Z').toLocaleDateString(undefined, {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    }),
  }));

  const chartValue = computed.valueTimeline.map((p) => ({
    ...p,
    label: new Date(p.date + 'T12:00:00Z').toLocaleDateString(undefined, {
      month: 'short',
      year: 'numeric',
      day: 'numeric',
    }),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-950 to-earth-950 text-earth-50 py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-earth-200 hover:text-leaf-400 transition-colors text-sm mb-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mr-1.5"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <h1 className="text-2xl font-bold text-earth-100">Ripple Labs equity</h1>
          <p className="text-earth-400 text-sm mt-0.5">
            FIFO cost basis, realized gains on sales, and mark-to-market unrealized on
            what you still hold. Data lives in{' '}
            <code className="text-leaf-400/90 text-xs bg-forest-900/80 px-1.5 py-0.5 rounded">
              data/ripple-labs-portfolio.ts
            </code>
            .
          </p>
        </div>

        {computed.error && (
          <div
            className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-red-200 text-sm"
            role="alert"
          >
            {computed.error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4">
            <p className="text-earth-500 text-xs uppercase tracking-wide">Remaining shares</p>
            <p className="text-xl font-semibold text-earth-100 mt-1">
              {formatShares(computed.remainingShares)}
            </p>
          </div>
          <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4">
            <p className="text-earth-500 text-xs uppercase tracking-wide">
              Remaining cost basis (FIFO)
            </p>
            <p className="text-xl font-semibold text-earth-100 mt-1">
              {usd2.format(computed.remainingCostBasisUsd)}
            </p>
          </div>
          <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4">
            <p className="text-earth-500 text-xs uppercase tracking-wide">Current price / share</p>
            <p className="text-xl font-semibold text-earth-100 mt-1">
              {computed.currentPriceUsd > 0 ? usd2.format(computed.currentPriceUsd) : '—'}
            </p>
          </div>
          <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4">
            <p className="text-earth-500 text-xs uppercase tracking-wide">Market value (held)</p>
            <p className="text-xl font-semibold text-earth-100 mt-1">
              {computed.remainingShares > 0 && computed.currentPriceUsd > 0
                ? usd.format(computed.marketValueUsd)
                : '—'}
            </p>
          </div>
          <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4">
            <p className="text-earth-500 text-xs uppercase tracking-wide">Unrealized gain (live)</p>
            <p
              className={`text-xl font-semibold mt-1 ${
                computed.unrealizedGainUsd >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {computed.remainingShares > 0 && computed.currentPriceUsd > 0
                ? usd.format(computed.unrealizedGainUsd)
                : '—'}
            </p>
          </div>
          <div className="bg-forest-900/80 border border-forest-800 rounded-xl p-4">
            <p className="text-earth-500 text-xs uppercase tracking-wide">Realized (all years)</p>
            <p className="text-xl font-semibold text-earth-100 mt-1">
              {usd.format(
                computed.saleAllocations.reduce((s, x) => s + x.realizedGainUsd, 0)
              )}
            </p>
          </div>
        </section>

        <section className="bg-forest-900/80 border border-forest-800 rounded-xl overflow-hidden">
          <h2 className="text-lg font-bold text-earth-100 px-4 py-3 border-b border-forest-800">
            Holdings after each sale
          </h2>
          <p className="px-4 py-2 text-earth-500 text-xs border-b border-forest-800">
            Opening position is{' '}
            <span className="text-earth-300 tabular-nums">
              {formatShares(RIPPLE_IMPLIED_OPENING_SHARES)}
            </span>{' '}
            shares (sum of all sales{' '}
            <span className="text-earth-300 tabular-nums">
              {formatShares(RIPPLE_SOLD_SHARES_TOTAL)}
            </span>{' '}
            + current remaining{' '}
            <span className="text-earth-300 tabular-nums">
              {formatShares(RIPPLE_REMAINING_SHARES)}
            </span>
            ). Each row is after that sale settles (FIFO on one notional lot).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-earth-500 border-b border-forest-800">
                  <th className="px-4 py-2 font-medium">Sale</th>
                  <th className="px-4 py-2 font-medium">Settlement</th>
                  <th className="px-4 py-2 font-medium text-right">Shares sold</th>
                  <th className="px-4 py-2 font-medium text-right">Held after</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-800">
                {RIPPLE_HOLDINGS_AFTER_EACH_SALE.map((row) => (
                  <tr key={row.saleId} className="hover:bg-forest-800/40">
                    <td className="px-4 py-2.5 text-earth-200 font-mono text-xs">{row.saleId}</td>
                    <td className="px-4 py-2.5 text-earth-300 whitespace-nowrap">
                      {new Date(row.settlementDate + 'T12:00:00Z').toLocaleDateString(undefined, {
                        dateStyle: 'medium',
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">
                      {formatShares(row.sharesSold)}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums font-medium text-earth-100">
                      {formatShares(row.sharesHeldAfter)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {chartShares.length > 0 && (
          <section className="bg-forest-900/80 border border-forest-800 rounded-xl p-5">
            <h2 className="text-lg font-bold text-earth-100 mb-4">Shares held over time</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartShares} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 77, 61, 0.8)" />
                  <XAxis dataKey="label" stroke="#9ca89e" tick={{ fontSize: 11 }} />
                  <YAxis
                    stroke="#9ca89e"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => formatShares(Number(v))}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a2e1f',
                      border: '1px solid #334d3d',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [
                      formatShares(Number(value ?? 0)),
                      'Shares',
                    ]}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="sharesHeld"
                    stroke="#65a30d"
                    strokeWidth={2}
                    dot={{ fill: '#65a30d', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {chartValue.length > 0 &&
          chartValue.some((p) => p.marketValueUsd > 0) &&
          computed.currentPriceUsd > 0 && (
            <section className="bg-forest-900/80 border border-forest-800 rounded-xl p-5">
              <h2 className="text-lg font-bold text-earth-100 mb-1">Position value over time</h2>
              <p className="text-earth-500 text-xs mb-4">
                Shares held × price: forward-filled from your snapshot history after the first
                mark; before any snapshot, FIFO average cost per share from your grant rows—not
                the latest sale or last mark.
              </p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartValue} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(51, 77, 61, 0.8)" />
                    <XAxis dataKey="label" stroke="#9ca89e" tick={{ fontSize: 11 }} />
                    <YAxis
                      stroke="#9ca89e"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => usd.format(Number(v))}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1a2e1f',
                        border: '1px solid #334d3d',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => [usd.format(Number(value ?? 0)), 'Value']}
                    />
                    <Area
                      type="stepAfter"
                      dataKey="marketValueUsd"
                      stroke="#4ade80"
                      fill="rgba(74, 222, 128, 0.15)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

        {computed.saleAllocations.length > 0 && (
          <section className="bg-forest-900/80 border border-forest-800 rounded-xl overflow-hidden">
            <h2 className="text-lg font-bold text-earth-100 px-4 py-3 border-b border-forest-800">
              Stock sales
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-earth-500 border-b border-forest-800">
                    <th className="px-4 py-2 font-medium">Date</th>
                    <th className="px-4 py-2 font-medium text-right">Shares</th>
                    <th className="px-4 py-2 font-medium text-right">Price / sh</th>
                    <th className="px-4 py-2 font-medium text-right">Proceeds</th>
                    <th className="px-4 py-2 font-medium text-right">Cost basis</th>
                    <th className="px-4 py-2 font-medium text-right">Realized gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-800">
                  {computed.saleAllocations.map((s) => (
                    <tr key={s.saleId} className="hover:bg-forest-800/40">
                      <td className="px-4 py-2.5 text-earth-200 whitespace-nowrap">
                        {new Date(s.saleDate + 'T12:00:00Z').toLocaleDateString(undefined, {
                          dateStyle: 'medium',
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {formatShares(s.sharesSold)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {usd2.format(s.pricePerShareUsd)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {usd.format(s.proceedsUsd)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-earth-400">
                        {usd.format(s.costBasisUsd)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right tabular-nums font-medium ${
                          s.realizedGainUsd >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {usd.format(s.realizedGainUsd)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {computed.yearBreakdowns.length > 0 && (
          <section className="bg-forest-900/80 border border-forest-800 rounded-xl overflow-hidden">
            <h2 className="text-lg font-bold text-earth-100 px-4 py-3 border-b border-forest-800">
              Realized &amp; unrealized by year
            </h2>
            <p className="px-4 py-2 text-earth-500 text-xs border-b border-forest-800">
              Realized sums gains on sales in that calendar year (FIFO). Unrealized (EOY) uses
              shares still held on Dec 31 and the latest price snapshot on or before that date—add
              dated marks in{' '}
              <code className="text-leaf-400/90">RIPPLE_PRICE_HISTORY</code> for each year you care
              about.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-earth-500 border-b border-forest-800">
                    <th className="px-4 py-2 font-medium">Year</th>
                    <th className="px-4 py-2 font-medium text-right">Realized gain</th>
                    <th className="px-4 py-2 font-medium text-right">Unrealized (EOY)</th>
                    <th className="px-4 py-2 font-medium text-right">Shares (EOY)</th>
                    <th className="px-4 py-2 font-medium text-right">EOY mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-800">
                  {computed.yearBreakdowns.map((row) => (
                    <tr key={row.year} className="hover:bg-forest-800/40">
                      <td className="px-4 py-2.5 text-earth-200">{row.year}</td>
                      <td
                        className={`px-4 py-2.5 text-right tabular-nums ${
                          row.realizedGainUsd >= 0 ? 'text-earth-100' : 'text-red-400'
                        }`}
                      >
                        {usd.format(row.realizedGainUsd)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right tabular-nums ${
                          row.unrealizedGainEoyUsd == null
                            ? 'text-earth-500'
                            : row.unrealizedGainEoyUsd >= 0
                              ? 'text-emerald-400'
                              : 'text-red-400'
                        }`}
                      >
                        {row.unrealizedGainEoyUsd == null
                          ? '—'
                          : row.sharesHeldEoy === 0
                            ? '—'
                            : usd.format(row.unrealizedGainEoyUsd)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-earth-300">
                        {formatShares(row.sharesHeldEoy)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-earth-400">
                        {row.eoyMarkUsd != null ? usd2.format(row.eoyMarkUsd) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {RIPPLE_ACQUISITIONS.length === 0 && RIPPLE_SALES.length === 0 && (
          <p className="text-earth-500 text-center py-6 text-sm">
            Add acquisitions and sales in{' '}
            <code className="text-leaf-400/90">data/ripple-labs-portfolio.ts</code> to populate this
            page.
          </p>
        )}
      </div>
    </div>
  );
}
