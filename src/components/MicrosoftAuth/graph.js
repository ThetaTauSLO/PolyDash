import axios from 'axios';
import { getCookie } from '../CookieHelper';
import { FirebaseAuth } from '../FirebaseAuth/firebase';

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

export const getUserDetail = async (token) => {
    const graphEndpoint = "https://graph.microsoft.com/v1.0/me";
    try {
        const response = await axios(graphEndpoint, { headers: { Authorization: `Bearer ${token}` }, responseType: 'json' });
        // console.log("response: ", response);

        return response;
    }
    catch (error) {
        console.error(Object.keys(error), error.message);
        return error.response;
    }
}

export const getAccessToken = () => {
    // return a promise with accessToken string
    let aToken = getCookie("msoauthAccessToken");
    let signInMethod = getCookie("signInMethod");
    // console.log("getAccessToken: ", aToken);

     // Validating Microsoft access token and reauthenticate if
     // no longer valid.
     if (signInMethod !== "microsoft.com") {
       return "";
     }

     (async () => {
        let validateResult = await getUserDetail(aToken);
        // console.log("getAccessToken validate res: ", validateResult);
        if (validateResult.status === 401) {
            console.log("access token invalid. ATM #1");
            aToken = getCookie("msoauthAccessToken");
            validateResult = await getUserDetail(aToken);
            if (validateResult.status === 401) {
                console.log("access token invalid. ATM #2");
                aToken = getCookie("msoauthAccessToken");
                validateResult = await getUserDetail(aToken);
                if (validateResult.status === 401) {
                    // unauthorized. Sign out authentication.
                    console.log("access token invalid. ATM #3. No more retries.");
                    FirebaseAuth.auth().signOut().then(function() {
                        console.log('Signed out due to invalid msoauthAccessToken.', aToken);
                    }, function(error) {
                        console.error('Unable to sign out: ', error);
                    });
                }
            }

        }
        })();



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
        // console.log("response: ", response);
        return response;
    }
    catch (error) {
        return { status: 408, statusText: error.message, data: "" };
    }
  }
