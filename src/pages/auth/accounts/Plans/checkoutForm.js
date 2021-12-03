import React, {useState, useContext} from 'react';
import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import Loader from '../../../../components/Loader';
import { Button, Container, Stack } from "@mui/material";
import { AuthContext } from "../../../../components/FirebaseAuth";


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { userData } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState(null);
  const [processing, setProcessing] = useState(false);


  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    setProcessing(true);
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const {error} = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/account/" +userData.currentAccount.id + "/billing/paymentStatus",
      },
    });


    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (e.g., payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>

    <div style={{marginTop: '50px'}}>
        <Container maxWidth="sm">
            <Stack spacing={3}>
            <PaymentElement />

            <Button type="submit" color="success" size="large" variant="contained" disabled={!stripe || processing?true:false}>{processing?(<><Loader /> Processing...</>):(<>Confirm Enrollment</>)}</Button>
                                        
            {/* Show error message to your customers */}
            {errorMessage && <div>{errorMessage}</div>}
            
            </Stack>
        </Container>
    </div>
      
    </form>
  )
};

export default CheckoutForm;