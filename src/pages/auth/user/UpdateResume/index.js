import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from 'react-router-dom';
import { Form, FormResult, Input } from '../../../../components/Form';
import { AuthContext } from '../../../../components/FirebaseAuth';
import UserPageLayout from '../../../../components/user/UserPageLayout';
import { userUpdateResume } from '../../../../libs/user';

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
                    userUpdateResume(fullResumeURL.value);
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