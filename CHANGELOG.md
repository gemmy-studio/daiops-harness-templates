# Changelog

`daiops-harness-templates`의 버전별 변경 이력. 형식은 [Keep a Changelog](https://keepachangelog.com/) 준용, 버전은 [SemVer](https://semver.org/).

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
