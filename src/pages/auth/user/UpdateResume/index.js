import React, { useState, useContext, useEffect, useRef, useStyles } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult, Input } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { updateResume, getAccessToken, getSharingLink } from "../../../../components/MicrosoftAuth/graph";
import { userUpdateResume } from '../../../../libs/user';
import { Button, Tooltip, IconButton } from "@mui/material";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';

const InputAlt = styled('input')({
    display: 'none',
  });

const UpdateResume = () => {
    const title = "Update Your Resume";
    const backToUrl = "/user/profile";
    const history = useHistory();
    const mountedRef = useRef(true);

    const [fullResumeURL, setResumeURL] = useState({
        hasError: false,
        error: null,
        value: null
    });

    const { authUser } = useContext(AuthContext);

    const [result, setResult] = useState({
        status: null,
        message: ''
    });

    const [inSubmit, setInSubmit] = useState(false);

    const [selectedFile, setSelectedFile] = React.useState(null);
    // const classes = useStyles();

    const handleCapture = ({ target }) => {
        setSelectedFile(target.files[0]);
      };
    
    const handleFileSubmit = async (selectedData) => {
        setInSubmit(true);
        let selectedFile = selectedData.target.files[0];
        
        const formData = new FormData();
        formData.append(
            "resumeFile",
            selectedFile,
            selectedFile.name
          );
        console.log("file submit: ", selectedFile);
        let response = await updateResume(getAccessToken(), formData);
        if (response.status === 200 || response.status === 201) {
            // successfully updated.
            // let resumeDownloadLink = response.data['@microsoft.graph.downloadUrl'];
            let resumeFileID = response.data.id;
            let resumeDownloadLinkResponse = await getSharingLink(getAccessToken(), resumeFileID);
            if (resumeDownloadLinkResponse.status === 200 || resumeDownloadLinkResponse.status === 201) {
                let resumeDownloadLink = resumeDownloadLinkResponse.data.link.webUrl
                userUpdateResume(resumeDownloadLink, resumeFileID);
                setResult({
                    status: true,
                    message: 'Your resume has been updated to: ' + selectedFile.name
                });
            }
            else {
                setResult({
                    status: false,
                    message: 'Unable to generate shared link.' + JSON.stringify(response)
                });
            }
            
        }
        else {
            // a possible error occured.
            setResult({
                status: false,
                message: 'Unable to upload file.' + JSON.stringify(response)
            });
        }
        setInSubmit(false);
    };

    useEffect(() => {
        return () => { 
            mountedRef.current = false
        }
    },[]);

    return (
        <UserPageLayout title={title} >
            { result.status === null &&
                <Form handleSubmit={e => {
                    e.preventDefault();
                    setInSubmit(true);
                    userUpdateResume(fullResumeURL.value, "");
                    setResult({
                        status: true,
                        message: 'Your resume has been updated.'
                    });
                    setInSubmit(false);
                }}
                disabled={fullResumeURL.hasError || fullResumeURL.value===null || inSubmit}
                inSubmit={inSubmit}
                enableDefaultButtons={true}
                backToUrl={backToUrl}
                >
                    <Input label="Your Resume URL" type="text" name="resume-url" maxLen={100} required={true} changeHandler={setResumeURL} fullWidth variant="outlined" />

                    
                    

                    <label htmlFor="contained-button-file">
                        <InputAlt accept="application/pdf" id="contained-button-file" type="file" onChange={handleFileSubmit} />
                        <Button variant="contained" component="span">
                            Upload Local File
                        </Button>
                    </label>





                </Form>
            }
            { result.status === false &&
                <FormResult 
                    severity="error"
                    resultMessage={result.message}
                    primaryText="Try Again"
                    primaryAction={() => {
                        setResult({
                            status: null,
                            message: ''
                        })
                    }}
                    secondaryText="View Profile"
                    secondaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
            }
            { result.status === true &&
                <FormResult 
                    severity="success"
                    resultMessage={result.message}
                    primaryText="View Profile"
                    primaryAction={() => {
                        history.push(backToUrl);
                    }}
                />
            }
        </UserPageLayout>
    )
}

export default UpdateResume;