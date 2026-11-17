export const MAX_ROOMS = 8;

export const DEFAULT_GUEST_VALUE = {
  rooms: 1,
  adults: 2,
  children: 0,
  childAges: [],
  pets: false,
  roomGuests: [
    {
      adults: 2,
      children: [],
    },
  ],
};

export const CHILD_AGES = Array.from({ length: 18 }, (_, index) => index);
