import axios from 'axios';
import { getCookie } from '../CookieHelper';
export const getProfileBase64 = async (token) => {
    const graphEndpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";
    try {
        const response = await axios(graphEndpoint, { headers: { Authorization: `Bearer ${token}` }, responseType: 'arraybuffer' });
        const avatar = Buffer.from(response.data, 'binary').toString('base64');
        // console.log("avatar: ", avatar);
        return avatar;
    }
    catch (error) {
        console.error(Object.keys(error), error.message); 
    }
    
}
export const getAccessToken = () => {
    // return a promise with accessToken string
    let aToken = getCookie("msoauthAccessToken");
    // console.log("getAccessToken: ", aToken);
    return aToken;
  }

  export const updateResume = async (token, fileContent) => {
    // const graphEndpoint = "https://graph.microsoft.com/v1.0/me/drive/root:/HKN_Persistant_Storage/resume.pdf:/content";
    const graphEndpoint = "https://graph.microsoft.com/v1.0/me/drive/special/approot:/resume.pdf:/content";
    try {
        const response = await axios.put(graphEndpoint, fileContent, { headers: { Authorization: `Bearer ${token}` }, responseType: 'json' });
        console.log("response: ", response);
        return response;
    }
    catch (error) {
        return { status: 408, statusText: error.message, data: "" };
    }
    // const avatar = Buffer.from(response.data, 'binary').toString('base64');
    // console.log("avatar: ", avatar);
    // return avatar;
  }

  export const getSharingLink = async (token, fileID) => {
    const graphEndpoint = "https://graph.microsoft.com/v1.0/me/drive/items/" + fileID + "/createLink";
    const payload = { type: 'view', scope: 'organization' }; // embed only supports anonymous scope.
    try {
        const response = await axios.post(graphEndpoint, payload, { headers: { Authorization: `Bearer ${token}` }, responseType: 'json' });
        console.log("response: ", response);
        return response;
    }
    catch (error) {
        return { status: 408, statusText: error.message, data: "" };
    }
  }

  export const getPreviewEmbed = async (token, fileID) => {
    const graphEndpoint = "https://graph.microsoft.com/v1.0/me/drive/items/" + fileID + "/preview";
    const payload = {  };
    try {
        const response = await axios.post(graphEndpoint, payload, { headers: { Authorization: `Bearer ${token}` }, responseType: 'json' });
        console.log("response: ", response);
        return response;
    }
    catch (error) {
        return { status: 408, statusText: error.message, data: "" };
    }
  }