import PropTypes from 'prop-types';

import { Box, Card, Grid, Radio, CardHeader, IconButton, Typography } from '@mui/material';

export default function ChangeBodyPart({ title, subheader, bodyPart, handleBodyPartChange, ...other }) {
  return (
    <Card {...other} sx={{ height: '454px'}}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Type of Disease</Typography>
            <Grid container justify="flex-start" spacing={2}>
              {bodyPartOptions.map((option) => (
                <Grid item key={option.type}>
                  <Radio
                    checked={bodyPart && bodyPart.type === option.type}
                    onChange={(e) => handleBodyPartChange(e, option.type, option.image)}
                  />
                  <IconButton onClick={(e) => handleBodyPartChange(e, option.type, option.image)}>
                    <img src={option.image} alt={option.type} width="120" height="75" />
                  </IconButton>
                  <Typography variant="body2" align="center">{option.label}</Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

const bodyPartOptions = [
  { type: 'eye', label: '안구', image: 'eyeball.jpg' },
  { type: 'skin', label: '피부', image: 'skin.jpg' },
  { type: 'bones', label: '근골격', image: 'physique.jpg' },
  { type: 'thoracic', label: '흉부', image: 'chest.jpg' },
  { type: 'abdominal', label: '복부', image: 'abdomen.jpg' },
];

ChangeBodyPart.propTypes = {
  bodyPart: PropTypes.object,
  handleBodyPartChange: PropTypes.func,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
