import assert from 'node:assert/strict'
import test from 'node:test'
import {
  DEFAULT_UPSTREAM,
  normalizeUpstream,
  renderUpstreamConfig,
  upstreamWithPercent,
  validateUpstreamServer,
  validateUpstreamWeight
} from '../core.mjs'

test('upstream server validation accepts host:port and rejects junk', () => {
  assert.equal(validateUpstreamServer('127.0.0.1:7777'), '127.0.0.1:7777')
  assert.equal(validateUpstreamServer('Api.Example.COM:8080'), 'api.example.com:8080')
  assert.throws(() => validateUpstreamServer('http://1.2.3.4:7777'), /host:port/)
  assert.throws(() => validateUpstreamServer('1.2.3.4'), /host:port/)
  assert.throws(() => validateUpstreamServer('1.2.3.4:0'), /端口/)
  assert.throws(() => validateUpstreamServer('-bad:7777'), /host:port/)
})

test('upstream weight bounds', () => {
  assert.equal(validateUpstreamWeight(90), 90)
  assert.throws(() => validateUpstreamWeight(0), /权重/)
  assert.throws(() => validateUpstreamWeight(1001), /权重/)
  assert.throws(() => validateUpstreamWeight('a'), /权重/)
})

test('upstream normalization dedupes and enforces node limits', () => {
  const state = normalizeUpstream({ nodes: [{ server: '1.2.3.4:7777', weight: 9 }, { server: '5.6.7.8:7777', weight: 1 }] })
  assert.equal(state.name, 'new_api')
  assert.equal(state.maxFails, DEFAULT_UPSTREAM.maxFails)
  assert.throws(() => normalizeUpstream({ nodes: [] }), /至少保留一个节点/)
  assert.throws(() => normalizeUpstream({
    nodes: [{ server: '1.2.3.4:7777', weight: 1 }, { server: '1.2.3.4:7777', weight: 2 }]
  }), /节点重复/)
  assert.throws(() => normalizeUpstream({
    nodes: Array.from({ length: 9 }, (_, i) => ({ server: `10.0.0.${i}:7777`, weight: 1 }))
  }), /不能超过 8 个/)
  assert.throws(() => normalizeUpstream({ nodes: [{ server: '1.2.3.4:7777', weight: 9 }], maxFails: 0 }), /max_fails/)
  assert.throws(() => normalizeUpstream({ nodes: [{ server: '1.2.3.4:7777', weight: 9 }], failTimeout: 4 }), /fail_timeout/)
})

test('rendered upstream config is deterministic and constrained', () => {
  const config = renderUpstreamConfig(normalizeUpstream(DEFAULT_UPSTREAM))
  assert.match(config, /upstream new_api \{/)
  assert.match(config, /server 127\.0\.0\.1:7777 weight=90 max_fails=2 fail_timeout=15s;/)
  assert.match(config, /server 47\.251\.94\.131:7777 weight=20 max_fails=2 fail_timeout=15s;/)
  assert.doesNotMatch(config, /http:\/\//)
})

test('percent view sums to 100', () => {
  const view = upstreamWithPercent(normalizeUpstream(DEFAULT_UPSTREAM))
  const total = view.nodes.reduce((sum, node) => sum + node.percent, 0)
  assert.equal(total, 100)
  assert.deepEqual(view.nodes.map((node) => node.percent), [81.8, 18.2])
})
