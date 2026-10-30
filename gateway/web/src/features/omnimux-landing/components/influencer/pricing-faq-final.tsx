/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { fetchPricing } from '@/features/influencer/api'
import { imageModels, quoteCredits } from '@/features/influencer/lib/catalog'
import {
  PLAN_TIER_IDS,
  planTierName,
} from '@/features/subscriptions/lib/plan-tier'
import { toIntlLocale } from '@/i18n/languages'
import { useAuthStore } from '@/stores/auth-store'

import { WORK_LOOKS } from '../../lib/influencer-looks'
import { Reveal } from '../reveal'

/** Live lowest per-image price across image models, or null when the price list is unavailable. */
function useBestPrice(): {
  credits: number
  usd: number
  modelCount: number
} | null {
  const pricingQ = useQuery({
    queryKey: ['influencer', 'pricing'],
    queryFn: fetchPricing,
  })
  return useMemo(() => {
    const rows = imageModels(pricingQ.data)
    const groupRatio = pricingQ.data?.group_ratio
    let best: number | null = null
    for (const row of rows) {
      const q = quoteCredits(row, undefined, groupRatio)
      if (q && (best === null || q.usd < best)) best = q.usd
    }
    if (best === null) return null
    return { credits: best * 10, usd: best, modelCount: rows.length }
  }, [pricingQ.data])
}

/**
 * The three plans sold on the price page, mirroring the live subscription
 * plans. The list itself comes from the wallet's shared tier module so both
 * surfaces name the same tiers.
 */
const PLAN_TIERS = PLAN_TIER_IDS

/** Generation credits each plan grants, matching the live subscription plans. */
const CREDITS: Record<string, number> = { discovery: 40, starter: 160, creator: 450 }

/**
 * Subscription pricing: one-time trial plus two monthly plans, with the annual
 * toggle showing the discounted month and the amount billed once a year.
 */
