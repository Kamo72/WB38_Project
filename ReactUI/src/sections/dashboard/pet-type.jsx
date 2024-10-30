import PropTypes from 'prop-types';

import { Box, Card, Grid, Radio, CardHeader, IconButton, Typography } from '@mui/material';

export default function ChangePetType({ title, subheader, petType, handlePetTypeChange, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ mx: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Types of Pet</Typography>
            <Grid container justify="flex-start" spacing={4}>
              <Grid item>
                <Radio
                  checked={petType && petType.type === 'dog'}
                  onChange={(e) => handlePetTypeChange(e, 'dog', 'dog.jpg')}
                />
                <IconButton onClick={(e) => handlePetTypeChange(e, 'dog', 'dog.jpg')}>
                  <img src="dog.jpg" alt="Dog" width="120" />
                </IconButton>
                <Typography variant="body2" align="center">Dog</Typography>
              </Grid>
              <Grid item>
                <Radio
                  checked={petType && petType.type === 'cat'}
                  onChange={(e) => handlePetTypeChange(e, 'cat', 'cat.jpg')}
                />
                <IconButton onClick={(e) => handlePetTypeChange(e, 'cat', 'cat.jpg')}>
                  <img src="cat.jpg" alt="Cat" width="120" />
                </IconButton>
                <Typography variant="body2" align="center">Cat</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

ChangePetType.propTypes = {
  petType: PropTypes.object,
  handlePetTypeChange: PropTypes.func,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
