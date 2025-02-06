import React, { useState, useMemo } from "react";
import { Card } from "@nextui-org/react";
import CodeEditor from "../common/CodeEditor";

// 코드와 AST를 표시하는 패널 컴포넌트
const CodePanel = ({ title, data, side }) => {
  const [displayMode, setDisplayMode] = useState("ast"); // Code Editor에 표시할 내용 (ast | code)

  // 표시할 내용을 메모이제이션하여 성능 최적화
  const content = useMemo(() => {
    return displayMode === "ast"
      ? JSON.stringify(data?.ast, null, 2)
      : data?.code || "// 내용이 없습니다";
  }, [data, displayMode]);

  return (
    <Card className={`p-4 shadow-sm animate-slide-${side}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>

        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          {/* AST 버튼 */}
          <button
            onClick={() => setDisplayMode("ast")}
            className={`px-4 py-1.5 text-sm rounded-md transition-all duration-200 ${
              displayMode === "ast"
                ? "bg-white text-indigo-600 font-semibold shadow-sm"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  displayMode === "ast" ? "text-indigo-600" : "text-gray-600"
                }
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span>AST</span>
            </div>
          </button>

          {/* 코드 버튼 */}
          <button
            onClick={() => setDisplayMode("code")}
            className={`px-4 py-1.5 text-sm rounded-md transition-all duration-200 ${
              displayMode === "code"
                ? "bg-white text-indigo-600 font-semibold shadow-sm"
                : "text-gray-600 hover:text-indigo-600"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={
                  displayMode === "code" ? "text-indigo-600" : "text-gray-600"
                }
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>Code</span>
            </div>
          </button>
        </div>
      </div>

      {/* 코드 에디터 */}
      <CodeEditor
        value={content}
        language={displayMode === "ast" ? "json" : "javascript"}
        readOnly={true}
      />
    </Card>
  );
};

export default CodePanel;
