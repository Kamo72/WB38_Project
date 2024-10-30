import React, { useState } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import TitleView from '../title-view';
import StepProgress from '../step-progress';
import ChangeBodyPart from '../body-part';
import ChangePetType from '../pet-type';
import Counseling from '../counseling';
import ChangePetName from '../pet-name';
import DiseasePicture from '../disease-picture';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const [stepsCompleted, setStepsCompleted] = useState([false, false, false, false, false]);
  const [currentStep, setCurrentStep] = useState(0);

  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState({ type: '', petImage: '' });
  const [bodyPart, setBodyPart] = useState({ type: '', bodyPartImage: '' });
  const [image, setImage] = useState(null);
  const [sendImage, setSendImage] = useState(null);

  const handleInputChange = (newValue) => {
    setPetName(newValue);
  };
  const handleFormSubmit = () => {
    console.log(`Pet name: ${petName}`);
    setStepsCompleted(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[0] = true;
      if (newSteps.slice(0, 4).every(step => step)) {
        newSteps[4] = true;
      }
      return newSteps;
    });
  };
  const handlePetTypeChange = (e, type, petImage) => {
    setPetType({ type, petImage });
    setStepsCompleted(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[1] = true;
      if (newSteps.slice(0, 4).every(step => step)) {
        newSteps[4] = true;
      }
      return newSteps;
    });
  };
  const handleBodyPartChange = (e, type, bodyPartImage) => {
    setBodyPart({ type, bodyPartImage });
    setStepsCompleted(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[2] = true;
      if (newSteps.slice(0, 4).every(step => step)) {
        newSteps[4] = true;
      }
      return newSteps;
    });
  };
  const handleUpload = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setSendImage(e.target.files[0]);
    setStepsCompleted(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[3] = true;
      if (newSteps.slice(0, 4).every(step => step)) {
        newSteps[4] = true;
      }
      return newSteps;
    });
  };
  const advanceStep = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome to AI veterinarian 🐕‍🦺
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StepProgress
            title="Steps in progress"
            list={stepsCompleted.map((completed, index) => ({
              id: index.toString(),
              title: [
                'Pet Name:',
                'Pet Type:',
                'Body Part:',
                'Image Uploaded:',
                'Step Completed !',
              ][index],
              type: `order${index + 1}`,
              text: [
                `Pet Name: ${petName}`,
                `Pet Type: ${petType.type}`,
                `Body Part: ${bodyPart.type}`,
                image ? `Image Uploaded: success` : 'No Image',
                ''
              ][index],
              isCompleted: completed,
            }))}
          />
        </Grid>

        <Grid xs={12}>
          {/* 1. <반려동물 이름 입력> */}
          {currentStep === 0 && (
            <ChangePetName
              title="Pet Name Input"
              subheader="Enter your pet's name"
              handleInputChange={handleInputChange}
              handleFormSubmit={() => { handleFormSubmit(); advanceStep(); }}
              petName={petName}
            />
          )}
          {/* 2. <반려동물 종류 선택> */}
          {currentStep === 1 && (
            <ChangePetType
              title="Select the type of pet"
              petType={petType}
              handlePetTypeChange={(e, type, petImage) => { handlePetTypeChange(e, type, petImage); advanceStep(); }}
            />
          )}
          {/* 3. <질병유형 선택> */}
          {currentStep === 2 && (
            <ChangeBodyPart
              title="Select disease type"
              bodyPart={bodyPart}
              handleBodyPartChange={(e, type, bodyPartImage) => { handleBodyPartChange(e, type, bodyPartImage); advanceStep(); }}
            />
          )}
          {/* 4. <이미지 또는 비디오 업로드> */}
          {currentStep === 3 && (
            <DiseasePicture
              title="Image Or Video"
              subheader="Choose One!"
              handleUpload={(e) => { handleUpload(e); advanceStep(); }}
              petname={petName}
              petbreed={petType}
              api={bodyPart}
            />
          )}
          {/* 5. <상담 요청단계> */}
          {currentStep === 4 && (
            <Counseling
              title="Counseling"
              subheader="Press the request button"
              petName={petName}
              petType={petType}
              bodyPart={bodyPart}
              sendImage={sendImage}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
