# daiops-harness-templates

daiops 신입/도메인 직원 채용 시 사용하는 페르소나·업무지침 템플릿 모음 (monorepo).

`daiops-agent-runner`처럼 daiops 메인 앱 외부로 분리한 산출물이다. 분리 이유:
1. 마크다운/YAML 직접 편집 가능 (이전: TS 상수 하드코딩)
2. 단위 테스트로 schema 정합 자동 검증
3. 마켓플레이스 토대 — 향후 도메인/조직별 템플릿 확장

## 구조

```
templates/
  <slug>/
    template.json     # 매니페스트 (slug, schemaVersion, role, role_en, languages, duties, icon, sortOrder)
    persona.ko.yaml   # 한국어 5-Layer 페르소나(L0·L2·L3·L4·L5) + duties 본문
    persona.en.yaml   # 영어판 (동일 구조·duties 키, 본문만 번역)
    README.md         # 템플릿 설명
```

본문 언어는 daiops가 워크스페이스 `persona.language`로 선택한다(`persona.<lang>.yaml`).
요청 언어가 없으면 `ko`로 fallback. 번역 추가 = `persona.<lang>.yaml` 파일 + `template.json#languages` 코드 추가.

## 현재 템플릿

| slug | 역할 | tier |
|---|---|---|
| `researcher-curator` | 리서처·큐레이터 | A (Track 3 신입 키우기) |

도메인 템플릿(HR, finance 등)은 T3 작업에서 추가 예정.

## schema 호환성

`template.json#schemaVersion` ≤ daiops `EXPECTED_HARNESS_TEMPLATE_SCHEMA_VERSION`이어야 로드 가능.
현재 schemaVersion: **2** (언어별 `persona.<lang>.yaml` + `languages` 필드 도입). 증가 규칙은 daiops external-loader 주석 참조.
daiops loader는 schemaVersion 1(단일 `persona.yaml`)도 ko로 하위 호환 로드한다.

## 테스트

```bash
npm install
npm test
```

검증 항목:
- 각 `template.json` JSON parse OK + 필드 정합 (`languages` 포함)
- `manifest.languages` 집합 == 디스크의 `persona.<lang>.yaml` 파일 집합 (`ko` 필수)
- 각 `persona.<lang>.yaml` YAML parse OK + `duties` 키 == `template.json#duties` 배열 (1:1 매칭) + role/role_en 일치

## 배포

git tag `v0.1.x` push → GitHub Actions가 lint·test 실행. daiops는 캐시 디렉토리
`~/.daiops/harness-templates/daiops-harness-templates@<tag>`에서 fetch.

## License

[Apache License 2.0](./LICENSE) — Copyright 2026 Gemmy Studio Inc.

페르소나·업무지침 템플릿을 오픈소스로 공개해 도메인/조직별 템플릿 생태계(마켓플레이스)를
커뮤니티 기여로 확장하기 위함. 기여 시 Apache-2.0 조건에 따른다(inbound = outbound).

## Contributing

외부 기여는 **DCO(Signed-off-by)** 기반 — CLA 없음. `git commit -s`로 sign-off.
1st-party/community 정책·템플릿 추가 방법은 [CONTRIBUTING.md](./CONTRIBUTING.md) 참조.