export function InfluencerPricing() {
  const { t, i18n } = useTranslation()
  const locale = toIntlLocale(i18n.resolvedLanguage || i18n.language)
  const [annual, setAnnual] = useState(false)
  const price = useBestPrice()

  const usd = (value: number) =>
    Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value)

  const annualPrices: Record<string, number> = {
    starter: 19.92,
    creator: 47.17,
  }
  const annualBilled: Record<string, number> = { starter: 239, creator: 566 }
  const monthlyPrices: Record<string, number> = { starter: 24.99, creator: 59 }

  /**
   * Literal keys per tier: the i18n extractor only registers t('…') literals.
   * The tier *name* is not here — it comes from the wallet's shared
   * plan-tier module (planTierName) so both surfaces show the same name.
   */
  const copy = {
    discovery: {
      cta: t('influencer_landing.pricing.plan.discovery.cta'),
      note: t('influencer_landing.pricing.plan.discovery.note'),
    },
    starter: {
      cta: t('influencer_landing.pricing.plan.starter.cta'),
    },
    creator: {
      cta: t('influencer_landing.pricing.plan.creator.cta'),
    },
  }

  /** Per-tier call discount while the subscription is active: 10% off is 9 折. */
  const DISCOUNTS: Record<string, string> = {
    starter: t('influencer_landing.pricing.plan.starter.discount'),
    creator: t('influencer_landing.pricing.plan.creator.discount'),
  }

  /** Annual view shows the discounted month; otherwise the plain monthly price. */
  function shownPrice(tier: string): number {
    if (annual && annualPrices[tier]) return annualPrices[tier]
    return monthlyPrices[tier] ?? 0
  }

  const { auth } = useAuthStore()
  const isAuthenticated = !!auth.user

  /** The line under the price: trial copy, annual total, or the monthly note. */
  function billingNote(tier: string): string {
    if (tier === 'discovery') {
      return copy.discovery.note
    }
    if (annual) {
      return t('influencer_landing.pricing.billedAnnually', {
        amount: usd(annualBilled[tier]),
      })
    }
    return t('influencer_landing.pricing.billedMonthly')
  }

  /**
   * Destination logic based on user authentication state:
   * - discovery: direct to workbench if signed-in, or sign-in with return URL
   * - subscription tiers: direct to wallet subscription checkout if signed-in,
   *   or sign-in with preserved checkout intent
   */
  function planDestination(tier: string): string {
    const period = annual ? 'annual' : 'monthly'
    if (tier === 'discovery') {
      return isAuthenticated
        ? '/influencer'
        : `/sign-in?redirect=${encodeURIComponent('/influencer')}`
    }
    const target = `/wallet?plan=${tier}&period=${period}`
    return isAuthenticated
      ? target
      : `/sign-in?redirect=${encodeURIComponent(target)}`
  }

  const payPerCallDestination = isAuthenticated
    ? '/influencer'
    : `/sign-in?redirect=${encodeURIComponent('/influencer')}`

  return (
    <section className='inf-pricing' id='pricing'>
      <div className='inf-section inf-pricing'>
        <Reveal>
          <p className='inf-eyebrow'>
            {t('influencer_landing.pricing.eyebrow')}
          </p>
          <h2 className='inf-h2'>{t('influencer_landing.pricing.title')}</h2>
          <p className='inf-sub'>{t('influencer_landing.pricing.sub')}</p>
        </Reveal>

        <Reveal className='inf-plan-toggle' delay={80}>
          <button
            type='button'
            className='inf-plan-switch'
            aria-pressed={!annual}
            onClick={() => setAnnual(false)}
          >
            {t('influencer_landing.pricing.monthly')}
          </button>
          <button
            type='button'
            className='inf-plan-switch'
            aria-pressed={annual}
            onClick={() => setAnnual(true)}
          >
            {t('influencer_landing.pricing.annual')}
            <span className='inf-plan-save'>
              {t('influencer_landing.pricing.save')}
            </span>
          </button>
        </Reveal>

        <div className='inf-plan-grid'>
          {PLAN_TIERS.map((tier, index) => {
            const isTrial = tier === 'discovery'
            const isPopular = tier === 'starter'
            const credits = CREDITS[tier]
            const priceText = isTrial ? usd(9.99) : usd(shownPrice(tier))
            const unitText = isTrial
              ? t('influencer_landing.pricing.once')
              : t('influencer_landing.pricing.perMonth')
            return (
              <Reveal
                key={tier}
                className={
                  isPopular ? 'inf-plan-card is-popular' : 'inf-plan-card'
                }
                delay={120 + index * 60}
              >
                {isPopular ? (
                  <span className='inf-plan-tag'>
                    {t('influencer_landing.pricing.popular')}
                  </span>
                ) : null}
                <h3 className='inf-plan-name'>{planTierName(tier, t)}</h3>
                <p className='inf-plan-price'>
                  <span className='inf-plan-amount'>{priceText}</span>
                  <span className='inf-plan-unit'>{unitText}</span>
                </p>
                <p className='inf-plan-billed'>{billingNote(tier)}</p>
                <p className='inf-plan-credits'>
                  <span className='inf-plan-credits-num'>{credits}</span>
                  <span className='inf-plan-credits-label'>
                    {t('influencer_landing.pricing.credits')}
                  </span>
                </p>
                {DISCOUNTS[tier] ? (
                  <p className='inf-plan-discount'>{DISCOUNTS[tier]}</p>
                ) : null}
                <ul className='inf-price-feats'>
                  <li>
                    <span className='inf-check' aria-hidden='true'>
                      ✓
                    </span>
                    {t('influencer_landing.pricing.feature.video')}
                  </li>
                  <li>
                    <span className='inf-check' aria-hidden='true'>
                      ✓
                    </span>
                    {t('influencer_landing.pricing.feature.character')}
                  </li>
                  <li>
                    <span className='inf-check' aria-hidden='true'>
                      ✓
                    </span>
                    {t('influencer_landing.pricing.feature.refund')}
                  </li>
                  <li>
                    <span className='inf-check' aria-hidden='true'>
                      ✓
                    </span>
                    {isTrial
                      ? t('influencer_landing.pricing.feature.noSubscription')
                      : t('influencer_landing.pricing.feature.cancel')}
                  </li>
                </ul>
                <Link to={planDestination(tier)} className='omx-btn-primary'>
                  {copy[tier].cta}
                </Link>
              </Reveal>
            )
          })}
        </div>

        <Reveal delay={300}>
          <p className='inf-price-note'>
            <Link to={payPerCallDestination} className='inf-price-note-link'>
              {price
                ? t('influencer_landing.pricing.payPerCall', {
                    usd: usd(price.usd),
                  })
                : t('influencer_landing.pricing.note')}
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

const FAQ_ITEMS = [
  { id: 'q1' },
  { id: 'q2' },
  { id: 'q3' },
  {
    id: 'q4',
    guide: {
      href: '/guides/create-ai-character',
      labelKey: 'Read the character guide',
    },
  },
  {
    id: 'q5',
    guide: {
      href: '/guides/recreate-video-with-your-character',
      labelKey: 'Read the reference video guide',
    },
  },
] as const

/** Five Q&As, every answer describing a shipped behaviour. */
export function InfluencerFaq() {
  const { t } = useTranslation()
  return (
    <section className='inf-faq'>
      <div className='inf-section'>
        <Reveal>
          <p className='inf-eyebrow'>{t('influencer_landing.faq.eyebrow')}</p>
          <h2 className='inf-h2'>{t('influencer_landing.faq.title')}</h2>
        </Reveal>
        <Reveal className='inf-faq-list' delay={80}>
          <Accordion>
            {FAQ_ITEMS.map((item) => (
              <AccordionItem key={item.id} value={item.id} className='inf-faq-item'>
                <AccordionTrigger className='inf-faq-q'>
                  {t(`influencer_landing.faq.${item.id}`)}
                </AccordionTrigger>
                <AccordionContent className='inf-faq-a'>
                  <p>{t(`influencer_landing.faq.${item.id.replace('q', 'a')}`)}</p>
                  {'guide' in item ? (
                    <a href={item.guide.href} className='inf-guide-link'>
                      {t(item.guide.labelKey)} <span aria-hidden='true'>↗</span>
                    </a>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}

/** Dark final CTA with three fanned, floating character cards. */
export function InfluencerFinalCta() {
  const { t } = useTranslation()
  const looks = WORK_LOOKS.slice(0, 3)
  return (
    <section className='inf-final'>
      <div className='inf-section'>
        <Reveal className='inf-final-card'>
          <div>
            <h2 className='inf-final-title'>
              {t('influencer_landing.final.titleLead')}
              <span className='inf-h2-accent'>
                {t('influencer_landing.final.titleAccent')}
              </span>
            </h2>
            <p className='inf-final-sub'>{t('influencer_landing.final.sub')}</p>
            <div className='inf-final-ctas'>
              <Link to='/influencer' className='omx-btn-primary'>
                {t('influencer_landing.final.cta')}
              </Link>
            </div>
          </div>
          <div className='inf-final-looks' aria-hidden='true'>
            {looks.map((look) => (
              <img
                key={look.key}
                className='inf-final-look'
                src={look.image}
                alt=''
                loading='lazy'
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
