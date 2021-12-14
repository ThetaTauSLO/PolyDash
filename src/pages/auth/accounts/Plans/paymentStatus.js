import { useState, useEffect, useContext } from "react";
import { useHistory } from 'react-router-dom';
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import {
    Alert, CircularProgress, Container, Button
  } from "@mui/material";
import { BreadcrumbContext } from "../../../../components/Breadcrumb";
import { AuthContext } from "../../../../components/FirebaseAuth";


const PaymentStatus = () => {
  const [message, setMessage] = useState(null);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { userData } = useContext(AuthContext);
  const title = "Payment Status";
  const history = useHistory();   
    
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
      getCheckoutData();}, [setBreadcrumb, userData, message]);
  return (
      <>Payment Status
      {message !== null && (
        <Container>
          <Alert severity="info">
            {message}
            <br />
            Please note that it may take 5 to 15 minutes for your account status to be updated.
          </Alert>
          <br />
          <Button variant="contained" color="primary" onClick={() => history.push('/')}>Back To Account Overview</Button>
        </Container>
      )}
      {message === null && (
        <Container>
          <br />
          <CircularProgress />
        </Container>
        
      )}</>
  );
};

export default PaymentStatus;
