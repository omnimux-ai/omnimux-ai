#!/usr/bin/env node
// Verifies that every commit recorded in versions.json still resolves.
//
// This is a coordination check, not a build. It answers one question: does the
// component set we published still exist at the commits we published?
//
// A private component that cannot be read without credentials is reported as
// skipped. Skipped is not passing; the process exits non-zero so a scheduled
// run cannot silently stop verifying.

import { readFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const run = promisify(execFile)
const VERSIONS = new URL('../versions.json', import.meta.url)

async function gh(args) {
  const { stdout } = await run('gh', args, { maxBuffer: 8 * 1024 * 1024 })
  return stdout.trim()
}

/** Resolve one component commit. Returns a result record; never throws. */
async function checkComponent(name, component) {
  const target = `${component.repo}@${component.commit}`
  try {
    const sha = await gh(['api', `repos/${component.repo}/commits/${component.commit}`, '--jq', '.sha'])
    if (sha !== component.commit) {
      return { name, target, state: 'fail', detail: `resolved ${sha}, expected ${component.commit}` }
    }
    return { name, target, state: 'pass', detail: component.version ?? '' }
  } catch (error) {
    const message = String(error.stderr || error.message || error)
    const unreadable = /HTTP 404|Not Found|Could not resolve to a Repository/i.test(message)
    if (unreadable && component.visibility === 'private') {
      return { name, target, state: 'skipped', detail: 'private repository not readable with current credentials' }
    }
    return { name, target, state: 'fail', detail: message.split('\n')[0] }
  }
}

/** Resolve every component in the lock file and summarize. */
async function main() {
  const lock = JSON.parse(await readFile(VERSIONS, 'utf8'))
  if (lock.schema !== 1) throw new Error(`unsupported schema ${lock.schema}`)

  const results = []
  for (const [name, component] of Object.entries(lock.components)) {
    results.push(await checkComponent(name, component))
  }

  for (const result of results) {
    const suffix = result.detail ? ` — ${result.detail}` : ''
    process.stdout.write(`${result.state.padEnd(8)} ${result.name.padEnd(8)} ${result.target}${suffix}\n`)
  }

  const failed = results.filter((r) => r.state === 'fail')
  const skipped = results.filter((r) => r.state === 'skipped')
  process.stdout.write(`\n${results.length} components: ${results.length - failed.length - skipped.length} pass, ${skipped.length} skipped, ${failed.length} fail\n`)

  if (failed.length > 0) process.exitCode = 1
  else if (skipped.length > 0) process.exitCode = 2
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})
