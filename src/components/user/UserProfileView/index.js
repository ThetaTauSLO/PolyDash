import React, { useState } from "react";
import { AuthContext } from '../../FirebaseAuth';
import { Avatar, Box, Divider, Grid, List, ListItem, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useHistory } from "react-router-dom";
import { userGetResume } from '../../../libs/user/';
import { pdfjs } from 'react-pdf'
import { getAccessToken, getPreviewEmbed } from '../../MicrosoftAuth/graph';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
const UserProfileView = () => {
    const history = useHistory();

    const [resumeURL, setResumeURL] = useState(null);
    const [resumePreviewURL, setResumePreviewURL] = useState(null);

    React.useEffect(() => {
        async function checkResumeURL() {
            const doc = await userGetResume();
            let data;
            let id;
            if (doc.exists && (doc.data()['resumeURL'] !== "" && doc.data()['resumeURL'] !== undefined)) {
                console.log("Found resume:",  doc.data()['resumeURL']);
                data = doc.data()['resumeURL'];
            } else {
                // doc.data() will be undefined in this case
                data = "No Resume Uploaded";
            }
            setResumeURL(data);
            console.log("Got resume url:", data);

            if (doc.exists && (doc.data()['resumeID'] !== "" && doc.data()['resumeID'] !== undefined)) {
                console.log("Found resume ID:",  doc.data()['resumeID']);
                id = doc.data()['resumeID'];
            } else {
                // doc.data() will be undefined in this case
                data = "No Resume Uploaded";
            }
            
            let previewURLResponse = await getPreviewEmbed(getAccessToken(), id);
            let previewURL;
            if (previewURLResponse.status === 200 || previewURLResponse.status === 201) {
                previewURL = previewURLResponse.data.getUrl;
            }
            else {
                previewURL = "";
            }

            setResumePreviewURL(previewURL);
            console.log("Got resume url:", data);
        }
        checkResumeURL();
    }, []);

    return (
        <AuthContext.Consumer>
            {(context) => (   
                <List component="nav">
                    <ListItem>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><strong>AVATAR</strong><br /><Typography color="textSecondary">Update via social login</Typography></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2} style={{marginLeft: "auto", marginRight: "0px",}}>
                                    <Avatar alt={context.authUser.user.displayName} src={context.userData.photoURL} style={{height:'64px',width:'64px'}} />
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => {
                        history.push('/user/profile/update-name');
                    }}>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><strong>NAME</strong></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}>{context.authUser.user.displayName}</Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2} style={{marginLeft: "auto", marginRight: "0px",}}>
                                    <EditIcon />
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => {
                        history.push('/user/profile/update-email');
                    }}>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><strong>EMAIL</strong></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}>{context.authUser.user.email}</Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2} style={{marginLeft: "auto", marginRight: "0px",}}>
                                    <EditIcon />
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem button={!context.authUser.user.emailVerified} onClick={() => {
                        if(!context.authUser.user.emailVerified)history.push('/user/profile/verify-email');
                    }}>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><strong>EMAIL VERIFIED</strong></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}>{(context.authUser.user.emailVerified?" Verified":<p style={{ color: 'orange' }}>Unverified email</p>)}</Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2} style={{marginLeft: "auto", marginRight: "0px",}}>
                                    {context.authUser.user.emailVerified?(<VerifiedUserIcon />):(<SendIcon />)}
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => {
                        history.push('/user/profile/update-phone');
                    }}>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><strong>PHONE</strong></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}>{(context.authUser.user.phoneNumber) ? context.authUser.user.phoneNumber : <p style={{ color: 'orange' }}>Record Missing</p> }</Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2} style={{marginLeft: "auto", marginRight: "0px",}}>
                                    <EditIcon />
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    {/* <Login />
                    <Person /> */}
                    
                    <ListItem button onClick={() => {
                        history.push('/user/profile/update-resume');
                    }}>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><strong>RESUME</strong></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}>{(resumeURL) ? resumeURL : <p style={{ color: 'orange' }}>Record Missing</p> }</Box>
                                <div>
                                <object data={resumePreviewURL} type="application/pdf" width="100%" height="100%">
                                    <p><a href={resumeURL}>Uploaded Resume</a></p>
                                </object>
                                    {/* <Document
                                        file={resumeURL}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                    >
                                        <Page pageNumber={pageNumber} height="300"/>
                                    </Document> */}
                                    <div>
                                        {/* <p>
                                        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                                        </p> */}
                                        {/* <Button
                                        variant="contained" color="secondary"
                                        disabled={pageNumber <= 1}
                                        onClick={previousPage}
                                        >
                                        Previous
                                        </Button>
                                        <Button
                                        variant="contained" color="secondary"
                                        disabled={pageNumber >= numPages}
                                        onClick={nextPage}
                                        >
                                        Next
                                        </Button> */}
                                    </div>
                                </div>        
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2} style={{marginLeft: "auto", marginRight: "0px",}} >
                                <EditIcon />
                                {/* <IconButton aria-label="delete" >
                                <EditIcon />
                                </IconButton>                                     */}
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => {
                        history.push('/user/profile/update-password');
                    }}>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><strong>PASSWORD</strong></Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}>••••••••</Box>
                            </Grid>
                            <Grid container item xs={12} md={4}>
                                <Box p={2} style={{marginLeft: "auto", marginRight: "0px",}}>
                                    <EditIcon />
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={() => {
                        history.push('/user/profile/delete');
                    }}>
                        <Grid container spacing={1}>
                            <Grid container item xs={12} md={4}>
                                <Box p={2}><Typography color="error"><strong>DELETE ACCOUNT</strong></Typography></Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                </List>
            )}
        </AuthContext.Consumer>
    )
}

export default UserProfileView;