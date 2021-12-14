import React, {useState, useContext, useEffect, useRef} from "react";
import { FirebaseAuth } from "../../../../components/FirebaseAuth/firebase";
import { AuthContext } from "../../../../components/FirebaseAuth";
import { BreadcrumbContext } from '../../../../components/Breadcrumb';
import Loader from '../../../../components/Loader';
import { Paper, Box, Grid, Card, CardHeader, CardContent,  Divider,  Alert, Button, Chip, Avatar } from "@mui/material";
import JsxParser from 'react-jsx-parser'
import { useHistory } from 'react-router-dom';

const CurrentPlans = () => {
    const title = 'Your Current Membership';

    const { userData, authUser } = useContext(AuthContext);
    const mountedRef = useRef(true);
    const { setBreadcrumb } = useContext(BreadcrumbContext);
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [plans, setCurrentPlans] = useState([]);

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
                to: null,
                text: title,
                active: true
            }
        ]);
        setLoading(true);

        const plansQuery = FirebaseAuth.firestore().collection('plans').orderBy('price', 'asc');
        plansQuery.get().then(planSnapShots => {
            if (!mountedRef.current) return null
            let p = [];
            planSnapShots.forEach(doc => {
                p.push({
                    'id': doc.id,
                    'name': doc.data().name,
                    'price': doc.data().price,
                    'currency': doc.data().currency,
                    'paymentCycle': doc.data().paymentCycle,
                    'features': doc.data().features,
                    'stripePriceId': doc.data().stripePriceId,
                    'current': (userData.currentAccount.planId===doc.id)?true:false
                });
            });
            if(p.length > 0){
                const ascendingOrderCurrentPlans = p.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                setCurrentPlans(ascendingOrderCurrentPlans);
            }
            setLoading(false);
        });
    },[userData, setBreadcrumb, title]);

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    function replacer(key,value)
    {
        if (key === "stsTokenManager" || key === "apiKey") return undefined;
        else return value;
    }

    return (
        <>
        {(!loading)?(
            <>{(userData.currentAccount.owner === authUser.user.uid)?(
            <>{plans.length > 0 ? (
            <Paper>
                <Box p={3} style={{textAlign: 'center'}} >
                    <h2>{title}</h2>
                    <Grid container spacing={3}>
                        
                            <>
                            {plans.map((plan,i) => 
                                {if (plan.current) {
                                    return <Grid container item key={i} alignItems="center" justify="center">
                                    <Card style={{
                                        width: '100%'
                                    }}>
                                        <CardHeader title={plan.name} subheader={"$"+(Math.round(plan.price * 100) / 100).toFixed(2)+"/"+plan.paymentCycle} />
                                        <CardContent>
                                            <Divider />
                                            <ul style={{listStyleType: 'none', paddingLeft: '0px'}}>
                                            {plan.features.map((feature, i) => 
                                                <li key={i}>
                                                    {/* <i className="fa fa-address-card" style={{color: "#2e7d32"}} />  */}
                                                    <JsxParser  bindings={{user: authUser.user, userData: userData, userDataText: JSON.stringify(authUser.user, replacer, '\t')}}
                                                        components={{Chip, Avatar}}
                                                        jsx={feature} 
                                                    />
                                                    {/* {feature} */}
                                                    {/* {console.log(authUser.user)} */}
                                                </li>
                                            )}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                }
                                return ""}
                                
                            )}
                            </>
                        
                    </Grid>
                    <Button color="primary" variant="contained" onClick={() => history.push('/user/profile')}>Access Profile</Button>

                </Box>
            </Paper>
            ):(
                <Alert severity="warning">No plan is found.</Alert>
            )}</>
            ):(
                <Alert severity="error" >Access Denied.</Alert>
            )}</>
        ):(
            <Loader text="loading plans..." />
        )}
        
        </>

    )
}

export default CurrentPlans;
