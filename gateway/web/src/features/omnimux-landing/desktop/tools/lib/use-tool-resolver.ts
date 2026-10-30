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
import { useCallback, useEffect, useRef, useState } from 'react'

import type { ToolKind } from '../content'
import {
  getToolConfig,
  resolveToolLink,
  ToolRequestError,
  verifyToolTurnstile,
  type ToolConfig,
  type ToolQuota,
  type ToolResult,
} from './api'

/** Failure codes the page maps to copy; anything else is `generic`. */
export type ToolFailure =
  | 'invalid_link'
  | 'wrong_kind_photo'
  | 'wrong_kind_video'
  | 'unavailable'
  | 'quota_exceeded'
  | 'busy'
  | 'rate_limited'
  | 'turnstile_failed'
  | 'turnstile_unavailable'
  | 'generic'

const KNOWN_FAILURES: readonly ToolFailure[] = [
  'invalid_link',
  'wrong_kind_photo',
  'wrong_kind_video',
  'unavailable',
  'quota_exceeded',
  'busy',
  'rate_limited',
  'turnstile_failed',
  'turnstile_unavailable',
]

export function toolFailureOf(error: unknown): ToolFailure {
  if (!(error instanceof ToolRequestError)) return 'generic'
  const known = KNOWN_FAILURES.find((code) => code === error.code)
  if (known) return known
  if (error.status === 429) return 'rate_limited'
  return 'generic'
}

export type ToolPhase = 'idle' | 'verifying' | 'parsing'

type Pending = { url: string; kind: ToolKind }

/**
 * Parse flow of one tool page: config on mount, resolve, and the Turnstile
 * detour (`verification_required` → token → verify → retry resolve once).
 */
export function useToolResolver(options: {
  onFailure: (failure: ToolFailure) => void
}) {
  const [config, setConfig] = useState<ToolConfig | null>(null)
  const [quota, setQuota] = useState<ToolQuota | null>(null)
  const [result, setResult] = useState<ToolResult | null>(null)
  const [phase, setPhase] = useState<ToolPhase>('idle')
  /** Bumped to re-mount the Turnstile widget, which has no reset API. */
  const [challenge, setChallenge] = useState(0)
  const [challengeOpen, setChallengeOpen] = useState(false)
  const pending = useRef<Pending | null>(null)
  const onFailure = useRef(options.onFailure)

  useEffect(() => {
    onFailure.current = options.onFailure
  }, [options.onFailure])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const next = await getToolConfig()
        if (cancelled) return
        setConfig(next)
        setQuota(next.quota)
      } catch {
        /* The page stays usable; resolve reports its own failures. */
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const fail = useCallback((failure: ToolFailure) => {
    setPhase('idle')
    if (failure === 'quota_exceeded') {
      setQuota((current) =>
        current ? { used: current.limit, limit: current.limit } : current
      )
    }
    onFailure.current(failure)
  }, [])

  const openChallenge = useCallback(
    (next: Pending) => {
      if (!config?.turnstile_site_key) {
        pending.current = null
        fail('turnstile_unavailable')
        return
      }
      pending.current = next
      setPhase('verifying')
      setChallengeOpen(true)
      setChallenge((value) => value + 1)
    },
    [config?.turnstile_site_key, fail]
  )

  const runResolve = useCallback(
    async (next: Pending, retried: boolean) => {
      setPhase('parsing')
      try {
        const data = await resolveToolLink(next.url, next.kind)
        setResult(data)
        setQuota(data.quota)
        setPhase('idle')
      } catch (error) {
        const code = error instanceof ToolRequestError ? error.code : ''
        if (code === 'verification_required' && !retried) {
          openChallenge(next)
          return
        }
        fail(
          code === 'verification_required'
            ? 'turnstile_failed'
            : toolFailureOf(error)
        )
      }
    },
    [fail, openChallenge]
  )

  const submit = useCallback(
    (url: string, kind: ToolKind) => {
      const next = { url, kind }
      setResult(null)
      if (config && !config.pass_valid) {
        openChallenge(next)
        return
      }
      void runResolve(next, false)
    },
    [config, openChallenge, runResolve]
  )

  const onToken = useCallback(
    async (token: string) => {
      const next = pending.current
      if (!next) return
      try {
        await verifyToolTurnstile(token)
      } catch (error) {
        // Close the challenge instead of re-rendering it: a re-rendered
        // widget issues a new token on its own, so a server that keeps
        // rejecting would be called in a loop. Retrying is one click.
        const failure = toolFailureOf(error)
        pending.current = null
        setChallengeOpen(false)
        fail(failure === 'turnstile_unavailable' ? failure : 'turnstile_failed')
        return
      }
      pending.current = null
      setChallengeOpen(false)
      setConfig((current) =>
        current ? { ...current, pass_valid: true } : current
      )
      await runResolve(next, true)
    },
    [fail, runResolve]
  )

  const onTokenExpire = useCallback(() => {
    if (!pending.current) return
    setChallenge((value) => value + 1)
  }, [])

  return {
    config,
    quota,
    result,
    phase,
    challenge,
    challengeOpen,
    submit,
    onToken,
    onTokenExpire,
  }
}
