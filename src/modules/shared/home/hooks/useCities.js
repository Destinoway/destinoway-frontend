import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCitiesApi } from "../services/city.api";

export const useCities = (countryCode, state, search = "") => {
  return useQuery({
    queryKey: ["cities", countryCode, state, search],
    queryFn: () => getCitiesApi(countryCode, state, search),
    enabled: Boolean(countryCode && state),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
