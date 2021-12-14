import { useState, useEffect, useContext } from "react";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import {
    Alert,
  } from "@mui/material";
import { BreadcrumbContext } from "../../../../components/Breadcrumb";
import { AuthContext } from "../../../../components/FirebaseAuth";


const PaymentStatus = () => {
  const [message, setMessage] = useState(null);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { userData } = useContext(AuthContext);
  const title = "Payment Status";
  const getCheckoutData = async (event) => {
    const sessionIdParam = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    const checkoutSession = CloudFunctions.httpsCallable("checkoutSession");
    if (message === null) {
        checkoutSession({
            sessionId: sessionIdParam,
          }).then((res) => {
            console.log("checkoutSession: ", res);
            if (res.data.result === "success") {
                setMessage("payment_status: " + res.data.data.payment_status);
            } else {
              console.error("checkoutSession returned result", res);
              setMessage(JSON.stringify(res));
            }
          });
        };
    }
    
    useEffect(() => {setBreadcrumb([
        {
          to: "/",
          text: "Home",
          active: false,
        },
        {
          to: "/account/" + userData.currentAccount.id + "/",
          text: userData.currentAccount.name,
          active: false,
        },
        {
          to: null,
          text: title,
          active: true,
        },
      ]);
      getCheckoutData();}, []);
  return (
      <>Payment Status
      {message !== null && (
        <Alert severity="info">
          {message}
        </Alert>
      )}</>
  );
};

export default PaymentStatus;
