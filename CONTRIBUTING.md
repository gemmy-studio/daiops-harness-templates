# Contributing to daiops-harness-templates

daiops 신입/도메인 직원 페르소나·업무지침 템플릿 저장소에 기여해 주셔서 감사합니다.
이 저장소는 향후 **도메인/조직별 AI 템플릿 마켓플레이스**의 토대입니다.

## 라이선스 (기여 시 동의)

이 저장소는 **Apache License 2.0**입니다(코드·템플릿 콘텐츠 모두). 기여를 제출하면
기여물에 Apache-2.0이 적용되는 데 동의하는 것입니다(inbound = outbound).

## DCO (Developer Certificate of Origin)

CLA 대신 **DCO**를 사용합니다(기여 마찰 최소화). 모든 커밋에 `Signed-off-by` 라인이
있어야 합니다 — 본인이 해당 기여를 위 라이선스로 제출할 권리가 있음을 증명합니다.

```bash
git commit -s -m "메시지"
# → 커밋 메시지 끝에 자동으로:
#   Signed-off-by: Your Name <you@example.com>
```

전문은 [`DCO`](./DCO) 파일 참조. sign-off가 없는 PR은 머지되지 않습니다.

## 1st-party vs community 템플릿 정책

- **official (1st-party)**: Gemmy Studio가 관리하는 큐레이션 템플릿. 현재 `templates/<slug>/`에
  위치하며, daiops external-loader가 `<slug>`로 직접 로드합니다.
- **community**: 외부 기여 템플릿. PR로 제출 → 품질·스키마·중복 검토 후 채택됩니다.

> **디렉토리 물리 분리(`templates/community/` 네임스페이스)는 마켓플레이스 단계(loader 지원)와 함께 도입됩니다.**
> 현재 loader는 `templates/<slug>`를 *정확한 slug*로 해석하므로, 지금 디렉토리를 나누면 런타임 로드가
> 깨집니다. 그 전까지 community 기여는 검토 후 official로 큐레이션되어 머지됩니다.

## 새 템플릿 추가 방법

1. `templates/<slug>/` 생성:
   - `template.json` — 매니페스트 (`slug`·`schemaVersion`·`role`·`role_en`·`languages`·`duties`·`icon?`·`sortOrder?`)
   - `persona.<lang>.yaml` — 언어별 5-Layer 페르소나 + `duties:` 블록 (키는 `template.json#duties`와 1:1). 최소 `persona.ko.yaml` 필수
   - `README.md` — 템플릿 설명
2. `schemaVersion`은 daiops `EXPECTED_HARNESS_TEMPLATE_SCHEMA_VERSION` 이하 (현재 **2**)
3. 테스트 통과 확인:
   ```bash
   npm install && npm test
   ```
   검증: `template.json` JSON parse·필드 정합 / `languages` ↔ `persona.<lang>.yaml` 파일 1:1 / 각 언어 YAML parse·`duties` 키 1:1 매칭
4. `git commit -s` (DCO sign-off) 후 PR

### 번역 추가 (기존 템플릿에 언어 더하기)

- `persona.<lang>.yaml` 파일을 추가하고 `template.json#languages` 배열에 언어 코드를 더한다.
- 번역본은 **동일한 `duties` 키와 동일한 `role`/`role_en`**을 유지해야 한다 (테스트가 1:1 검증).
- 본문은 적응 번역한다 — "용어는 한국어 기본" 같은 *언어 자체에 대한 지침*은 대상 언어 맥락에 맞춘다.
- daiops는 워크스페이스 `persona.language`로 파일을 선택하며, 해당 언어가 없으면 `ko`로 fallback.

## 검토 기준

- 스키마 정합 + 테스트 통과 (필수)
- 페르소나 품질 (역할 명확성, 업무지침 구체성)
- 기존 템플릿과 slug·역할 중복 없음
