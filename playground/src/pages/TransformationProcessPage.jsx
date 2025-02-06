import React, { useState } from "react";
import { Tab, Tabs } from "@nextui-org/react";
import { DEFAULT_CODE } from "../constants/transform-process-page-default-code";
import ParsingStep from "../components/layout/steps/ParsingStep";
import TransformationStep from "../components/layout/steps/TransformationStep";
import GenerationStep from "../components/layout/steps/GenerationStep";
import ResultStep from "../components/layout/steps/ResultStep";
import { processBabelSteps } from "../utils/babel";

export default function TransformationProcessPage() {
  const [babelProcessObject, setBabelProcessObject] = useState(() =>
    processBabelSteps(DEFAULT_CODE)
  ); // 파싱, 변환, 생성 과정에서의 코드 및 AST를 담고 있는 객체
  const [selectedTab, setSelectedTab] = useState("parsing"); // 선택된 탭

  // 코드 변경 시 Babel 프로세스 재실행
  const handleCodeChange = (newCode) => {
    setBabelProcessObject(processBabelSteps(newCode));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 페이지 헤더 섹션 */}
      <div className="mb-8 animate-fade-down">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Babel Transformation Process
        </h1>
        <p className="text-gray-600">
          Babel이 코드를 변환하는 과정을 단계별로 확인해보세요
        </p>
      </div>

      {/* Babel 변환 과정 탭 컨테이너 */}
      <div className="bg-white rounded-xl shadow-sm p-6 animate-fade-up">
        <Tabs
          aria-label="Babel process steps"
          classNames={{
            base: "flex flex-col items-center w-full",
            tabList:
              "relative w-full max-w-2xl mx-auto rounded-xl p-2 border border-gray-200 bg-gray-50 mb-4",
            cursor: "bg-white shadow-md rounded-lg transition-all duration-200",
            tab: "flex-1 h-12 text-center data-[selected=true]:text-indigo-600 transition-all duration-200 focus:outline-none",
            tabContent:
              "text-sm font-medium group-data-[selected=true]:text-indigo-600",
            panel: "w-full pt-6",
          }}
          variant="solid"
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab}
        >
          {/* 각 단계별 탭 구성 */}
          {[
            {
              key: "parsing",
              title: "Parsing",
              component: (
                // 파싱 단계: 소스코드를 AST로 변환
                <div className="tab-enter-active">
                  <ParsingStep
                    {...babelProcessObject.parsing}
                    onCodeChange={handleCodeChange}
                  />
                </div>
              ),
            },
            {
              key: "transformation",
              title: "Transformation",
              component: (
                // 변환 단계: AST를 순회하며 노드 변환
                <div className="tab-enter-active">
                  <TransformationStep
                    steps={babelProcessObject.transformation?.steps || []}
                  />
                </div>
              ),
            },
            {
              key: "generation",
              title: "Generation",
              component: (
                // 생성 단계: 변환된 AST를 코드로 생성
                <div className="tab-enter-active">
                  <GenerationStep {...babelProcessObject.generation} />
                </div>
              ),
            },
            {
              key: "result",
              title: "Result",
              component: (
                // 최종 결과: 변환된 코드 출력
                <div className="tab-enter-active">
                  <ResultStep {...babelProcessObject.result} />
                </div>
              ),
            },
          ].map((tab, index) => (
            <Tab
              key={tab.key}
              title={
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold">{index + 1}.</span>
                  <span>{tab.title}</span>
                </div>
              }
            >
              {tab.component}
            </Tab>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
