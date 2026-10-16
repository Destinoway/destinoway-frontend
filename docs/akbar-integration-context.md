# Akbar Travels / Benzy hotel integration context

This is a code-verified description of the hotel flow in this frontend. The frontend calls the application backend through the shared Axios client; it does not call a supplier host directly. Code does not establish which backend route is implemented by Akbar Travels versus Benzy, or whether all routes proxy the same supplier. Supplier attribution beyond the integration label is **unknown**.

Only fields explicitly constructed, read, or validated by the frontend are described. Backend-only behavior and fields not consumed by this code are **unknown**. No environment values, credentials, or tokens are included.

## Complete flow

1. **Destination autocomplete (optional):** searchDestinationApi trims input and skips requests shorter than two characters. It POSTs to /destination/search with { searchInput }. It expects success: true and data as an array.
2. **Start search:** useInfiniteHotels requires locationId, geoCode.lat, geoCode.long, checkIn and checkOut. It starts search with POST /hotelSearch/search, passing the search payload plus currency. Filter and sort fields are removed. A successful response must have success: true and message.searchId.
3. **Fetch results:** GET /hotelSearch/search/{searchId}, query parameters page, limit (default 20), active filters and sorting. Arrays starRatings, amenities, propertyType and chainProperties are comma-joined. Empty/null/undefined/false are omitted; zero remains. Reads data.items and data.pagination.page / hasMore.
4. **Hotel content and rooms:** using searchId and supplierHotelId, details load in parallel:
   - GET /hotelDetails/search/{searchId}/{supplierHotelId}/content
   - GET /hotelDetails/search/{searchId}/{supplierHotelId}/rooms?page={page}&limit=20
5. **Select room and verify price:** recommendationId identifies the selected recommendation. Booking navigation carries searchId, supplierHotelId, recommendationId, roomId (equal to recommendationId), and optionally hotelDetailId. Booking page calls POST /hotelDetails/search/{searchId}/{supplierHotelId}/price-check with { recommendationId }.
6. **Create itinerary:** buildBookingPayload constructs guest/contact data and special requests. POST /hoteltempBooking/search/{searchId}/{supplierHotelId}/itinerary is called; searchId and supplierHotelId are path fields, not body fields. The response is searched for a booking reference and navigation continues to /hotel-checkout?bookingRefNo=...
7. **Checkout and coupon:** GET /get-booking-details/{bookingRefNo}. Coupon apply is PATCH /hotel-temp-booking/couponApply with { tempBookingId, couponCode }; removal is PUT /hotel-temp-booking/couponRemove with { tempBookingId }. ID uses response tempBookingId, falling back to bookingId.
8. **Balance then ticketing:** the active HotelCheckout implementation POSTs /AddBalance with { BookingRefNo }. Only data.Response_Header.Status_Id equal to "11" proceeds. It then POSTs /HotelTicketing with { BookingRefNo, SearchKey }. Only data.ResponseHeader.StatusId equal to "11" proceeds. SearchKey comes from persisted bookingData.selectedHotel.searchKey. Success stores ticketResponse.data and navigates to /hotel-booking-success.
9. **Success/account support:** the success page can load booking details by bookingRefNo. Account support calls GET /hotel/mybookings (optional bookingRefNo query), GET /hotel/invoice/{bookingRefNo}, and POST /hotel/cancel with { bookingRefNo }. The frontend does not establish these endpoints' supplier relationship.

## Endpoint and payload inventory

Paths below are relative to the shared backend API base configured in src/services/axios.js. The configured deployment URL is intentionally omitted.

