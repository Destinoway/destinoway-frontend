"use client";

import RHFInput from "@/components/ui/RHFinputs/RHFInput";
import { EditOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import EditableField from "../../../components/ui/RHFinputs/EditableField";
import RHFDatePicker from "../../../components/ui/RHFinputs/RHFDatePicker";
import RHFSelect from "../../../components/ui/RHFinputs/RHFSelect";

import {
  getCustomerDocumentsApi,
  updateCustomerDocumentsApi,
} from "../api/profile.api";

/* ✅ VALIDATION */

const schema = z.object({
  passportNumber: z
    .string()
    .trim()
    .min(1, "Passport number is required")
    .regex(/^[A-PR-WYa-pr-wy][1-9]\d\s?\d{4}[1-9]$/, "Invalid passport number"),

  passportExpiryDate: z.any().refine((val) => val !== null, {
    message: "Passport expiry date is required",
  }),

  passportIssuingCountry: z
    .string()
    .trim()
    .min(1, "Issuing country is required"),

  panCardNumber: z
    .string()
    .trim()
    .min(1, "PAN card number is required")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN card number"),
});

export default function DocumentsTab() {
  const { message } = App.useApp();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  /* ✅ ORIGINAL DATA STORE */

  const [originalData, setOriginalData] = useState(null);
  const methods = useForm({
    resolver: zodResolver(schema),

    mode: "onSubmit",

    defaultValues: {
      passportNumber: "",
      passportExpiryDate: null,
      passportIssuingCountry: "",
      panCardNumber: "",
    },
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = methods;

  /* LOAD DATA */

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setDocumentsLoading(true);

        const res = await getCustomerDocumentsApi();

        const data = res?.data?.data;

        const formattedData = {
          passportNumber: data?.passportNumber || "",

          passportExpiryDate: data?.passportExpiryDate
            ? dayjs(data.passportExpiryDate)
            : null,

          passportIssuingCountry: data?.passportIssuingCountry || "",

          panCardNumber: data?.panCardNumber || "",
        };

        /* ✅ SAVE ORIGINAL DATA */

        setOriginalData(formattedData);

        reset(formattedData);
      } catch (error) {
        message.error("Failed to load documents");
      } finally {
        setDocumentsLoading(false);
      }
    };

    fetchDocuments();
  }, [message, reset]);

  /* SUBMIT */

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        passportNumber: data.passportNumber,

        passportExpiryDate: data.passportExpiryDate
          ? dayjs(data.passportExpiryDate).toISOString()
          : null,

        passportIssuingCountry: data.passportIssuingCountry,

        panCardNumber: data.panCardNumber,
      };

      const res = await updateCustomerDocumentsApi(payload);

      const updatedData = res?.data?.data;

      const formattedUpdatedData = {
        passportNumber: updatedData?.passportNumber || "",

        passportExpiryDate: updatedData?.passportExpiryDate
          ? dayjs(updatedData.passportExpiryDate)
          : null,

        passportIssuingCountry: updatedData?.passportIssuingCountry || "",

        panCardNumber: updatedData?.panCardNumber || "",
      };

      /* ✅ UPDATE ORIGINAL DATA */

      setOriginalData(formattedUpdatedData);

      reset(formattedUpdatedData);

      message.success("Documents updated successfully");

      setIsEdit(false);
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to update documents",
      );
    } finally {
      setLoading(false);
    }
  };

  /* ✅ CANCEL BUTTON FIX */

  const handleCancel = () => {
    /* FORM RESET TO ORIGINAL DATA */

    reset(originalData);

    setIsEdit(false);
  };

  return (
    <>
      {/* ONLY EDIT MODE LABEL HIDE */}

      <style jsx global>{`
        .edit-mode .ant-form-item-label {
          display: none !important;
        }

        .edit-mode .ant-form-item {
          margin-bottom: 14px !important;
        }

        .edit-mode .ant-form-item-explain {
          min-height: auto !important;
          margin-top: 2px !important;
        }

        .edit-mode .ant-form-item-explain-error {
          font-size: 12px !important;
          line-height: 16px !important;
        }
      `}</style>

      {/* TITLE */}

      <div className="flex items-center justify-between bg-white! px-6 py-4 text-gray-900">
        <h2 className="mb-0! text-[22px] font-bold text-gray-900">
          My Profile
        </h2>
      </div>

      {/* MAIN */}

      <div className="bg-white! p-6 text-gray-900 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Documents</h3>

          {!isEdit && (
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsEdit(true)}
              loading={documentsLoading}
            >
              Edit Details
            </Button>
          )}
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={isEdit ? "edit-mode" : ""}
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* PASSPORT */}

              <EditableField
                label={!isEdit ? "Passport Number" : ""}
                value={watch("passportNumber")}
                isEdit={isEdit}
                error={errors.passportNumber?.message}
              >
                <RHFInput name="passportNumber" label="Passport Number" />
              </EditableField>

              {/* EXPIRY */}

              <EditableField
                label={!isEdit ? "Passport Expiry Date" : ""}
                value={
                  watch("passportExpiryDate")
                    ? dayjs(watch("passportExpiryDate")).format("DD MMM YYYY")
                    : ""
                }
                isEdit={isEdit}
                error={errors.passportExpiryDate?.message}
              >
                <RHFDatePicker
                  name="passportExpiryDate"
                  label="Passport Expiry Date"
                  placeholder="Select Passport Expiry Date"
                  disabledDate={(current) =>
                    current && current <= dayjs().endOf("day")
                  }
                  showToday={false}
                />
              </EditableField>

              {/* COUNTRY */}

              <EditableField
                label={!isEdit ? "Passport Issuing Country" : ""}
                value={watch("passportIssuingCountry")}
                isEdit={isEdit}
                error={errors.passportIssuingCountry?.message}
              >
                <RHFSelect
                  name="passportIssuingCountry"
                  label="Passport Issuing Country"
                  placeholder="Select Country"
                  options={[
                    {
                      label: "India",
                      value: "India",
                    },
                    {
                      label: "USA",
                      value: "USA",
                    },
                  ]}
                />
              </EditableField>

              {/* PAN */}

              <EditableField
                label={!isEdit ? "PAN Card Number" : ""}
                value={watch("panCardNumber")}
                isEdit={isEdit}
                error={errors.panCardNumber?.message}
              >
                <RHFInput
                  name="panCardNumber"
                  label="PAN Card Number"
                  transform={(v) => v.toUpperCase()}
                />
              </EditableField>
            </div>

            {/* BUTTONS */}

            {isEdit && (
              <div className="mt-6 flex gap-3">
                <Button onClick={handleCancel} className="h-10.5! px-6!">
                  Cancel
                </Button>

                <Button
                  htmlType="submit"
                  type="primary"
                  loading={loading}
                  className="buttion-background-color h-10.5! border-none! px-6!"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </>
  );
}
