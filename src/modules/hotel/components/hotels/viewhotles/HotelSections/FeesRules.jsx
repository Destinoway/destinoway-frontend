"use client";

import SectionCard from "./SectionCard";

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

  const humanize = (key) =>
    String(key)
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]+/g, " ")
      .trim()
      .replace(/^./, (char) => char.toUpperCase());

  // ImportantInformation values can be nested objects/arrays (e.g. a list of
  // fees). String(obj) gave "[object Object]", so flatten them to text.
  const toText = (value) => {
    if (value === null || value === undefined || value === "") return "";

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value).trim();
    }

    if (Array.isArray(value)) {
      return value.map(toText).filter(Boolean).join("<br />");
    }

    if (typeof value === "object") {
      const direct =
        value.description ?? value.text ?? value.value ?? value.content;
      if (direct !== undefined && typeof direct !== "object") {
        const label = value.title || value.name || value.type;
        const text = toText(direct);
        return label && text ? `<strong>${label}:</strong> ${text}` : text;
      }

      return Object.entries(value)
        .map(([key, item]) => {
          const text = toText(item);
          return text ? `<strong>${humanize(key)}:</strong> ${text}` : "";
        })
        .filter(Boolean)
        .join("<br />");
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
          const value = toText(
            item?.description ?? item?.text ?? item?.value ?? item,
          );

          if (value) {
            commonRules.push({
              title: item?.title || item?.type || "Important Information",
              value,
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
        const text = toText(value);

        if (text) {
          commonRules.push({
            title: humanize(key),
            value: text,
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
    <SectionCard
      icon={<FileProtectOutlined />}
      title="Hotel Rules & Information"
      subtitle="Common hotel policies, fees and important information"
    >
      {uniqueRules.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {uniqueRules.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex items-start gap-3 rounded-xl border border-gray-200 bg-slate-50/60 p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[16px] text-(--theme-secondary) shadow-sm ring-1 ring-gray-100">
                {getIcon(item.type)}
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="m-0 mb-1 text-[14px] font-semibold text-gray-900">
                  {item.title}
                </h3>
                <div
                  className="text-[13px] leading-6 wrap-break-word text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: item.value,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="m-0 rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          No fees information available
        </p>
      )}
    </SectionCard>
  );
};

export default FeesRules;
