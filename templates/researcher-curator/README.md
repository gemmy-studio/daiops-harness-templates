# researcher-curator

daiops 신입 채용 Tier A 기본 템플릿. "리서처 / 큐레이터" 역할.

## 무엇을 하는 직원인가

지원사업·뉴스·경쟁사 모니터링·뉴스레터 초안·문서 정리. 정확성 우선, 출처 누락 금지.

## 5개 업무 (duties)

| key | 요약 |
|---|---|
| `funding_research` | 정부·민간 지원사업·R&D 공고 탐색. 주 1회 브리프 |
| `news_curation` | 업종·기술 시그널 기사 선별. 1일 5건 이내 |
| `competitor_monitoring` | 경쟁사 릴리스·채용·블로그·SNS 변화 추적 |
| `newsletter_draft` | 팀 주간 뉴스레터 초안 (3 섹션) |
| `document_work` | 회의록·이메일·보고서 정리 |

## 파일

- `template.json` — 매니페스트 (slug, schemaVersion, role, role_en, languages, duties 등)
- `persona.ko.yaml` — 한국어 5-Layer 페르소나(L0·L2·L3·L4·L5) + duties 본문
- `persona.en.yaml` — 영어판 (동일 구조·동일 duties 키, 본문만 번역)

> 본문 언어는 워크스페이스 `persona.language`를 따라 선택됩니다. 번역 추가는 `persona.<lang>.yaml` 파일을 더하고 `template.json#languages`에 코드를 추가하면 됩니다.
