import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

/**
 * Review()
 * @param {*} props 
 * @returns Review of Submission
 */
export default function Review(props) {
  
  // Information for left column displayed at review
  const col1 = [
    { name: 'Experiment Name', detail: props.settings.name },
    { name: 'Description', detail: props.settings.description },
    { name: 'PDB File', detail: props.settings.localUpload.name },
    { name: 'Start Base Pair', detail: props.settings.startingBase },
    { name: 'End Base Pair', detail: props.settings.endingBase},
  ];
  
  // Information for right column displayed at review
  const col2 = [
    { name: 'Number of Designs', detail: props.settings.designs },
    { name: 'Number of Sequences', detail: props.settings.scaffolds },
    { name: 'Time Limit', detail: props.settings.timelimit },
    { name: 'Other Arguments', detail: '--search_type mc --motif_path...' },
  ]

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Review
      </Typography>
      <Grid container spacing={2}>
        <Grid item container direction="column" xs={12} sm={6}>
        <Grid container>
            {/* Dynamically generates name and details of each item to review in the left column*/}
            {col1.map((col1) => (
              <React.Fragment key={col1.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom align="left">{col1.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom align="left">{col1.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Grid container>
            {/* Dynamically generates name and details of each item to review in the right column*/}
            {col2.map((col2) => (
              <React.Fragment key={col2.name}>
                <Grid item xs={6}>
                  <Typography gutterBottom align="left">{col2.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom align="left">{col2.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}