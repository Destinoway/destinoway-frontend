"use client";

import {
  CheckCircleFilled,
  CheckOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
  genderOptions,
  maritalStatusOptions,
} from "@/modules/shared/home/components/data/profileData";

import RHFPhoneInput from "@/components/ui/RHFinputs/RHFPhoneInput";
import { useCountries } from "@/modules/shared/home/hooks/useCountries";
import { useCities } from "@/modules/shared/home/hooks/useCities";
import { useStates } from "@/modules/shared/home/hooks/useStates";
import { profileSchema } from "../schema/profileValidation";

// Delays API searches until the user stops typing.
const useDebouncedValue = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

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

const getApiError = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const VerifySection = ({
  name,
  label,
  changed,
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
  const value = formValues[name];
  const target =
    name === "mobile" ? `${formValues.phoneCode || ""} ${value}` : value;

  // Unchanged saved value counts as already verified.
  const isVerified = verified || (!changed && Boolean(value));

  const handleSendOtp = async () => {
    if (sendOtp.isPending) return;

    const valid = await trigger(name);
    if (!valid) return;

    sendOtp.mutate(
      { [name]: value },
      {
        onSuccess: (res) => {
          setOtp("");
          setShowOtp(true);
          message.success(res?.data?.message || `OTP sent to ${target}`);
        },
        onError: (error) => {
          message.error(getApiError(error, "Unable to send OTP"));
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    if (verifyOtp.isPending) return;

    if (otp.length !== 6) {
      message.error("Please enter the 6-digit OTP");
      return;
    }

    verifyOtp.mutate(
      { [name]: value, otp },
      {
        onSuccess: (res) => {
          setVerified(true);
          setShowOtp(false);
          setOtp("");
          message.success(res?.data?.message || `${label} verified`);
        },
        onError: (error) => {
          message.error(getApiError(error, "Invalid or expired OTP"));
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* items-start keeps the button level with the input even when a
          validation error appears below the input. */}
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {name === "mobile" ? (
            <RHFPhoneInput name="mobile" codeName="phoneCode" label={label} />
          ) : (
            <RHFInput name={name} label={label} />
          )}
        </div>

        {isVerified ? (
          <span className="flex h-11 shrink-0 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-[13px] font-semibold text-emerald-700 sm:px-4">
            <CheckCircleFilled />
            <span className="max-[380px]:hidden">Verified</span>
          </span>
        ) : (
          <Button
            onClick={handleSendOtp}
            loading={sendOtp.isPending}
            disabled={showOtp}
            className="h-11! shrink-0 rounded-lg! border-(--theme-secondary)! px-4! text-[14px]! font-semibold! text-(--theme-secondary)! hover:bg-(--theme-secondary)/5! disabled:border-gray-200! disabled:text-gray-400! sm:px-5!"
          >
            Verify
          </Button>
        )}
      </div>

      {showOtp && !isVerified && (
        <div className="rounded-xl border border-[#E5EEF7] bg-[#FAFCFF] p-4">
          <p className="mb-0! text-[14px] font-semibold text-[#05144b]">
            Enter verification code
          </p>
          <p className="mt-0.5 mb-3! text-[13px] break-all text-gray-500">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-700">{target}</span>
          </p>

          {/* Boxes shrink to fit the card; the tick button stays fixed. */}
          <div className="flex items-center gap-2">
            <Input.OTP
              length={6}
              value={otp}
              onChange={(val) => setOtp(val.replace(/\D/g, ""))}
              formatter={(val) => val.replace(/\D/g, "")}
              className="min-w-0 flex-1 gap-1.5! sm:gap-2! [&_.ant-otp-input]:h-11! [&_.ant-otp-input]:w-auto! [&_.ant-otp-input]:max-w-11 [&_.ant-otp-input]:min-w-0 [&_.ant-otp-input]:flex-1 [&_.ant-otp-input]:rounded-lg! [&_.ant-otp-input]:px-0! [&_.ant-otp-input]:text-[16px]! [&_.ant-otp-input]:font-semibold!"
            />

            <Button
              type="primary"
              aria-label="Confirm OTP"
              title="Confirm OTP"
              onClick={handleVerifyOtp}
              loading={verifyOtp.isPending}
              icon={!verifyOtp.isPending && <CheckOutlined />}
              className="buttion-background-color h-11! w-11! shrink-0 rounded-lg! border-none! p-0! text-[18px]!"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendOtp.isPending}
              className="cursor-pointer font-semibold text-(--theme-secondary) hover:underline disabled:cursor-wait disabled:opacity-60"
            >
              {sendOtp.isPending ? "Sending..." : "Resend code"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowOtp(false);
                setOtp("");
              }}
              className="cursor-pointer text-gray-500 hover:text-gray-700"
            >
              Change {label.toLowerCase()}
            </button>
          </div>
        </div>
      )}
    </div>
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

const profileFields = ({
  selectedCountry,
  countryOptions,
  countriesLoading,
  onCountrySearch,
  onCountryOpenChange,
  stateOptions,
  statesLoading,
  onStateSearch,
  onStateOpenChange,
  selectedState,
  cityOptions,
  citiesLoading,
  onCitySearch,
  onCityOpenChange,
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
      options: countryOptions,
      loading: countriesLoading,
      showSearch: { onSearch: onCountrySearch, filterOption: false },
      onOpenChange: onCountryOpenChange,
      notFoundContent: countriesLoading ? "Loading..." : "No countries found",
    },
  },
  {
    name: "state",
    label: "State",
    component: RHFSelect,
    props: {
      placeholder: selectedCountry ? "Select State" : "Select Country First",
      disabled: !selectedCountry,
      options: stateOptions,
      loading: statesLoading,
      showSearch: { onSearch: onStateSearch, filterOption: false },
      onOpenChange: onStateOpenChange,
      notFoundContent: statesLoading ? "Loading..." : "No states found",
    },
  },
  {
    name: "city",
    label: "City",
    component: RHFSelect,
    props: {
      placeholder: selectedState ? "Select City" : "Select State First",
      disabled: !selectedState,
      options: cityOptions,
      loading: citiesLoading,
      showSearch: { onSearch: onCitySearch, filterOption: false },
      onOpenChange: onCityOpenChange,
      notFoundContent: citiesLoading ? "Loading..." : "No cities found",
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

  // ================= COUNTRY OPTIONS (API) =================

  const [countrySearch, setCountrySearch] = useState("");
  const debouncedCountrySearch = useDebouncedValue(countrySearch);

  // Full list (same cached query the phone input uses) — needed to map the
  // selected country name to its code for the states API.
  const { data: allCountries = [] } = useCountries("");
  const { data: countries = [], isFetching: countriesLoading } = useCountries(
    debouncedCountrySearch,
  );

  const countryOptions = useMemo(
    () =>
      countries.map((country) => ({
        label: country.countryName,
        value: country.countryName,
      })),
    [countries],
  );

  const selectedCountryCode = useMemo(
    () =>
      allCountries.find((country) => country.countryName === selectedCountry)
        ?.countryCode,
    [allCountries, selectedCountry],
  );

  // ================= STATE OPTIONS (API) =================

  const [stateSearch, setStateSearch] = useState("");
  const debouncedStateSearch = useDebouncedValue(stateSearch);

  const { data: states = [], isFetching: statesLoading } = useStates(
    selectedCountryCode,
    debouncedStateSearch,
  );

  const stateOptions = useMemo(
    () =>
      states.map((state) => ({
        label: state.stateName,
        value: state.stateName,
      })),
    [states],
  );

  // ================= CITY OPTIONS (API) =================

  const [citySearch, setCitySearch] = useState("");
  const debouncedCitySearch = useDebouncedValue(citySearch);

  const { data: cities = [], isFetching: citiesLoading } = useCities(
    selectedCountryCode,
    selectedState,
    debouncedCitySearch,
  );

  const cityOptions = useMemo(() => {
    const names = cities
      .map((city) => city.cityName || city.name || city.city)
      .filter(Boolean);

    // De-duplicate so antd doesn't get repeated option keys.
    return [...new Set(names)].map((name) => ({ label: name, value: name }));
  }, [cities]);

  const fields = useMemo(
    () =>
      profileFields({
        selectedCountry,
        countryOptions,
        countriesLoading,
        onCountrySearch: setCountrySearch,
        // Reset the search so reopening shows the full list again.
        onCountryOpenChange: (open) => !open && setCountrySearch(""),
        stateOptions,
        statesLoading,
        onStateSearch: setStateSearch,
        onStateOpenChange: (open) => !open && setStateSearch(""),
        selectedState,
        cityOptions,
        citiesLoading,
        onCitySearch: setCitySearch,
        onCityOpenChange: (open) => !open && setCitySearch(""),
        maritalStatus,
      }),
    [
      selectedCountry,
      countryOptions,
      countriesLoading,
      stateOptions,
      statesLoading,
      selectedState,
      cityOptions,
      citiesLoading,
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

            {isEdit && (
              <div className="mb-5">
                <h3 className="font-roboto! mb-0! text-[16px] font-semibold text-[#1f1f1f]">
                  Contact Details
                </h3>
                <p className="mt-0.5 mb-0! text-[13px] text-gray-500">
                  Changed email or mobile number must be verified with an OTP
                  before saving.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
              {/* EMAIL */}

              <div>
                {isEdit ? (
                  <VerifySection
                    name="email"
                    label="Email"
                    changed={emailChanged}
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
                    changed={mobileChanged}
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
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                <Button
                  onClick={() => setIsEdit(false)}
                  className="h-11! rounded-lg! px-6! text-[14px]! font-semibold!"
                >
                  Cancel
                </Button>

                <Button
                  htmlType="submit"
                  type="primary"
                  disabled={!canSave}
                  loading={updateProfile.isPending}
                  className="buttion-background-color h-11! rounded-lg! border-none! px-6! text-[14px]! font-semibold! disabled:opacity-60!"
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
