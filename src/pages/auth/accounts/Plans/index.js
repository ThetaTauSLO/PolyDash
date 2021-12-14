import React, { useState, useContext, useEffect, useRef } from "react";
import {
  FirebaseAuth,
  CloudFunctions,
} from "../../../../components/FirebaseAuth/firebase";
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from "../../../../components/Breadcrumb";
import Loader from "../../../../components/Loader";
import { useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Paper,
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  Divider,
  Container,
  Stack,
  Alert,
} from "@mui/material";
import JsxParser from "react-jsx-parser";
import CheckoutForm from "./checkoutForm";

let stripe_pk = JSON.parse(process.env.REACT_APP_STRIPE).stripeConfig
  .public_api_key;
console.log("stripe public key loaded: ", stripe_pk);
const stripePromise = loadStripe(stripe_pk);
const Plans = () => {
  const title = "Select a Plan";

  const { userData, authUser } = useContext(AuthContext);
  const stripe = useStripe();
  const elements = useElements();
  const mountedRef = useRef(true);
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({ id: 0 });
  const [errorMessage, setErrorMessage] = useState(null);
  const [clientOptions, setClientSK] = useState({
    // passing the client secret obtained in step 2
    clientSecret: "",
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  });

  function setClientSKOptions(skkey) {
    setClientSK({
      // passing the client secret obtained in step 2
      clientSecret: skkey,
      // Fully customizable with appearance API.
      appearance: {
        /*...*/
      },
    });
  }

  useEffect(() => {
    setBreadcrumb([
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
    setLoading(true);

    const plansQuery = FirebaseAuth.firestore()
      .collection("plans")
      .orderBy("price", "asc");
    plansQuery.get().then((planSnapShots) => {
      if (!mountedRef.current) return null;
      let p = [];
      planSnapShots.forEach((doc) => {
        p.push({
          id: doc.id,
          name: doc.data().name,
          price: doc.data().price,
          currency: doc.data().currency,
          paymentCycle: doc.data().paymentCycle,
          features: doc.data().features,
          stripePriceId: doc.data().stripePriceId,
          current: userData.currentAccount.planId === doc.id ? true : false,
        });
      });
      if (p.length > 0) {
        const ascendingOrderPlans = p.sort(
          (a, b) => parseFloat(a.price) - parseFloat(b.price)
        );
        setPlans(ascendingOrderPlans);
      }
      setLoading(false);
    });
  }, [userData, setBreadcrumb, title]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const subscribe = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setErrorMessage(null);

    if (selectedPlan.price !== 0) {
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet. Make sure to disable
        // form submission until Stripe.js has loaded.
        return;
      }
    }

//     const createSubscription = CloudFunctions.httpsCallable(
//       "createPaymentIntent"
//     );
//     createSubscription({
//       planId: selectedPlan.id,
//       accountId: userData.currentAccount.id,
//     })
//       .then((res) => {
//         // physical page load to reload the account data
//         console.log("paymentIntent: ", res);
//         let client_sk = res.data.client_secret;
//         console.log("client sk: ", client_sk);
//         setClientSKOptions(client_sk);
//       })
//       .catch((err) => {
//         if (!mountedRef.current) return null;
//         setProcessing(false);
//         setErrorMessage(err.message);
//       });
//     setProcessing(false);
//   };
    const createCheckoutSession = CloudFunctions.httpsCallable(
        "createCheckoutSession"
    );
    createCheckoutSession({
        planId: selectedPlan.id,
        accountId: userData.currentAccount.id,
    })
        .then((res) => {
            console.log("createCheckoutSession: ", res);
            if (res.data.result === "success") {
                let checkoutURL = res.data.url;
                window.open(checkoutURL, '_blank').focus();
            }
            else {
                console.error("createCheckoutSession returned result", res);
            }
            setProcessing(false);
            
        })
        .catch((err) => {
            if (!mountedRef.current) return null;
            setProcessing(false);
            setErrorMessage(err.message);
        });
    };

  function replacer(key, value) {
    if (key === "stsTokenManager" || key === "apiKey") return undefined;
    else return value;
  }

  return (
    <>
      {!loading ? (
        <>
          {userData.currentAccount.owner === authUser.user.uid ? (
            <>
              {plans.length > 0 ? (
                <Paper>
                  <Box p={3} style={{ textAlign: "center" }}>
                    <h2>{title}</h2>
                    <Grid container spacing={3}>
                      <>
                        {plans.map((plan, i) => (
                          <Grid container item xs={12} md={4} key={i}>
                            <Card
                              style={{
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                paddingBottom: "20px",
                              }}
                            >
                              <CardHeader
                                title={plan.name}
                                subheader={
                                  "$" +
                                  (Math.round(plan.price * 100) / 100).toFixed(
                                    2
                                  ) +
                                  "/" +
                                  plan.paymentCycle
                                }
                              />
                              <CardContent>
                                <Divider />
                                <ul
                                  style={{
                                    listStyleType: "none",
                                    paddingLeft: "0px",
                                  }}
                                >
                                  {plan.features.map((feature, i) => (
                                    <li key={i}>
                                      <i
                                        className="fa fa-address-card"
                                        style={{ color: "#2e7d32" }}
                                      />
                                      <JsxParser jsx={feature} />
                                      {/* {feature} */}
                                      {/* {console.log(authUser.user)} */}
                                    </li>
                                  ))}
                                </ul>
                              </CardContent>
                              <CardActions
                                style={{
                                  marginTop: "auto",
                                  justifyContent: "center",
                                }}
                              >
                                {plan.current ? (
                                  <Button
                                    color="success"
                                    variant="contained"
                                    disabled={true}
                                  >
                                    Current Plan
                                  </Button>
                                ) : (
                                  <Button
                                    color="success"
                                    variant={
                                      plan.id !== selectedPlan.id
                                        ? "outlined"
                                        : "contained"
                                    }
                                    onClick={() => {
                                      for (let i = 0; i < plans.length; i++) {
                                        if (plans[i].id === plan.id) {
                                          setSelectedPlan(plan);
                                        }
                                      }
                                    }}
                                  >
                                    {plan.id === selectedPlan.id && (
                                      <>
                                        <i className="fa fa-check" />{" "}
                                      </>
                                    )}
                                    {plan.id !== selectedPlan.id
                                      ? "Select"
                                      : "Selected"}
                                  </Button>
                                )}
                              </CardActions>
                            </Card>
                          </Grid>
                        ))}
                      </>
                    </Grid>

                    {selectedPlan.id !== 0 && (
                      <div style={{ marginTop: "50px" }}>
                        <Container maxWidth="sm">
                          <Stack spacing={3}>
                            {errorMessage !== null && (
                              <Alert
                                severity="error"
                                onClose={() => setErrorMessage(null)}
                              >
                                {errorMessage}
                              </Alert>
                            )}
                            {clientOptions.clientSecret === "" && (
                              <Button
                                color="success"
                                size="large"
                                variant="contained"
                                disabled={
                                  selectedPlan.id === 0 || processing
                                    ? true
                                    : false
                                }
                                onClick={(e) => {
                                  subscribe(e);
                                }}
                              >
                                {processing ? (
                                  <>
                                    <Loader /> Processing...
                                  </>
                                ) : (
                                  <>Checkout</>
                                )}
                              </Button>
                            )}
                          </Stack>
                        </Container>
                      </div>
                    )}

                    {clientOptions.clientSecret !== "" && (
                      <Elements stripe={stripePromise} options={clientOptions}>
                        <CheckoutForm />
                      </Elements>
                    )}
                  </Box>
                </Paper>
              ) : (
                <Alert severity="warning">No plan is found.</Alert>
              )}
            </>
          ) : (
            <Alert severity="error">Access Denied.</Alert>
          )}
        </>
      ) : (
        <Loader text="loading plans..." />
      )}
    </>
  );
};

export default Plans;
