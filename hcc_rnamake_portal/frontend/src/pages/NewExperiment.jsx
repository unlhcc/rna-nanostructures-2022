import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import JobName from './JobName';
import PDBSettings from './PDBSettings';
import Review from './Review.jsx';
import Cookies from 'js-cookie';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
    </Typography>
  );
}

// to automate switching URLs when developing and when in the online portal.
const BASEURL = window.location.origin;

const steps = ['Description', 'Settings', 'Review'];


/**
 * getStepContent()
 * Queries relevant portion of the form to receive information
 * @param {*} step 
 * @param {*} handleChange 
 * @param {*} state 
 * @param {*} handleUpload 
 * @param {*} fileState 
 * @returns Information for the relevant step
 */
function getStepContent(step, handleChange, state, handleUpload, fileState) {
  switch (step) {
    case 0:
      return <JobName handleChange={handleChange} state={state}/>;
    case 1:
      return <PDBSettings handleChange={handleChange} state={state} handleUpload={handleUpload} fileState = {fileState}/>;
    case 2:
      return <Review settings={state}/>;
    default:
      throw new Error('Unknown step');
  }
}

let fileName;

const theme = createTheme();

/**
 * asynchronous submitExperiment()
 * submit experiment with information from getStepContent()
 * @param {*} info 
 */
  async function submitExperiment(info) {
    
    while(info.localUpload==='');
    // Construct experiment object
    console.log(info);

    //Some sort of case statement to build experiment inputs for each profile type should go here

    /* other_cli_arguments should be where the binary options whose existence is the true/false value (i.e --dump_pdbs)
     * should exist.  Airavata removes CLI arguments that don't have a value 
    */
    var input = {};
    if(info.preset==="TTR")
    {
      input = {
        "pdb" : info.localUpload,
        "start_bp": info.startingBase,
        "end_bp" : info.endingBase,
        "designs" : info.designs,
        "sequences_per_design" : info.scaffolds,
        "search_cutoff" : info.searchCutoff,
        "other_cli_arguments":"--dump_pdbs",
        "log_level" : info.logLevel,
      }
    }
    else if(info.preset ==="TTR_MC")
    {
      input = {
        "pdb" : info.localUpload,
        "start_bp": info.startingBase,
        "end_bp" : info.endingBase,
        "designs" : info.designs,
        "sequences_per_design" : info.scaffolds,
        "other_cli_arguments" : "--dump_pdbs",
        "log_level" : info.logLevel,
        "search_type" :"mc",
        "motif_path" : info.motifPath,
      }
    }

    // Create experiment
    const experimentData = await window.AiravataAPI.utils.ExperimentUtils.createExperiment({
        applicationInterfaceId: "RNAMake_8a3a6486-c6c5-4a37-8e98-ec14e3efdff4",
        computeResourceName: "149.165.171.24",
        experimentName: info.name,
        experimentInputs: input,
    });
    console.log(info);
    // Save experiment
    const experiment = await window.AiravataAPI.services.ExperimentService.create({ data: experimentData });
    // Launch experiment
    await window.AiravataAPI.services.ExperimentService.launch({ lookup: experiment.experimentId });
  };

  /**
   * Checkout()
   * @returns Job Submission steps and confirmation
   */
export default function Checkout() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [fileState, setFileState] = React.useState("NONE");
  const [submissionInfo, setSubmissionInfo] = React.useState({
    name:'',
    description:'',
    designs:'',
    scaffolds:'1',
    timeLimit:'',
    startingBase:'',
    endingBase:'',
    localUpload:'',
    searchCutoff:'',
    logLevel: 'debug',
    motifPath:'',
    preset:''
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setSubmissionInfo(prevState => ({
        ...prevState,
        [name]: value
    }));
  };

  /**
   * uploads files
   * @param {*} e event
   */
  const handleUpload = e => {
    const name = e.target.name;
    const file = e.target.files[0];
    const formData  = new FormData();
    setFileState("UPLOADING");
    formData.append('file', file);
    fetch(BASEURL + "/api/upload",{
      credentials: 'include',
      mode: 'cors',
      method: 'POST',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken')
      },
      body : formData,
    })
    .then(result => result.json()
    )
    .then(
      (result)=> {
        fileName = file['name'];
        setOpen(true);
        setFileState("COMPLETE");
        console.log(result['data-product']['productUri']);
        setSubmissionInfo(prevState => ({
          ...prevState,
          [name]: result['data-product']['productUri']
        }));
      }
    )
    console.log({name, file});

  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = () => {
    setActiveStep(activeStep + 1);
    if(activeStep===2)
    {
      submitExperiment(submissionInfo);
    }
  };
 
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <div>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Design New RNA Scaffold
          </Typography>
          {/* Step Overview */}
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <React.Fragment>
            {activeStep === steps.length ? (
              // Final Step (confirmation of submission)
              <React.Fragment>
                <Typography variant="h5" gutterBottom>
                  Job Submitted.
                </Typography>
                <Typography variant="subtitle1">
                  <a href="/rnamake_portal/workspace">Return to portal</a>
                </Typography>
              </React.Fragment>
            ) : (
              // Other steps (form filling)
              <React.Fragment>
                {/* Relevant step is queried */}
                {getStepContent(activeStep, handleChange, submissionInfo, handleUpload,fileState)}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {/* Back button if there is a previous page */}
                  {activeStep !== 0 && (
                    <Button style={{ color:'#4C5F94' }} onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
                  {/* Next button or job submission button, depending on step number */}
                  <Button variant="contained" style={{ backgroundColor:'#4C5F94' }} onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                    {activeStep === steps.length - 1 ? 'Submit Job' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </React.Fragment>
        </Paper>
        <Copyright />  
      </Container>
    </ThemeProvider>
    {/* File upload confirmation */}
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" variant="filled" sx={{width: '100%'}}>
                {fileName} has been successfully uploaded!
                </Alert>
              </Snackbar>
    </div>
  );
}