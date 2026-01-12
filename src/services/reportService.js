import axiosInstance from "./api";

const reportService = {
  createResult: async (payload) => {
    const response = await axiosInstance.post("/reports/", payload);
    return response.data;
  },
};

export default reportService;
