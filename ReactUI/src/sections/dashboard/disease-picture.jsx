import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Button, Typography } from '@mui/material';
import ImageUpload from './image-upload';
import VideoStream from './video-stream';

const DiseasePicture = ({ handleUpload, petname, petbreed, api, ...other }) => {
  const [uploadType, setUploadType] = useState(null);

  const selectUploadType = (type) => {
    setUploadType(type);
  };

  let content;

  if (!uploadType) {
    content = (
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => selectUploadType('image')} 
          sx={{ flexGrow: 1, height: '250px' }}
          startIcon={<img src="/image.svg" alt="Upload Icon" style={{ width: '40px', height: '40px', filter: 'invert(100%)' }} />} 
        >
          <Typography variant="h6">Upload Files</Typography>
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => selectUploadType('video')} 
          sx={{ flexGrow: 1, height: '250px' }}
          startIcon={<img src="/video.svg" alt="Video Icon" style={{ width: '40px', height: '40px', filter: 'invert(100%)' }} />} 
        >
          <Typography variant="h6">Live Capture</Typography>
        </Button>
      </Box>
    );
  } else if (uploadType === 'image') {
    content = (
      <ImageUpload
        title="Upload Images"
        subheader="Click the button!"
        handleImageUpload={handleUpload}
        petname={petname}
        petbreed={petbreed}
        api={api}
      />
    );
  } else {
    content = (
      <VideoStream
        handleVideoStream={handleUpload}
        petname={petname}
        petbreed={petbreed}
        api={api}
      />
    );
  }

  return (
    <Card {...other}>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {content}
        </Box>
      </CardContent>
    </Card>
  );
};

DiseasePicture.propTypes = {
  handleUpload: PropTypes.func,
  petName: PropTypes.string,
  petType: PropTypes.string,
  bodyPart: PropTypes.string,
};

export default DiseasePicture;
