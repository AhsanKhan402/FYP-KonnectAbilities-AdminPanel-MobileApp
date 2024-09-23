import axios from "axios";
import { message, Modal } from "antd";
const apiRequest = async function (urlType, options, router) {
  const authToken = await localStorage.getItem("@auth_token");
  const onSuccess = (response) => {
    return response.data;
  };
  const onError = async (error) => {
    console.log(error)
    if (
      error?.response?.status === 400 ||
      error?.response?.status === 404 ||
      error?.response?.status === 403
    ) {
      Modal.error({
        title: "Error",
        content: error?.response?.data?.message
          ? error?.response?.data?.message
          : error?.message,
      });
    } else if (error?.response?.status === 304) {
      return error?.response?.status;
    } else if (error?.response?.status === 302) {
      Modal.warning({
        title: "Warning",
        content: error?.response?.data
          ? error?.response?.data
          : error?.response?.data?.message,
      });
    } else if (error?.response?.status === 401) {
      message.warning(error.response.data);
      await localStorage.removeItem("@admin");
      await localStorage.removeItem("@auth_token");
      router.push("/");
    } else if (error?.response?.status === 500) {
      Modal.error({
        title: "Error",
        content: error?.response?.data.error
          ? error?.response?.data.error
          : `Appologies! There is something on our side. We're working on it`,
      });
    }
    return false;
  };

  return axios({
    baseURL: `${urlType}`,
    ...options,
    headers: { Authorization: `${authToken}` },
  })
    .then(onSuccess)
    .catch(onError);
};
export default apiRequest;