| Method / path | Request | Response use verified in frontend |
|---|---|---|
| POST /destination/search | { searchInput } | success true and data array required |
| POST /hotelSearch/search | Search criteria with filter keys removed; useInfiniteHotels adds currency. Required hook criteria: locationId, geoCode { lat, long }, checkIn, checkOut. Complete schema unknown. | success true and message.searchId required |
| GET /hotelSearch/search/{searchId} | Query page, limit; filters hotelName, search, minPrice, maxPrice, starRatings, starRating, starCategory, amenities, facility, minReviewRating, propertyType, chainProperties, availableOnly, isRecommended, freeCancellation, freeBreakfast; sorting sortBy, sortOrder | success true; reads data.items and data.pagination |
| GET /hotelDetails/search/{searchId}/{supplierHotelId}/content | No body | success true and data.content.data.hotel required |
| GET /hotelDetails/search/{searchId}/{supplierHotelId}/rooms | Query page, limit; defaults 1, 20 | success true and data.rooms.recommendations array required |
| POST /hotelDetails/search/{searchId}/{supplierHotelId}/price-check | { recommendationId } | success true, data, and nonempty data.pricing.rooms required |
| POST /hoteltempBooking/search/{searchId}/{supplierHotelId}/itinerary | { recommendationId, contactInfo, rooms, specialServiceRequest }. contactInfo: { title, firstName, lastName, mobile, email, address, state, city, pin }. rooms: array of { adults: [{ title, firstName, lastName }], children: [{ title, firstName, lastName }] }. specialServiceRequest is a comma-separated string. | success false throws using message. Reference extraction accepts casing/nesting variants listed below. Canonical response schema unknown. |
| GET /get-booking-details/{bookingRefNo} | No body | response.data returned; checkout reads data.data; coupon ID uses tempBookingId or bookingId |
| PATCH /hotel-temp-booking/couponApply | { tempBookingId, couponCode } | response.data; full schema unknown |
| PUT /hotel-temp-booking/couponRemove | { tempBookingId } | response.data; full schema unknown |
| POST /AddBalance | { BookingRefNo } | reads data.Response_Header.Status_Id and Error_InnerException; "11" means success in frontend |
| POST /HotelTicketing | { BookingRefNo, SearchKey } | reads data.ResponseHeader.StatusId and ErrorDesc; "11" means success in frontend |
| GET /hotel/mybookings | Optional query bookingRefNo | returns response.data.data |
| GET /hotel/invoice/{bookingRefNo} | No body; blob response | invoice blob |
| POST /hotel/cancel | { bookingRefNo } | response.data; further semantics unknown |

## Frontend response mapping

### Search cards

mapHotelsForCard reads identity from supplierHotelId variants, id, hotelId / HotelId, optional hotelDetailId variants, and searchId (with current search ID fallback). It maps name variants; address/city/state/country; geoCode or latitude/longitude; price.basePrice, taxes, totalPrice, currency, with pricing fallbacks; userReview/rating and reviewCount; starRating; facilities; propertyType; recommendation, rooms-left, cancellation flags; and image variants. Missing images use a frontend fallback image. The full backend result schema is unknown.

### Content and room recommendations

HotelContentApi requires data.content.data.hotel. mapHotelDetailsResponse reads hotel id, name, starRating, heroImage/images, contact.address and phones, geoCode, descriptions, facilities, checkinInfo, checkoutInfo, fees and policies. It also reads response stayPeriod, occupancies and supplier.

Rooms are read from data.rooms.recommendations. Recommendation IDs accept recommendationId variants or id. roomGroup can be object or array. Room/group/recommendation fields map to name, description, images, availability, refundability, policies, board basis, facilities, occupancy limits and price. Base, total, tax and currency are read from room group then recommendation according to mapper logic.

### Price check

normalizeRoomPriceCheckResponse reads data.pricing.rooms[]. It maps name to roomType, boardBasis to inclusion, occupancies to guests, and price.baseRate / totalRate / currency to display pricing. Tax is max(totalRate - baseRate, 0). It also maps hotel name/address/star category/facilities, stay dates, refundability and recommendationId.

### Itinerary response and ticketing

The itinerary response is not normalized into one schema. HotelBookingContent probes for BookingRefNo or bookingRefNo under response.data.data, response.data, or root, then bookingId or transactionId under those same levels. If none is found, checkout navigation is stopped. Backend canonical response shape is unknown.

Checkout passes bookingRefNo as BookingRefNo to both balance and ticketing. SearchKey is sourced from selectedHotel.searchKey; mapHotelDetailsResponse sets searchKey from hotel response data.searchId. Whether supplier-side SearchKey is guaranteed to equal searchId is unknown.

## Identifiers and dependencies

- searchId is created by search start and is required for result retrieval, content/rooms, price check and itinerary path. Hotel detail mapping also exposes it as searchKey for ticketing.
- supplierHotelId is the selected property identifier paired with searchId for detail, price and itinerary calls.
- recommendationId selects the room recommendation and is sent to price check and itinerary. roomId navigation parameter duplicates it. Supplier-side meaning is unknown.
- hotelDetailId is optional and carried in URLs/normalized state, but the shown price-check and itinerary services do not send it.
- bookingRefNo is extracted from itinerary response and drives details, balance, ticketing and later lookup.
- tempBookingId / bookingId comes from booking details for coupon actions; exact semantics unknown.
- SearchKey is populated from selected hotel searchKey (mapped from searchId); supplier equivalence is unknown.

IDs move through query parameters and persisted Zustand state. A hotel session recovery hook exists, but supplier session semantics are unknown.

## Loading, errors and retries

