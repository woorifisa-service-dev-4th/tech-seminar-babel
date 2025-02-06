import React, { useState } from "react";
import CodePanel from "./CodePanel";

const TransformationStep = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep] || {};

  return (
    <div className="space-y-10">
      <div className="text-center animate-fade-down mb-2">
        <h2 className="text-2xl font-bold mb-2">Transformation</h2>
        <p className="text-gray-600 max-w-3xl mx-auto whitespace-pre-line">
          {`변환 과정에서 Babel 플러그인들은 현대 JavaScript 기능을 ES5 버전으로 변환하기 위해 AST를 수정합니다.
각 플러그인이 코드를 단계별로 어떻게 변환하는지 살펴보세요.`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CodePanel
          title={
            currentStep === 0
              ? "Current"
              : `Current (After ${steps[currentStep - 1]?.plugin?.name})`
          }
          data={step.before}
          side="right"
        />
        <CodePanel
          title={`After ${step.plugin?.name}`}
          data={step.after}
          side="left"
        />
      </div>

      <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex flex-col items-center gap-6">
          {/* Navigation controls inside info card */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors focus:outline-none"
              aria-label="Previous step"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {step.plugin?.name || "Plugin"}
              </h3>
              <span className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            <button
              onClick={() =>
                setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
              }
              disabled={currentStep === steps.length - 1}
              className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors focus:outline-none"
              aria-label="Next step"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Plugin description */}
          <p className="text-gray-600 text-center">
            {step.plugin?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransformationStep;
