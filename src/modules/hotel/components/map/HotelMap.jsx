"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

function FitBounds({ hotels }) {
  const map = useMap();

  useMemo(() => {
    if (!hotels?.length) return;

    const bounds = hotels.map((hotel) => [
      Number(hotel.latitude),
      Number(hotel.longitude),
    ]);

    map.fitBounds(bounds, {
      padding: [50, 50],
    });
  }, [hotels, map]);

  return null;
}

export default function HotelMap({ hotels = [] }) {
  const validHotels = useMemo(() => {
    return hotels.filter(
      (hotel) =>
        hotel.latitude &&
        hotel.longitude &&
        !Number.isNaN(Number(hotel.latitude)) &&
        !Number.isNaN(Number(hotel.longitude)),
    );
  }, [hotels]);

  const center = useMemo(() => {
    if (!validHotels.length) {
      return [28.6139, 77.209];
    }

    return [Number(validHotels[0].latitude), Number(validHotels[0].longitude)];
  }, [validHotels]);

  const createPriceIcon = (price) =>
    L.divIcon({
      className: "",
      html: `
        <div
          style="
            background:#ffffff;
            border:2px solid #0077b6;
            border-radius:999px;
            padding:6px 12px;
            font-size:13px;
            font-weight:700;
            color:#0077b6;
            white-space:nowrap;
            box-shadow:0 4px 12px rgba(0,0,0,0.15);
            cursor:pointer;
          "
        >
          ₹${Math.round(price)}
        </div>
      `,
      iconSize: [80, 36],
      iconAnchor: [40, 18],
    });

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds hotels={validHotels} />

        {validHotels.map((hotel) => (
          <Marker
            key={hotel.id}
            position={[Number(hotel.latitude), Number(hotel.longitude)]}
            icon={createPriceIcon(hotel.price)}
          >
            <Tooltip
              direction="top"
              offset={[0, -20]}
              opacity={1}
              sticky
              className="hotel-tooltip"
            >
              <div className="flex w-auto overflow-hidden rounded border border-gray-100 bg-white shadow-xl">
                {/* IMAGE */}
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-30 shrink-0 object-cover"
                />

                {/* DETAILS */}
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <h3 className="line-clamp-1 text-[14px] leading-5 font-bold! text-gray-900">
                      {hotel.name}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-[12px] leading-4 text-gray-500">
                      {hotel.location || hotel.address}
                    </p>
                  </div>

                  <div className="mb-0 flex items-end justify-between">
                    <div>
                      <div className="text-[16px] leading-none font-bold text-gray-900">
                        ₹{hotel.price?.toLocaleString("en-IN")}
                      </div>

                      <div className="mt-1 text-[10px] text-gray-500">
                        Per Night
                      </div>
                    </div>

                    <div className="rounded-md bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-600">
                      ⭐ {hotel.rating || 0}
                    </div>
                  </div>
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
