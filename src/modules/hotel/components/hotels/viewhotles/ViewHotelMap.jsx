import React from "react";

const ViewHotelMap = () => {
  return (
    <div className="rounded-lg overflow-hidden border">
      <iframe
        title="map"
        src="https://www.google.com/maps?q=Candolim,Goa&output=embed"
        className="w-full h-50"
      />
    </div>
  );
};

export default ViewHotelMap;