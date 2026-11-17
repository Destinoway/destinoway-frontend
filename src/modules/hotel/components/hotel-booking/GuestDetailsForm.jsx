"use client";

import RHFInput from "@/components/ui/RHFinputs/RHFInput";
import RHFPhoneInput from "@/components/ui/RHFinputs/RHFPhoneInput";
import RHFSelect from "@/components/ui/RHFinputs/RHFSelect";
import SectionCard from "@/modules/hotel/components/hotels/viewhotles/HotelSections/SectionCard";
import {
  ContactsOutlined,
  DownOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getPrimaryGuestSchema } from "../../schema/guest.schema";

const GuestDetailsForm = forwardRef(
  ({ onSubmit, occupancy = [], isPANRequired = false }, ref) => {
    const [roomOccupancy, setRoomOccupancy] = useState([]);
    const [expandedRooms, setExpandedRooms] = useState({});

    useEffect(() => {
      const normalized = occupancy.map((room, index) => {
        const adults = Math.max(Number(room?.adults) || 0, 0);
        const children = Math.max(Number(room?.children) || 0, 0);

        return {
          roomNo: Number(room?.roomNo) || index + 1,
          adults,
          children,
        };
      });

      setRoomOccupancy(normalized);

      setExpandedRooms((previous) => {
        const next = {};

        normalized.forEach((room, index) => {
          next[room.roomNo] = previous[room.roomNo] ?? index === 0;
        });

        return next;
      });
    }, [occupancy]);

    const totalSelectedGuests = useMemo(
      () =>
        roomOccupancy.reduce(
          (total, room) =>
            total + (Number(room?.adults) || 0) + (Number(room?.children) || 0),
          0,
        ),
      [roomOccupancy],
    );

    const guestFields = useMemo(() => {
      const fields = [];

      roomOccupancy.forEach((room) => {
        const roomNo = Number(room?.roomNo) || 1;
        const adults = Math.max(Number(room?.adults) || 0, 0);
        const children = Math.max(Number(room?.children) || 0, 0);

        for (let index = 1; index <= adults; index += 1) {
          fields.push({
            key: `room-${roomNo}-adult-${index}`,
            roomNo,
            passengerTyp: `Adult ${index}`,
            isChild: false,
          });
        }

        for (let index = 1; index <= children; index += 1) {
          fields.push({
            key: `room-${roomNo}-child-${index}`,
            roomNo,
            passengerTyp: `Child ${index}`,
            isChild: true,
          });
        }
      });

      return fields;
    }, [roomOccupancy]);

    const defaultValues = useMemo(() => {
      const values = {
        bookingFor: "myself",
        customerAddress: "",
        customerState: "",
        customerCity: "",
        customerPostalCode: "",
        panNumber: "",
        customerEmail: "",
        customerMobile: "",
        customerPhoneCode: "+91",
        paxDetails: {},
      };

      guestFields.forEach((guest) => {
        values.paxDetails[guest.key] = {
          title: guest.isChild ? "Master" : "Mr",
          firstName: "",
          lastName: "",
        };
      });

      return values;
    }, [guestFields]);

    const methods = useForm({
      resolver: zodResolver(getPrimaryGuestSchema(isPANRequired)),
      defaultValues,
      mode: "onSubmit",
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
      reset(defaultValues);
    }, [defaultValues, reset]);

    const toggleRoom = (roomNo) => {
      setExpandedRooms((previous) => ({
        ...previous,
        [roomNo]: !previous[roomNo],
      }));
    };

    useImperativeHandle(ref, () => ({
      submitForm: () =>
        new Promise((resolve, reject) => {
          handleSubmit(
            (data) => {
              const paxDetails = guestFields.map((guest) => {
                const guestData = data?.paxDetails?.[guest.key] || {};

                return {
                  firstName: guestData?.firstName || "",
                  lastName: guestData?.lastName || "",
                  title: guestData?.title || "Mr",
                  isChild: guest.isChild,
                  roomNo: guest.roomNo,
                  passengerTyp: guest.passengerTyp,
                };
              });

              const guestData = {
                customerAddress: data?.customerAddress || "",
                customerState: data?.customerState || "",
                customerCity: data?.customerCity || "",
                customerPostalCode: data?.customerPostalCode || "",
                panNumber: isPANRequired ? data?.panNumber || "" : "",

                customerMobile: data?.customerMobile || "",
                customerEmail: data?.customerEmail || "",
                passengerEmail: data?.customerEmail || "",
                passengerMobile: data?.customerMobile || "",

                paxDetails,
                occupancy: roomOccupancy,
              };

              onSubmit?.(guestData);
              resolve(guestData);
            },
            (errors) => {
              reject(errors);
            },
          )();
        }),
    }));

    return (
      <SectionCard
        icon={<UserOutlined />}
        title="Guest Details"
        subtitle="Enter names exactly as they appear on the official ID"
        action={
          <span className="rounded-full bg-(--theme-secondary)/8 px-3 py-1 text-[12px] font-bold text-(--theme-secondary)">
            {totalSelectedGuests}{" "}
            {totalSelectedGuests === 1 ? "Guest" : "Guests"}
          </span>
        }
      >
        <FormProvider {...methods}>
          <form className="space-y-5">
            <div className="space-y-3">
              {roomOccupancy.map((room) => {
                const roomNo = Number(room?.roomNo) || 1;
                const adultCount = Number(room?.adults) || 0;
                const childCount = Number(room?.children) || 0;
                const roomGuests = guestFields.filter(
                  (guest) => guest.roomNo === roomNo,
                );
                const isExpanded = expandedRooms[roomNo];

                return (
                  <div
                    key={roomNo}
                    className={`overflow-hidden rounded-xl border transition ${
                      isExpanded
                        ? "border-(--theme-secondary)/30"
                        : "border-gray-200"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={Boolean(isExpanded)}
                      onClick={() => toggleRoom(roomNo)}
                      className="flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-slate-50! px-4 py-3.5 text-left sm:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[13px] font-bold text-(--theme-secondary) shadow-sm">
                          {roomNo}
                        </span>
                        <div className="min-w-0">
                          <p className="m-0 text-[15px] font-bold text-(--theme-text-primary)">
                            Room {roomNo}
                          </p>
                          <p className="m-0 text-[12px] text-gray-500">
                            {adultCount} {adultCount === 1 ? "Adult" : "Adults"}
                            {childCount > 0
                              ? ` · ${childCount} ${
                                  childCount === 1 ? "Child" : "Children"
                                }`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white">
                        <DownOutlined
                          className={`text-[11px] text-gray-500 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </span>
                    </button>

                    <div className={isExpanded ? "block" : "hidden"}>
                      <div className="divide-y divide-gray-100 px-4 sm:px-5">
                        {roomGuests.map((guest) => (
                          <div key={guest.key} className="py-4">
                            <p className="m-0 mb-3 text-[12px] font-bold tracking-[0.06em] text-gray-500 uppercase">
                              {guest.passengerTyp}
                            </p>
                            <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3 sm:grid-cols-[120px_minmax(0,1fr)_minmax(0,1fr)] sm:gap-4">
                              <RHFSelect
                                name={`paxDetails.${guest.key}.title`}
                                label="Title"
                                options={
                                  guest.isChild
                                    ? [
                                        { label: "Master", value: "Master" },
                                        { label: "Miss", value: "Miss" },
                                      ]
                                    : [
                                        { label: "Mr", value: "Mr" },
                                        { label: "Mrs", value: "Mrs" },
                                        { label: "Miss", value: "Miss" },
                                      ]
                                }
                              />

                              <RHFInput
                                name={`paxDetails.${guest.key}.firstName`}
                                label="First Name"
                              />

                              <div className="col-span-2 sm:col-span-1">
                                <RHFInput
                                  name={`paxDetails.${guest.key}.lastName`}
                                  label="Last Name"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-slate-50 px-4 py-3.5 sm:px-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-(--theme-secondary) shadow-sm">
                  <ContactsOutlined />
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-[15px] font-bold text-(--theme-text-primary)">
                    Contact Information
                  </p>
                  <p className="m-0 text-[12px] text-gray-500">
                    Your booking voucher will be sent here
                  </p>
                </div>
              </div>

              <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-2">
                <RHFInput name="customerEmail" label="Email" />
                <RHFPhoneInput
                  name="customerMobile"
                  codeName="customerPhoneCode"
                  label="Mobile No."
                />
                <RHFInput name="customerAddress" label="Address" />
                <RHFInput name="customerCity" label="City" />
                <RHFInput name="customerState" label="State" />
                <RHFInput name="customerPostalCode" label="Postal Code" />
                {isPANRequired && (
                  <RHFInput name="panNumber" label="PAN Number" />
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </SectionCard>
    );
  },
);

GuestDetailsForm.displayName = "GuestDetailsForm";

export default GuestDetailsForm;
