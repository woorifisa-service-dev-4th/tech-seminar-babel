import Editor from "@monaco-editor/react";
import { Card, CardBody } from "@nextui-org/react";
import { useMemo } from "react";
import React from "react";

const EDITOR_OPTIONS = {
  fontSize: 14,
  fontFamily: "Menlo, Monaco, 'Courier New', monospace",
  minimap: { enabled: false },
  lineNumbers: "on",
  tabSize: 2,
  insertSpaces: true,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  wordWrap: "off",
  padding: { top: 12 },
  bracketPairColorization: { enabled: true },
  guides: {
    bracketPairs: true,
    indentation: true,
  },
};

const CodeEditor = ({
  value,
  onChange,
  readOnly = false,
  language = "javascript",
  height = "700px",
}) => {
  // 에디터 옵션 메모이제이션
  const editorOptions = useMemo(
    () => ({
      ...EDITOR_OPTIONS,
      readOnly,
    }),
    [readOnly]
  );

  return (
    <Card className="w-full h-full shadow-lg overflow-hidden rounded-xl">
      <CardBody className="p-0 h-full">
        <Editor
          height={height}
          defaultLanguage={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          options={editorOptions}
          loading={
            <div className="h-full w-full flex items-center justify-center">
              Loading...
            </div>
          }
        />
      </CardBody>
    </Card>
  );
};

export default React.memo(CodeEditor);
