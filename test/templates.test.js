import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse as parseYaml } from 'yaml'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TEMPLATES_DIR = join(ROOT, 'templates')
const SUPPORTED_SCHEMA_VERSION = 2

/** persona.<lang>.yaml 파일명 → lang 추출 (없으면 null) */
const PERSONA_FILE_RE = /^persona\.([a-z]{2})\.yaml$/

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

/** templates/<slug>/ 안의 persona.<lang>.yaml 파일에서 lang 목록 추출 */
function listPersonaLangs(slug) {
  return readdirSync(join(TEMPLATES_DIR, slug))
    .map((name) => {
      const m = PERSONA_FILE_RE.exec(name)
      return m ? m[1] : null
    })
    .filter((x) => x !== null)
    .sort()
}

function loadPersonaYaml(slug, lang) {
  const raw = readFileSync(join(TEMPLATES_DIR, slug, `persona.${lang}.yaml`), 'utf-8')
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

    it('languages 필드 (schemaVersion 2) + persona 파일과 1:1', () => {
      const m = loadManifest(slug)
      assert.ok(Array.isArray(m.languages), 'manifest.languages 배열')
      assert.ok(m.languages.length > 0, 'languages 1개 이상')
      assert.ok(m.languages.includes('ko'), "기본 언어 'ko' 포함 (loader fallback 기준)")
      assert.equal(new Set(m.languages).size, m.languages.length, 'languages unique')

      // 디스크의 persona.<lang>.yaml 집합 == manifest.languages 집합
      const fileLangs = listPersonaLangs(slug)
      assert.deepEqual(
        fileLangs,
        [...m.languages].sort(),
        'persona.<lang>.yaml 파일 집합 == manifest.languages',
      )
    })

    it('각 언어 persona.<lang>.yaml — parse + duties 키 1:1 + role/role_en 일치', () => {
      const m = loadManifest(slug)
      const manifestKeys = [...m.duties].sort()
      for (const lang of m.languages) {
        const y = loadPersonaYaml(slug, lang)
        assert.ok(y && typeof y === 'object', `[${lang}] YAML이 object로 parse`)
        assert.ok(y.duties && typeof y.duties === 'object', `[${lang}] persona에 duties 블록`)
        assert.deepEqual(
          Object.keys(y.duties).sort(),
          manifestKeys,
          `[${lang}] manifest.duties와 yaml.duties 키 1:1`,
        )
        // role/role_en은 언어 무관 식별 라벨 — 모든 언어 파일에서 manifest와 동일
        assert.equal(y.role, m.role, `[${lang}] role 동기`)
        assert.equal(y.role_en, m.role_en, `[${lang}] role_en 동기`)
      }
    })
  })
}
