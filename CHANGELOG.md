# Changelog

`daiops-harness-templates`의 버전별 변경 이력. 형식은 [Keep a Changelog](https://keepachangelog.com/) 준용, 버전은 [SemVer](https://semver.org/).

## [0.2.0] — 2026-06-01

### Added
- **템플릿 본문 다국어화** — 페르소나 본문(L0·L2·L3·L4·L5 + duties)을 언어별 파일로 분리. daiops가 워크스페이스 `persona.language`로 선택
- `templates/researcher-curator/persona.en.yaml` — 영어판 (적응 번역: "용어는 한국어 기본" 등 언어 자체 지침은 영어 맥락에 맞춤)
- `template.json#languages` 필드 — 제공 언어 목록 (`["ko","en"]`). loader fallback 기준 `ko` 필수
- 테스트: `manifest.languages` ↔ 디스크 `persona.<lang>.yaml` 파일 1:1, 언어별 duties 키·role/role_en 정합

### Changed
- `persona.yaml` → **`persona.ko.yaml`** 리네임 (언어 접미사 규약)
- schemaVersion **1 → 2**. daiops loader는 v1(단일 `persona.yaml`)도 ko로 하위 호환 로드
- README·CONTRIBUTING·템플릿 README를 언어별 파일 구조로 갱신

[0.2.0]: https://github.com/gemmy-studio/daiops-harness-templates/releases/tag/v0.2.0

## [0.1.0] — 2026-05-28

### Added
- daiops 채용 페르소나·업무지침 템플릿 **monorepo 초기** — 메인 앱 TS 상수 하드코딩에서 분리
- `researcher-curator` 템플릿 (Track 3 신입 키우기, tier A)
- 템플릿 구조: `template.json`(매니페스트) + `persona.yaml`(5-Layer) + `README.md`
- schema 정합 단위 테스트 — `template.json` 필드 정합, `persona.yaml` parse, duties 1:1 매칭
- schemaVersion **1** — daiops `EXPECTED_HARNESS_TEMPLATE_SCHEMA_VERSION` 호환
- 라이선스 **Apache-2.0** 단일 + **DCO**(Signed-off-by) 기여 모델 (CLA 없음)
- git tag fetch 배포 — daiops가 `~/.daiops/harness-templates/...@<tag>`에서 로드

[0.1.0]: https://github.com/gemmy-studio/daiops-harness-templates/releases/tag/v0.1.0
