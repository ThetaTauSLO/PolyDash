import React, { useContext, useEffect, useState, useRef } from "react";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import { AuthContext } from "../../../../components/FirebaseAuth";
import { CloudFunctions } from "../../../../components/FirebaseAuth/firebase";
import { useHistory, Redirect } from "react-router-dom";
import Loader from "../../../../components/Loader";
import { currency } from "../../../../inc/currency.json";
import { Paper, Box, Alert, Button, Stack, Modal, AlertTitle} from "@mui/material";
import { orange } from "@mui/material/colors";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: orange['600'], //'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const DeleteAccount = () => {
    const title = 'Delete Account';
    const history = useHistory();
    const { userData } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [inSubmit, setInSubmit] = useState(false);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const mountedRef = useRef(true);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {setOpen(true); }
    // 
    const handleClose = () => setOpen(false);

    useEffect(() => {
        setBreadcrumb([
            {
                to: "/",
                text: "Home",
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/",
                text: userData.currentAccount.name,
                active: false
            },
            {
                to: "/account/"+userData.currentAccount.id+"/billing",
                text: 'Billing',
                active: false
            },
            {
                to: null,
                text: title,
                active: true
            }
        ]);
    },[userData,setBreadcrumb,title]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <>
            {success?(
                <Redirect to="/"></Redirect>
            ):(
                <>
                    <Paper>
                        <Box p={2}>
                            {error !== null && 
                                <Box p={3}>
                                    <Alert severity="error">{error}</Alert>
                                </Box>
                            }
                            <p>Your current subscription period will end on <strong>{(new Date(userData.currentAccount.subscriptionCurrentPeriodEnd * 1000)).toLocaleDateString()}</strong>.</p>
                            <p>The system will charge <strong>{currency[userData.currentAccount.currency].sign}{userData.currentAccount.price}/{userData.currentAccount.paymentCycle}</strong> to renew the subscription. Deleting the account will stop the subscription and no renewal payment will be charged.</p>
                            <p>Deleting your account will immediately end access, voiding any remaining days in your subscription period or your trial period.</p>
                            <p className="text-danger">Are you sure you want to delete your account?</p>
                            <Stack direction="row" spacing={1} mt={2}>
                                <Button variant="contained" color="error" disabled={inSubmit} onClick={() => {
                                    handleOpen();
                                }}>
                                {inSubmit && 
                                    <Loader />
                                }
                                    Yes, I want to delete the account</Button>
                                    <Button variant="contained" color="secondary" onClick={() => history.push("/account/"+userData.currentAccount.id+"/billing")}>No, Go Back</Button>
                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                <Box sx={style}>
                                <Alert severity="error">
                                    <AlertTitle><h4>Dangerous Request</h4></AlertTitle>
                                    You are about to permanently delete your account from our service. This will <strong>immediately and irrevocably REMOVE ALL DATA associated with this account. </strong>
                                    You will immediately lose access to this account.
                                    <p>Are you sure you would like to delete your account?</p>
                                    <Stack direction="row" spacing={1} mt={2}>
                                        <Button variant="contained" color="error" disabled={inSubmit} onClick={() => {
                                            setInSubmit(true);
                                            handleClose();
                                            const cancelSubscription = CloudFunctions.httpsCallable('cancelSubscription');
                                            cancelSubscription({
                                                accountId: userData.currentAccount.id
                                            }).then(res => {
                                                if (!mountedRef.current) return null
                                                setSuccess(true);
                                                setInSubmit(false);
                                            }).catch(err => {
                                                if (!mountedRef.current) return null
                                                setError(err.message);
                                                setInSubmit(false);
                                            })
                                        }}>
                                        {inSubmit && 
                                            <Loader />
                                        }
                                            YES, DELETE</Button>
                                            <Button variant="contained" color="secondary" onClick={() => history.push("/account/"+userData.currentAccount.id+"/billing")}>ABORT</Button>
                                    </Stack>
                                </Alert>
                                </Box>
                                </Modal>
                            </Stack>
                        </Box>
                    </Paper>
                </>
            )}
            
        </>
    )
}

export default DeleteAccount;