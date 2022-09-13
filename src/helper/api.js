import axios from "axios";

const baseUrl = "https://40060bec-d8e7-4ad2-96c2-63b9fdb4ef24.mock.pstmn.io/";
const api = async (method = "GET", path, params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${baseUrl}${path}`,
      header: {
        // "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
      },
      data: params,
    });
    //
    return response.data;
  } catch (error) {
    return error;
  }
};

export default api;
