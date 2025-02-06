import * as Babel from "@babel/standalone";
import * as Parser from "@babel/parser";
import Generator from "@babel/generator";
import {
  GENERATOR_CONFIG,
  PARSER_CONFIG,
  TRANSFORM_CONFIG,
  TRANSFORM_AST_CONFIG,
} from "../constants/transform-process-page-transform-code-config";
import { BABEL_PLUGINS } from "../constants/transform-process-page-babel-plugins";

/**
 * ES6+ 코드를 ES5 코드로 변환하는 함수
 * 해당 코드는 오로지 PlayGround에서만 사용
 *
 * @see {@link https://babeljs.io/docs/babel-core}
 */
export const transformEs6CodeToEs5Code = (code) => {
  if (!code?.trim()) {
    return { code: "", ast: null, error: null };
  }

  try {
    const result = Babel.transform(code, TRANSFORM_CONFIG);

    return {
      code: result.code,
      ast: result.ast,
      error: null,
    };
  } catch (error) {
    return {
      code: null,
      ast: null,
      error: `변환 오류: ${error.message}`,
    };
  }
};

/**
 * 소스 코드를 AST로 변환하는 함수
 *
 * @param {string} code - 파싱할 소스 코드
 * @returns {{ast: Object|null, error: string|null, formatted: string|null}} 파싱된 AST 또는 에러
 */
export const parseSourceCodeToAst = (code) => {
  if (!code?.trim()) {
    return { ast: null, error: "코드가 비어있습니다.", formatted: null };
  }

  try {
    const ast = Parser.parse(code, { PARSER_CONFIG });

    return {
      ast,
      formatted: JSON.stringify(ast, null, 2),
      error: null,
    };
  } catch (error) {
    return {
      ast: null,
      formatted: null,
      error: `파싱 오류: ${error.message}`,
    };
  }
};

/**
 * AST에 플러그인을 적용하여 플러그인이 적용된 AST를 반환하는 함수
 *
 * @param {Object} ast - 변환할 AST
 * @param {string} plugin - 적용할 플러그인
 * @returns {{ast: Object|null, code: string|null, error: string|null}} 변환된 AST 또는 에러
 */
export const transformAstUsingPlugins = (ast, plugin) => {
  try {
    const { ast: transformedAST, code: transformedCode } =
      Babel.transformFromAst(ast, null, {
        ...TRANSFORM_AST_CONFIG,
        plugins: [plugin],
      });

    return { ast: transformedAST, code: transformedCode, error: null };
  } catch (error) {
    return { ast: null, code: null, error: error.message };
  }
};

/**
 * AST를 소스 코드로 변환하는 함수
 *
 * @param {Object} ast - 생성할 AST
 * @returns {{code: string|null, error: string|null}} 생성된 코드 또는 에러
 */
export const generateAstToSourceCode = (ast) => {
  try {
    const result = Generator(ast, GENERATOR_CONFIG);

    return { code: result.code, error: null };
  } catch (error) {
    return { code: null, error: error.message };
  }
};

/**
 * 소스 코드를 Babel 파이프라인을 거쳐 변환하는 함수
 * 1. Parsing: 소스 코드를 AST로 파싱
 * 2. Transformation: 감지된 플러그인들을 순차적으로 적용하여 AST 변환
 * 3. Generation: 최종 AST를 코드로 생성
 *
 * @param {string} sourceCode - 변환할 소스 코드
 * @returns {{
 *   parsing: {
 *     sourceCode: string,
 *     ast: Object|null,
 *     formattedAst: string|null
 *   },
 *   transformation: {
 *     steps: Array<{
 *       plugin: {
 *         id: string,
 *         name: string,
 *         description: string
 *       },
 *       before: {
 *         code: string,
 *         ast: Object
 *       },
 *       after: {
 *         code: string,
 *         ast: Object
 *       }
 *     }>,
 *     plugins: Array<Object>
 *   },
 *   generation: {
 *     ast: Object|null,
 *     code: string|null
 *   },
 *   result: {
 *     originalCode: string,
 *     transformedCode: string|null
 *   }
 * }
 * }} - 파싱, 변환, 생성 과정의 상세 결과
 */
export const processBabelSteps = (sourceCode) => {
  try {
    // 1. Parsing
    const { ast: initialAst, formatted: formattedAst } =
      parseSourceCodeToAst(sourceCode);

    // 2. Transformation
    const detectedPlugins = BABEL_PLUGINS.filter((plugin) =>
      plugin.detect(sourceCode)
    );

    const transformSteps = [];
    let currentCode = sourceCode;
    let currentAst = initialAst;

    for (const plugin of detectedPlugins) {
      // 이전 단계의 결과를 기반으로 현재 플러그인 적용
      const { ast: transformedAst, code: transformedCode } =
        transformAstUsingPlugins(currentAst, plugin.id);
      if (!transformedAst) continue;

      transformSteps.push({
        plugin: {
          id: plugin.id,
          name: plugin.name,
          description: plugin.description,
        },
        before: {
          code: currentCode,
          ast: currentAst,
        },
        after: {
          code: transformedCode,
          ast: transformedAst,
        },
      });

      currentCode = transformedCode;
      currentAst = transformedAst;
    }

    // 3. Generation
    const { code: finalGeneratedCode } = generateAstToSourceCode(currentAst);

    return {
      parsing: {
        sourceCode,
        ast: initialAst,
        formattedAst,
      },
      transformation: {
        steps: transformSteps,
        plugins: detectedPlugins,
      },
      generation: {
        ast: currentAst,
        code: finalGeneratedCode,
      },
      result: {
        originalCode: sourceCode,
        transformedCode: finalGeneratedCode,
      },
    };
  } catch (error) {
    console.error("Babel processing error:", error);

    return {
      parsing: { sourceCode, ast: null, formattedAst: null },
      transformation: { steps: [], plugins: [] },
      generation: { ast: null, code: null },
      result: { originalCode: sourceCode, transformedCode: null },
    };
  }
};
