import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATES_DIR = join(ROOT, 'templates')
const SUPPORTED_SCHEMA_VERSION = 1

/** 모든 templates/<slug>/ 디렉토리 목록 */
function listTemplateSlugs() {
  return readdirSync(TEMPLATES_DIR).filter((name) => {
    const p = join(TEMPLATES_DIR, name)
    return statSync(p).isDirectory()
  })
}

function loadManifest(slug) {
  const raw = readFileSync(join(TEMPLATES_DIR, slug, 'template.json'), 'utf-8')
  return JSON.parse(raw)
}

function loadPersonaYaml(slug) {
  const raw = readFileSync(join(TEMPLATES_DIR, slug, 'persona.yaml'), 'utf-8')
  return parseYaml(raw)
}

const slugs = listTemplateSlugs()

describe('templates/ 디렉토리 — 최소 1개 이상', () => {
  it('적어도 하나의 템플릿이 있어야 한다', () => {
    assert.ok(slugs.length >= 1, '템플릿이 0개')
  })
})

for (const slug of slugs) {
  describe(`templates/${slug}`, () => {
    it('template.json 파싱 + 필수 필드', () => {
      const m = loadManifest(slug)
      assert.equal(m.slug, slug, 'slug == 디렉토리명')
      assert.equal(typeof m.schemaVersion, 'number')
      assert.ok(Number.isInteger(m.schemaVersion), 'schemaVersion integer')
      assert.ok(
        m.schemaVersion <= SUPPORTED_SCHEMA_VERSION,
        `schemaVersion ${m.schemaVersion} > supported ${SUPPORTED_SCHEMA_VERSION}`,
      )
      assert.equal(typeof m.role, 'string')
      assert.ok(m.role.length > 0, 'role 비어있지 않음')
      assert.equal(typeof m.role_en, 'string')
      assert.ok(m.role_en.length > 0, 'role_en 비어있지 않음')
      assert.ok(Array.isArray(m.duties), 'duties 배열')
      assert.ok(m.duties.length > 0, 'duties 1개 이상')
      for (const d of m.duties) {
        assert.equal(typeof d, 'string')
        assert.ok(d.length > 0, 'duty 키 비어있지 않음')
      }
      assert.equal(new Set(m.duties).size, m.duties.length, 'duties unique')
    })

    it('persona.yaml 파싱 + duties 키 == template.json#duties (1:1 매칭)', () => {
      const m = loadManifest(slug)
      const y = loadPersonaYaml(slug)
      assert.ok(y && typeof y === 'object', 'YAML이 object로 parse')
      assert.ok(y.duties && typeof y.duties === 'object', 'persona.yaml에 duties 블록')
      const yamlKeys = Object.keys(y.duties).sort()
      const manifestKeys = [...m.duties].sort()
      assert.deepEqual(yamlKeys, manifestKeys, 'manifest.duties와 yaml.duties 키 1:1')
    })

    it('persona.yaml에 role/role_en이 manifest와 일치', () => {
      const m = loadManifest(slug)
      const y = loadPersonaYaml(slug)
      assert.equal(y.role, m.role, 'role 동기')
      assert.equal(y.role_en, m.role_en, 'role_en 동기')
    })
  })
}
