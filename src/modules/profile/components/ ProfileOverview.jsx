"use client";

import { CheckCircleFilled, EditOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { App, Button, Divider, Input } from "antd";
import dayjs from "dayjs";
import { memo, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import RHFDatePicker from "@/components/ui/RHFinputs/RHFDatePicker";
import RHFInput from "@/components/ui/RHFinputs/RHFInput";
import RHFSelect from "@/components/ui/RHFinputs/RHFSelect";

import {
  useProfile,
  useSendEmailOtp,
  useSendMobileOtp,
  useUpdateProfile,
  useVerifyEmail,
  useVerifyMobile,
} from "../hooks/useProfile";

import {
  countryStateCityData,
  genderOptions,
  maritalStatusOptions,
} from "@/modules/shared/home/components/data/profileData";

import RHFPhoneInput from "@/components/ui/RHFinputs/RHFPhoneInput";
import { profileSchema } from "../schema/profileValidation";

const ViewField = memo(({ label, value, type, prefix }) => (
  <div className="space-y-1">
    <p className="text-[14px] text-gray-500">{label}</p>

    {value !== null && value !== undefined && value !== "" ? (
      <div className="flex items-center text-[16px] font-semibold text-[#1f1f1f]">
        {type === "date" ? (
          dayjs(value).format("DD MMM YYYY")
        ) : (
          <>
            {prefix && <span className="most-text-color">{prefix}</span>}

            <span>{value}</span>
          </>
        )}
      </div>
    ) : (
      <span className="most-text-color text-[13px] font-medium">
        Add {label}
      </span>
    )}
  </div>
));

ViewField.displayName = "ViewField";

const VerifySection = ({
  name,
  label,
  verified,
  otp,
  setOtp,
  showOtp,
  setShowOtp,
  trigger,
  formValues,
  sendOtp,
  verifyOtp,
  setVerified,
}) => {
  const { message } = App.useApp();
  const handleSendOtp = async () => {
    if (sendOtp.isPending) return;

    const valid = await trigger(name);

    if (!valid) return;

    sendOtp.mutate({
      [name]: formValues[name],
    });

    setShowOtp(true);
  };
  const handleVerifyOtp = () => {
    if (verifyOtp.isPending) return;

    if (otp.length !== 6) {
      message.error("Enter valid OTP");
      return;
    }

    verifyOtp.mutate(
      {
        [name]: formValues[name],
        otp,
      },
      {
        onSuccess: () => {
          setVerified(true);
          setShowOtp(false);

          message.success(`${label} verified`);
        },
      },
    );
  };
  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="w-full">
          {name === "mobile" ? (
            <RHFPhoneInput name="mobile" codeName="phoneCode" label={label} />
          ) : (
            <RHFInput name={name} label={label} />
          )}
        </div>

        <Button
          className="h-10.5! min-w-27.5!"
          disabled={verified}
          loading={sendOtp.isPending}
          onClick={handleSendOtp}
        >
          Verify
        </Button>

        {verified && (
          <CheckCircleFilled className="mb-2.5 text-[18px] text-green-500" />
        )}
      </div>

      {showOtp && (
        <div className="mt-2 flex gap-2">
          <Input
            className="h-10.5!"
            placeholder="6 digit OTP"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <Button
            className="h-10.5! px-5!"
            loading={verifyOtp.isPending}
            onClick={handleVerifyOtp}
          >
            OK
          </Button>
        </div>
      )}
    </>
  );
};

const defaultValues = {
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  mobile: "",
  phoneCode: "+91",
  city: "",
  state: "",
  nationality: "",
  maritalStatus: "",
  dateOfBirth: null,
  anniversary: null,
};

const toOptions = (arr = []) =>
  arr.map((item) => ({
    label: item,
    value: item,
  }));

const profileFields = ({
  selectedCountry,
  selectedState,
  filteredStateOptions,
  filteredCityOptions,
  maritalStatus,
}) => [
  {
    name: "firstName",
    label: "First Name",
    component: RHFInput,
  },
  {
    name: "lastName",
    label: "Last Name",
    component: RHFInput,
  },
  {
    name: "gender",
    label: "Gender",
    component: RHFSelect,
    props: {
      placeholder: "Select Gender",
      options: genderOptions,
    },
  },
  {
    name: "dateOfBirth",
    label: "Birth Date",
    component: RHFDatePicker,
    type: "date",
    props: {
      placeholder: "Select Birth Date",
      showToday: false,
      disabledDate: (current) => current && current >= dayjs().endOf("day"),
    },
  },
  {
    name: "nationality",
    label: "Nationality",
    component: RHFSelect,
    props: {
      placeholder: "Select Country",
      options: Object.keys(countryStateCityData).map((country) => ({
        label: country,
        value: country,
      })),
    },
  },
  {
    name: "state",
    label: "State",
    component: RHFSelect,
    props: {
      placeholder: selectedCountry ? "Select State" : "Select Country First",
      disabled: !selectedCountry,
      options: filteredStateOptions,
    },
  },
  {
    name: "city",
    label: "City",
    component: RHFSelect,
    props: {
      placeholder: selectedState ? "Select City" : "Select State First",
      disabled: !selectedState,
      options: filteredCityOptions,
    },
  },
  {
    name: "maritalStatus",
    label: "Marital Status",
    component: RHFSelect,
    props: {
      placeholder: "Select Status",
      options: maritalStatusOptions,
    },
  },
  {
    name: "anniversary",
    label: "Anniversary",
    component: RHFDatePicker,
    type: "date",
    props: {
      placeholder: "Select Anniversary",
      disabled: maritalStatus === "Single",
      showToday: false,
      disabledDate: (current) => current && current > dayjs().endOf("day"),
    },
  },
];

export default function ProfileOverview() {
  const { message } = App.useApp();
  const { data: user } = useProfile();
  const updateProfile = useUpdateProfile();
  const sendEmailOtp = useSendEmailOtp();
  const verifyEmail = useVerifyEmail();
  const sendMobileOtp = useSendMobileOtp();
  const verifyMobile = useVerifyMobile();
  const [isEdit, setIsEdit] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);

  // ================= FORM =================

  const methods = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onSubmit",
    defaultValues,
  });

  const { control, handleSubmit, reset, trigger, setValue } = methods;

  // ================= WATCHERS =================

  const formValues = useWatch({
    control,
  });

  const {
    email,
    mobile,
    nationality: selectedCountry,
    state: selectedState,
    maritalStatus,
  } = formValues;

  // ================= FILTERED STATE OPTIONS =================

  const filteredStateOptions = useMemo(
    () => toOptions(Object.keys(countryStateCityData[selectedCountry] || {})),
    [selectedCountry],
  );

  // ================= FILTERED CITY OPTIONS =================

  const filteredCityOptions = useMemo(
    () =>
      toOptions(countryStateCityData[selectedCountry]?.[selectedState] || []),
    [selectedCountry, selectedState],
  );

  const fields = useMemo(
    () =>
      profileFields({
        selectedCountry,
        selectedState,
        filteredStateOptions,
        filteredCityOptions,
        maritalStatus,
      }),
    [
      selectedCountry,
      selectedState,
      filteredStateOptions,
      filteredCityOptions,
      maritalStatus,
    ],
  );

  // ================= RESET STATE + CITY =================
  useEffect(() => {
    if (!isEdit) return;

    setValue("state", "");
    setValue("city", "");
  }, [selectedCountry]);

  useEffect(() => {
    if (!isEdit || !selectedState) return;

    setValue("city", "");
  }, [selectedState]);

  // ================= RESET ANNIVERSARY =================

  useEffect(() => {
    if (maritalStatus === "Single") {
      setValue("anniversary", null);
    }
  }, [maritalStatus, setValue]);

  // ================= RESET OTP =================

  const resetOtpState = (setVerified, setOtp, setShow) => {
    setVerified(false);
    setOtp("");
    setShow(false);
  };

  useEffect(() => {
    resetOtpState(setEmailVerified, setEmailOtp, setShowEmailOtp);
  }, [email]);

  useEffect(() => {
    resetOtpState(setMobileVerified, setMobileOtp, setShowMobileOtp);
  }, [mobile]);

  // ================= SPLIT NAME =================

  const splitName = (name = "") => {
    const [firstName, ...last] = name.trim().split(/\s+/);

    return {
      firstName: firstName || "",
      lastName: last.join(" "),
    };
  };

  // ================= RESET DATA =================

  useEffect(() => {
    if (!user) return;

    const nameData = splitName(user.name);

    reset({
      ...defaultValues,
      ...nameData,
      gender: user.gender || "",
      email: user.email || "",
      mobile: user.mobile || "",
      phoneCode: user.phoneCode || "+91",
      city: user.city || "",
      state: user.state || "",
      nationality: user.nationality || "",
      maritalStatus: user.maritalStatus || "",
      dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
      anniversary: user.anniversary ? dayjs(user.anniversary) : null,
    });
  }, [user, reset]);

  // ================= PAYLOAD =================

  const buildPayload = (data, user) => ({
    name: [data.firstName, data.lastName].filter(Boolean).join(" "),
    email: data.email,
    mobile: data.mobile,
    gender: data.gender,
    city: data.city,
    state: data.state,
    nationality: data.nationality,
    maritalStatus: data.maritalStatus,
    dateOfBirth: data.dateOfBirth
      ? dayjs(data.dateOfBirth).toISOString()
      : user?.dateOfBirth || null,
    anniversary: data.anniversary
      ? dayjs(data.anniversary).toISOString()
      : null,
  });

  // ================= SUBMIT =================

  const originalEmail = user?.email || "";
  const originalMobile = user?.mobile || "";
  const emailChanged = formValues.email !== user?.email;
  const mobileChanged = formValues.mobile !== user?.mobile;

  const canSave =
    (!emailChanged || emailVerified) && (!mobileChanged || mobileVerified);

  const onSubmit = (data) => {
    const emailChanged = data.email !== originalEmail;
    const mobileChanged = data.mobile !== originalMobile;

    if (emailChanged && !emailVerified) {
      message.error("Please verify your email first.");
      return;
    }

    if (mobileChanged && !mobileVerified) {
      message.error("Please verify your mobile number first.");
      return;
    }

    updateProfile.mutate(buildPayload(data, user), {
      onSuccess: () => {
        message.success("Profile updated successfully");
        setIsEdit(false);
      },
      onError: () => {
        message.error("Failed to update profile");
      },
    });
  };

  // ================= VIEW FIELD =================
  const phoneCode = formValues.phoneCode || "+91";
  return (
    <div className="min-h-screen shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
      <div className="bg-white p-5">
        <div className="mb-8! flex items-center justify-between">
          <h2 className="font-roboto! text-[20px] font-semibold text-[#1f1f1f]">
            Personal Information
          </h2>

          {!isEdit && (
            <Button
              icon={<EditOutlined className="buttion-color!" />}
              onClick={() => setIsEdit(true)}
              className="font-roboto! font-semibold!"
            >
              Edit Details
            </Button>
          )}
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6">
              {fields.map(
                ({ name, label, component: Component, type, props }) => (
                  <div key={name}>
                    {isEdit ? (
                      <Component name={name} label={label} {...props} />
                    ) : (
                      <ViewField
                        label={label}
                        value={formValues[name]}
                        type={type}
                      />
                    )}
                  </div>
                ),
              )}
            </div>

            <Divider className="my-8!" />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* EMAIL */}

              <div>
                {isEdit ? (
                  <VerifySection
                    name="email"
                    label="Email"
                    verified={emailVerified}
                    otp={emailOtp}
                    setOtp={setEmailOtp}
                    showOtp={showEmailOtp}
                    setShowOtp={setShowEmailOtp}
                    trigger={trigger}
                    formValues={formValues}
                    sendOtp={sendEmailOtp}
                    verifyOtp={verifyEmail}
                    setVerified={setEmailVerified}
                  />
                ) : (
                  <ViewField label="Email" value={formValues.email} />
                )}
              </div>

              {/* MOBILE */}

              <div>
                {isEdit ? (
                  <VerifySection
                    name="mobile"
                    label="Mobile Number"
                    verified={mobileVerified}
                    otp={mobileOtp}
                    setOtp={setMobileOtp}
                    showOtp={showMobileOtp}
                    setShowOtp={setShowMobileOtp}
                    trigger={trigger}
                    formValues={formValues}
                    sendOtp={sendMobileOtp}
                    verifyOtp={verifyMobile}
                    setVerified={setMobileVerified}
                  />
                ) : (
                  // <ViewField label="Mobile Number" value={formValues.mobile} />
                  <ViewField
                    label="Mobile Number"
                    value={formValues.mobile}
                    prefix={phoneCode}
                  />
                )}
              </div>
            </div>

            {isEdit && (
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setIsEdit(false)}
                  className="h-10.5! px-6!"
                >
                  Cancel
                </Button>

                <Button
                  htmlType="submit"
                  type="primary"
                  disabled={!canSave}
                  loading={updateProfile.isPending}
                  className="buttion-background-color h-10.5! border-none! px-6!"
                >
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
