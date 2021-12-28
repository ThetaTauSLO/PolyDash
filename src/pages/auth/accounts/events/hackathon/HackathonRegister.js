import React, { useState, useContext, useEffect } from 'react';
import DataCreate from '../../../../../components/DataCreate';
import { BreadcrumbContext } from '../../../../../components/Breadcrumb';
import { AuthContext } from "../../../../../components/FirebaseAuth";
import { formSchema } from './images.json';
import { Alert, TextField, Rating, Typography, Grid, Box } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { CreateImageApi } from './HackathonApis';

const HackathonRegister = () => {

  const listName = 'hack2022'
  const title = 'Hackathon Registration';

  const [formFocused, setFormFocused] = useState(false);
  const [urlError, setUrlError] = useState(null);
  const [titleError, setTitleError] = useState(null);
  const [experience, setExperience] = React.useState(-1);
  const [experienceHover, setExperienceHover] = React.useState(-1);
  const experienceLabel = {
    1: 'This is my first Hackathon!',
    2: 'I went to one hackathon prior',
    3: 'I went to a couple hackathons already',
    4: 'I have a good idea about how hackathons are usually run',
    5: 'I can probably host this hackathon myself',
  };

  const validate = () => {
    return formFocused && !urlError && !titleError;
  }
  const { userData } = useContext(AuthContext);

  const titleCase = (str) => {
    let splitStr = str.toLowerCase().split(' ');
    for (let i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    return splitStr.join(' ');
  }

  const { setBreadcrumb } = useContext(BreadcrumbContext);
  useEffect(() => {
    setBreadcrumb([
      {
        to: "/",
        text: "Home",
        active: false
      },
      {
        to: "/account/" + userData.currentAccount.id + "/",
        text: userData.currentAccount.name,
        active: false
      },
      {
        to: "/account/" + userData.currentAccount.id + "/" + listName,
        text: titleCase(listName),
        active: false
      },
      {
        to: null,
        text: title,
        active: true
      }
    ]);
  }, [setBreadcrumb, title, listName, userData]);

  return (
    <DataCreate
      schema={formSchema}
      validation={validate}
      success={<Alert severity="success">Success! Not Implemented.</Alert>}
      handleCreation={CreateImageApi}
    >
      <TextField
        label="Which University are you affiliated with?"
        name="title"
        fullWidth
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (e.target.value.trim().length < 1 || e.target.value.trim().length > 100) {
            setTitleError("University Affiliation must be between 1 to 100 characters.");
          } else {
            setTitleError(null);
          }
        }}
        error={titleError ? true : false}
        helperText={titleError}
      />
      <Typography component="legend">What is your experience level with Hackathons?</Typography>
      <Grid container justifyContent="flex-start">
        <Rating
          name="simple-controlled"
          value={experience}
          onChange={(event, newValue) => {
            setExperience(newValue);
          }}
          onChangeActive={(event, newHover) => {
            setExperienceHover(newHover);
          }}
          icon={<BookmarkIcon fontSize="inherit" />}
          emptyIcon={<BookmarkBorderIcon fontSize="inherit" />}
        />{experience !== null && (
          <Box sx={{ ml: 2 }}>{experienceLabel[experienceHover !== -1 ? experienceHover : experience]}</Box>
        )}
      </Grid>

      <TextField
        label="What is your major?"
        name="major"
        fullWidth
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (e.target.value.trim().length < 1 || e.target.value.trim().length > 100) {
            setTitleError("Major must be between 1 to 100 characters.");
          } else {
            setTitleError(null);
          }
        }}
        error={titleError ? true : false}
        helperText={titleError}
      />

      <TextField
        label="What are you interested on making?"
        name="major"
        fullWidth
        multiline
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (e.target.value.trim().length < 1 || e.target.value.trim().length > 100) {
            setTitleError("Interested Project must be between 1 to 100 characters.");
          } else {
            setTitleError(null);
          }
        }}
        error={titleError ? true : false}
        helperText={titleError}
      />

      <TextField
        label="What workshop would you like to see?"
        name="major"
        fullWidth
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (e.target.value.trim().length > 100) {
            setTitleError("Workshop must be less than 100 characters.");
          } else {
            setTitleError(null);
          }
        }}
        error={titleError ? true : false}
        helperText={titleError}
      />


      <TextField
        label="Do you have any special requests/needs/dietary restrictions you would like us to know?"
        name="major"
        fullWidth
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (e.target.value.trim().length < 1 || e.target.value.trim().length > 100) {
            setTitleError("Interested Project must be between 1 to 100 characters.");
          } else {
            setTitleError(null);
          }
        }}
        error={titleError ? true : false}
        helperText={titleError}
      />

      <TextField
        label="How did you hear about PolyWare?"
        name="major"
        fullWidth
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (e.target.value.trim().length < 1 || e.target.value.trim().length > 100) {
            setTitleError("Interested Project must be between 1 to 100 characters.");
          } else {
            setTitleError(null);
          }
        }}
        error={titleError ? true : false}
        helperText={titleError}
      />

      <TextField
        label="Image URL"
        name="url"
        fullWidth
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (!/^(http|https):\/\/[^ "]+$/.test(e.target.value) || e.target.value.length > 500) {
            setUrlError("Image URL must be a valid full URL less than 500 characters long.");
          } else {
            setUrlError(null);
          }
        }}
        error={urlError ? true : false}
        helperText={urlError}
      />
      <TextField
        label="Image Title"
        name="title"
        fullWidth
        onFocus={() => setFormFocused(true)}
        onBlur={(e) => {
          if (e.target.value.trim().length < 1 || e.target.value.trim().length > 100) {
            setTitleError("Image Title must be between 1 to 100 characters.");
          } else {
            setTitleError(null);
          }
        }}
        error={titleError ? true : false}
        helperText={titleError}
      />
    </DataCreate>
  )

}

export default HackathonRegister;