- Search start and results disable retries and refetch on mount, focus and reconnect. Start requires location ID, coordinates and dates; results are enabled after searchId. Results paginate via hasMore.
- Content and rooms use five-minute stale time and disable focus/reconnect refetch. Their hooks retain React Query default retries. Room pages use data.rooms.pagination.hasMore.
- Price-check has staleTime zero and disables focus/reconnect refetch; retry is not overridden. Missing identifiers disable it and booking page redirects to /hotels. Errors show a back-to-hotels action, not an explicit retry.
- Itinerary, coupon, balance and ticketing use mutations. Duplicate itinerary submits are blocked while pending and with a ref; errors release the ref to allow retry. Errors are displayed with backend message or fallback.
- Booking details query has five-minute stale time, retry 1, and focus refetch disabled; checkout error state offers refetch.
- Coupon success invalidates booking-details cache. Balance and ticketing run sequentially; non-"11" stops the chain. No automatic payment/ticketing retry is shown.
- Axios adds cached bearer authorization when present and a currency header. On HTTP 401 it attempts session refresh; refresh failure clears cached session and signs out. Secret values are not documented.

## Frontend versus backend responsibilities

**Verified frontend responsibilities:** collect search criteria, filters and guests; call backend routes; map responses; preserve IDs; recheck selected price; collect guest/contact/special requests; create itinerary; load booking details; apply/remove coupons; invoke balance then ticketing; interpret the status fields; render loading/error states.

**Backend responsibilities inferred from the API boundary:** expose these routes; validate requests; perform supplier search/content/room/price/itinerary and payment/ticketing operations as applicable; return IDs and response shapes consumed here; support booking details, coupons and account APIs. Backend source is absent. Exact supplier calls, credential handling, persistence, price locking, settlement meaning, idempotency, retry policy, cancellation/refund rules, and status definitions beyond the UI's "11" check are unknown.

## Admin dashboard integration notes

The dashboard should integrate with backend APIs, not call supplier APIs based on this frontend. Verified useful data and capabilities are searchId, supplierHotelId, recommendationId, stay dates, occupancy, currency, bookingRefNo, booking details, coupon IDs, balance/ticketing status/error fields, booking history, invoice and cancellation endpoints. The frontend establishes no admin-specific API.

Confirm with backend owners before implementation: admin authentication/roles; whether user routes are permitted for operators; admin-only endpoints; canonical casing and data model; booking state machine; supplier reference IDs; idempotency and safe retry rules; refund/cancellation side effects; audit log API; admin search/filter/pagination; and whether SearchKey always equals searchId. Do not infer endpoints or permissions from this repository.

## Relevant files and functions

| Area | Source |
|---|---|
| Shared client | src/services/axios.js — Axios configuration and interceptors |
| Destination/search | src/modules/hotel/services/search.api.js — searchDestinationApi; src/modules/hotel/services/hotel.service.js — startHotelSearch, getHotelSearchResults; src/modules/hotel/hooks/useInfiniteHotels.js |
| Search mapping | src/modules/hotel/utils/mapHotelsForCard.js — mapHotelsForCard; src/modules/hotel/components/hotels/HotelList.jsx |
| Details/rooms | src/modules/hotel/services/hotelDetail.service.js — HotelContentApi, HotelRoomsApi; src/modules/hotel/hooks/useHotelDetails.js; src/modules/hotel/hooks/useHotelDetailsPage.js; src/modules/hotel/utils/mapHotelDetailsResponse.js — mapHotelDetailsResponse, mapRatePlan |
| Price check | src/modules/hotel/services/roomPricing.service.js — checkRoomPrice; src/modules/hotel/hooks/useRoomPricing.js; src/modules/hotel/utils/normalizeRoomPriceCheckResponse.js; src/modules/hotel/pages/HotleBooking.jsx |
| Itinerary | src/modules/hotel/utils/buildBookingPayload.js — buildBookingPayload; src/modules/hotel/services/booking.service.js — createBooking; src/modules/hotel/hooks/useHotelBooking.js; src/modules/hotel/components/hotel-booking/HotelBookingContent.jsx |
| Checkout | src/modules/hotel/services/hotelCheckout.service.js — getBookingDetails, applyCoupon, removeCoupon; src/modules/hotel/services/addBalance.service.js — addBalance; src/modules/hotel/services/hotelTicketing.service.js — hotelTicketing; src/modules/hotel/pages/HotelCheckout.jsx |
| State/account | src/modules/hotel/store/booking.store.js; src/modules/hotel/pages/HotelBookingSuccess.jsx; src/modules/profile/api/booking.api.js — getMyBookingsApi, downloadInvoiceApi, cancelBookingApi; src/modules/profile/hooks/useMyBookings.js |

## Separate payment endpoints observed

src/modules/payments/services/payment.api.js defines POST /payment/create-booking and POST /payment/booking-payment-verify, with Razorpay-related hooks. HotelCheckout does not call them; its observed sequence is /AddBalance followed by /HotelTicketing. Relationship to the Akbar/Benzy path and those endpoints' schemas are unknown.

