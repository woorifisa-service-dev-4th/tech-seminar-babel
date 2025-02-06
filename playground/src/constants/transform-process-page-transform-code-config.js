/**
 * AST 생성을 위한 파서 설정
 *
 * @property {boolean} errorRecovery - 파싱 오류 처리 방식
 *   - true: 오류 발생 시에도 가능한 만큼 파싱 계속 진행
 *   - false: 첫 오류 발생 시 즉시 중단
 */
export const PARSER_CONFIG = {
  errorRecovery: false,
};

/**
 * 코드 생성을 위한 설정
 */
export const GENERATOR_CONFIG = {};

/**
 * Babel 코드 변환을 위한 설정
 *
 * @property {string[]} presets - Babel 프리셋 목록
 *   - "env": ES6+ 코드를 ES5로 변환하는 표준 프리셋
 */
export const TRANSFORM_CONFIG = {
  presets: ["env"],
};

/**
 * AST 플러그인 변환을 위한 설정
 *
 * @property {boolean} ast - AST 생성 여부
 *   - true: 변환 결과에 AST 포함
 *   - false: 코드만 반환
 */
export const TRANSFORM_AST_CONFIG = {
  ast: true,
};
