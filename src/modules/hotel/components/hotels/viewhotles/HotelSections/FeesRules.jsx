"use client";

import {
  DollarCircleOutlined,
  FileProtectOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const FeesRules = ({ supplierData = {} }) => {
  const policy = supplierData?.Policy || null;
  const importantInformation = supplierData?.ImportantInformation || null;

  const getValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }

    return "";
  };

  const commonRules = [];

  if (policy && typeof policy === "object") {
    const applicableCode = getValue(policy?.applicableCode);

    const state = getValue(policy?.state);

    const outPolicyReason = getValue(policy?.outPolicyReason);

    if (applicableCode) {
      commonRules.push({
        title: "Applicable Code",
        value: applicableCode,
        type: "fee",
      });
    }

    if (state) {
      commonRules.push({
        title: "Policy State",
        value: state,
        type: "policy",
      });
    }

    if (outPolicyReason) {
      commonRules.push({
        title: "Policy Information",
        value: outPolicyReason,
        type: "info",
      });
    }
  }

  if (typeof policy === "string" && policy.trim()) {
    commonRules.push({
      title: "Hotel Policy",
      value: policy,
      type: "policy",
    });
  }

  if (importantInformation) {
    if (typeof importantInformation === "string") {
      commonRules.push({
        title: "Important Information",
        value: importantInformation,
        type: "info",
      });
    }

    if (Array.isArray(importantInformation)) {
      importantInformation.forEach((item) => {
        if (typeof item === "string" && item.trim()) {
          commonRules.push({
            title: "Important Information",
            value: item,
            type: "info",
          });
        }

        if (item && typeof item === "object") {
          const value = item?.description || item?.text || item?.value || "";

          if (String(value).trim()) {
            commonRules.push({
              title: item?.title || item?.type || "Important Information",
              value: String(value),
              type: "info",
            });
          }
        }
      });
    }

    if (
      typeof importantInformation === "object" &&
      !Array.isArray(importantInformation)
    ) {
      Object.entries(importantInformation).forEach(([key, value]) => {
        if (value !== null && value !== undefined && String(value).trim()) {
          commonRules.push({
            title: key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (char) => char.toUpperCase()),
            value: String(value),
            type: "info",
          });
        }
      });
    }
  }

  const uniqueRules = Array.from(
    new Map(
      commonRules.map((item) => [`${item.title}-${item.value}`, item]),
    ).values(),
  );

  const getIcon = (type) => {
    if (type === "fee") {
      return <DollarCircleOutlined />;
    }

    if (type === "info") {
      return <InfoCircleOutlined />;
    }

    return <FileProtectOutlined />;
  };

  return (
    <div className="space-y-4">
      {uniqueRules.length > 0 ? (
        <div className="rounded-xl border border-gray-300  p-6 ">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-800">
              Hotel Rules & Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Common hotel policies, fees and important information
            </p>
          </div>

          <div className="space-y-3">
            {uniqueRules.map((item, index) => (
              <div
                key={`${item.title}-${index}`}
                className="flex items-start gap-3 rounded border border-gray-100 bg-gray-50 p-4"
              >
                <div className="most-text-color flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white text-[18px] shadow-sm">
                  {getIcon(item.type)}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="mb-1 text-sm font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <div
                    className="text-sm leading-7 text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: item.value,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded border border-dashed p-8 text-center text-gray-500">
          No fees information available
        </div>
      )}
    </div>
  );
};

export default FeesRules;
