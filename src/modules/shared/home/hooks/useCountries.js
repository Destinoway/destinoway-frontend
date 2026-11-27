import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCountriesApi } from "../services/country.api";

export const useCountries = (search = "") => {
  return useQuery({
    queryKey: ["countries", search],
    queryFn: () => getCountriesApi(search),
    staleTime: 1000 * 60 * 5,
    // Keep the last list on screen while a new search loads.
    placeholderData: keepPreviousData,
  });
};