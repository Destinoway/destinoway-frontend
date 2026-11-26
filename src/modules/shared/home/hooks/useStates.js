import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStatesApi } from "../services/state.api";

export const useStates = (countryCode, search = "") => {
  return useQuery({
    queryKey: ["states", countryCode, search],
    queryFn: () => getStatesApi(countryCode, search),
    enabled: Boolean(countryCode),
    staleTime: 1000 * 60 * 5,
    placeholderData: keepPreviousData,
  });
};
