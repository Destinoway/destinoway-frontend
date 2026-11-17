import { serverApi } from "@/services/serverApi";

/*
GET HOME CONTENT
*/
export const getHomeContent = async () => {
  const response = await serverApi.get("/homecontent");

  return response?.data?.data;
};
