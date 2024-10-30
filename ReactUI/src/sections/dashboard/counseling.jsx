import PropTypes from 'prop-types';
import axios from 'axios';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';

export default function Counseling({ title, subheader, petName, petType, bodyPart, sendImage, ...other }) {
  const [DiseaseName, setDiseaseName] = useState('');
  const [Improvement, setImprovement] = useState('');
  const [HistoryID, setHistoryID] = useState('');
  const [Possibility, setPossibility] = useState('');
  const [PetName, setPetName] = useState('');

  // 세션 스토리지에서 사용자 정보를 가져옴
  const user = JSON.parse(sessionStorage.getItem('user'));
  const usertext = 'Help';

  // 모든 props가 제공되었는지 확인
  const isAllPropsProvided = 
    user !== null && user !== undefined && user !== '' &&
    petName !== undefined && petName !== '' &&
    petType.type !== undefined && petType.type !== '' &&
    bodyPart.type !== undefined && bodyPart.type !== '' &&
    sendImage !== null && sendImage !== undefined && sendImage !== '';

  // diseaseID를 텍스트로 변환
  const getDiseaseName = (diseaseid) => {
    const diseaseMapping = {
      "sk01": "플라크",
      "sk02": "비듬,각질",
      "sk03": "태선화(과다색소침착)",
      "sk04": "여드름",
      "sk05": "궤양",
      "sk06": "결절",
    
      "mu01": "골종양",
      "mu02": "사지골절",
      "mu03": "늑골절",
      "mu04": "고관절 탈구",
      "mu05": "무릎 탈구",
      "mu06": "전방 십자인대 파열",
      "mu07": "척추 디스크 질환",
    
      "ab01": "간비대",
      "ab02": "소간증",
      "ab03": "거대 신장",
      "ab04": "복부 종양",
      "ab05": "비뇨기결석",
      "ab06": "장 폐색",
      "ab07": "거대 결장",
      "ab08": "탈장",
      "ab09": "복수",
      "ab10": "자세 이상",
    
      "ch01": "심비대",
      "ch02": "기관 허탈",
      "ch03": "종격동 변위",
      "ch04": "흉부 종양",
      "ch05": "기흉",
      "ch06": "횡경막 탈장",
      "ch07": "자세 이상",
    
      "ey01": "안검염",
      "ey02": "안검종양",
      "ey03": "안검 내반증",
      "ey04": "유루증",
      "ey05": "색소침착성 각막염",
      "ey06": "궤양성 안강염",
      "ey07": "각막 질환",
      "ey08": "핵화",
      "ey09": "결막염",
      "ey10": "비궤양성 각막 질환",
      "ey11": "백내장",
      "ey12": "유리체 변성",
    
      "nor": "무증상"
      };

    return diseaseMapping[diseaseid] || '정상';
  }

  // possibility를 소수점 2자릿수까지 표시
  const formatPossibility = (possibility) => parseFloat(possibility).toFixed(2);

  // improvement를 텍스트로 변환
  const formatImprovement = (improvementIndex) => {
    if (improvementIndex === 0) {
      return `비교할 사진이 없어 호전성을 검사할 수 없어요. <br/>
      하지만 증세가 심각할 시 가까운 병원에 가서 진료받는 것을 권장드려요.`;
    }
    if (improvementIndex === 1) {
      return `과거에 비해 상태가 악화되었어요. <br/>
      반려동물의 상태가 심각하며, 즉시 가까운 병원에 가서 진료받는 것을 권장드려요.`;
    }
    if (improvementIndex === 2) {
      return `과거에 비해 상태가 조금 나빠졌어요. <br/>
      이것은 반려동물의 상태가 주의가 필요한 수준으로 높아졌음을 뜻해요. 가까운 병원에 가서 진료 받는 것을 추천해드릴게요.`;
    }
    if (improvementIndex === 3) {
      return `과거에 비해 상태가 그대로에요. 그러나 추가적인 주의가 필요할 수 있어요. <br/>
      이것은 정확한 정보가 아니니, 가까운 병원에 가서 진료받는 것을 추천드려요`;
    }
    if (improvementIndex === 4) {
      return `과거에 비해 반려동물의 상태가 개선되었으며, 건강하고 안정되어 지고 있어요.`;
    }
    if (improvementIndex === 5) {
      return `과거에 비해 현재 반려동물의 상태가 크게 나아졌으며, 최상의 상태를 보여줘요. <br/>
      아무런 문제가 없습니다!`;
    }
    return "현재 반려동물의 상태를 확인할 수 없어요.\n이는 검사를 받지 못한 상황일 수 있으며, 가까운 병원에 가서 진료 받는 것을 권장드려요.";
  }

  // 상담 요청하기 부분
  const handleConsultationRequest = async () => {
    const formData = new FormData();
    formData.append('username', user);
    formData.append('petname', petName);
    formData.append('petbreed', petType.type);
    formData.append('api', bodyPart.type);
    formData.append('file', sendImage);
    formData.append('usertext', usertext);

    try {
      const response = await axios.post('http://127.0.0.1:3005/ai/upload', formData);

      // 전송완료 시 실행될 함수
      setHistoryID(response.data.result[0].historyID);
      setDiseaseName(getDiseaseName(response.data.result[0].diseaseid));
      setPossibility(formatPossibility(response.data.result[0].possibility));
      setImprovement(formatImprovement(parseInt(response.data.result[0].improvement, 10)));
      setPetName(response.data.result[0].petname);

      sessionStorage.setItem('diseaseid', response.data.result[0].diseaseid || 'nor');
      sessionStorage.setItem('possibility', parseInt(response.data.result[0].possibility, 10));
      sessionStorage.setItem('improvement', response.data.result[0].improvement);
    } catch (error) {
      console.error(`Error: ${error}`);
    }
  };

  return (
    <>
    <style>
      {`
        @font-face {
          font-family: 'Jalnan';
          src: url('/public/assets/font/Jalnan.ttf') format('truetype'),
               url('/public/assets/font/JalnanOTF.otf') format('opentype');
        }
      `}
    </style>
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      <Box
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '376px',
        }}
      >
        {!DiseaseName && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConsultationRequest}
            // 모든 props가 제공되었을 때만 애니메이션을 추가
            sx={isAllPropsProvided ? {
              animation: 'bounce 1s infinite',
              '@keyframes bounce': {
                '0%, 100%': {
                  transform: 'translateY(0)',
                },
                '50%': {
                  transform: 'translateY(-10px)',
                },
              },
            } : {}}
          >
            Request
          </Button>
        )}
        {DiseaseName && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '100%',
            }}
          >
            <Typography sx={{ fontFamily: 'Jalnan, Roboto, sans-serif'}} >{`${PetName}의 병명은 ${DiseaseName}으로, 확률은 ${Possibility}% 에요.`}</Typography>
            <Typography sx={{ fontFamily: 'Jalnan, Roboto, sans-serif'}}  dangerouslySetInnerHTML={{ __html: `[호전성 진단] ${Improvement}` }} />
            <Typography sx={{ fontFamily: 'Jalnan, Roboto, sans-serif'}} >추가적인 질문을 원하시거나 가까운 동물병원을 찾고 싶다면 아래의 버튼을 클릭하세요 !</Typography>
            <br/>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                width: '100%',
              }}
            >
              <Button variant="contained" color="primary" onClick={() => { window.location.href = '/dashboard'; }}>
                다시 상담하기
              </Button>
              <Button variant="contained" color="primary" onClick={() => { window.location.href = '/chat'; }}>
                추가 질문하기
              </Button>
              <Button variant="contained" color="primary" onClick={() => { window.location.href = '/chart'; }}>
                가까운 동물병원 찾기
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Card>
    </>
  );
}

Counseling.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  petName: PropTypes.string,
  petType: PropTypes.object,
  bodyPart: PropTypes.object,
  sendImage: PropTypes.object,
};
