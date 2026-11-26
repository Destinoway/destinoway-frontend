import { useMutation } from "@tanstack/react-query";
import { initiateBusSearchApi } from "../services/bus-search.service";

export const useBusSearch = () => {
  return useMutation({
    mutationFn: ({ from, to, onward, signal }) =>
      initiateBusSearchApi(from, to, onward, signal),
  });
};
