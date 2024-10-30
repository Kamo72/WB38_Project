import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

import { Box, Card, CardHeader, IconButton, CardContent, Typography } from '@mui/material';

export default function ImageUpload({ title, subheader, handleImageUpload, petname, petbreed, api, image, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box sx={{ mx: 3 }}>
        <label htmlFor="icon-button-file">
          <IconButton color="primary" component="span">
            <Icon icon="mdi:camera" />
          </IconButton>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="icon-button-file"
            type="file"
            onChange={handleImageUpload}
          />
        </label>
      </Box>
      {image ? 
        <CardContent>
        <img 
          src={image} 
          alt="Uploaded" 
          style={{ 
            width: '100%', 
            height: '281px',
            objectFit: 'contain', // Set the maxHeight to match the height of the CardContent
            marginLeft: 20, 
            marginRight: 20, 
            marginBottom: 20 
          }} 
        />
      </CardContent>
        :
        <CardContent sx={{ height: 308, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed black', borderRadius: '15px', margin: 2 }}>
          <Typography variant="h6">Upload!</Typography>
        </CardContent>
      }
    </Card>
  );
}

ImageUpload.propTypes = {
  handleImageUpload: PropTypes.func,
  image: PropTypes.string,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
