import { message } from "antd";
import { buildHotelUrl } from "./buildHotelUrl";

export const shareHotel = async ({
  hotelName,
  cityName,
  hotelId,
  searchId,
  supplierHotelId,
  hotelDetailId,
}) => {
  try {
    const hotelUrl = buildHotelUrl({
      hotelName,
      cityName,
      hotelId,
      searchId,
      supplierHotelId,
      hotelDetailId,
    });

    if (!hotelUrl) {
      message.error("Unable to generate hotel link");
      return;
    }

    const shareData = {
      title: hotelName,
      text: `Check out ${hotelName}${
        cityName ? ` in ${cityName}` : ""
      } on Destonoway.`,
      url: hotelUrl,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(hotelUrl);
    message.success("Hotel link copied to clipboard");
  } catch (error) {
    if (error?.name === "AbortError") return;
    message.error("Unable to share hotel");
  }
};
