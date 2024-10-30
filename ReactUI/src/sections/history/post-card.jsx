import React, { useState } from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { fShortenNumber } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import axios from 'axios';

  // diseaseID를 텍스트로 변환
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

  // Delete버튼 클릭
  const handleDeleteClick = (history) => {
    const userInfo = sessionStorage.getItem('user');
  
    // /ai/delete 호출
    axios.post('http://127.0.0.1:3005/ai/delete', {user: JSON.parse(userInfo), historyid: history.historyid})
    .then((response) => {
      console.log(response)
    })
  };

export default function PostCard({ history }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // 카드 외부 정보
  const diseaseName = diseaseMapping[history.diseaseid];          // 질병 이름
  const dateInfo = new Date(history.createdtime);                 // 생성 시간
  const image = `data:image/jpeg;base64,${atob(history.image)}`;  // 이미지
  const profileImage = '/assets/images/avatars/avatar_25.jpg';    // 프로필 이미지
  
  // 카드 내부 정보
  const historyId = history.historyid;  // 상담 번호
  const poss = history.possibility;     // 질병 확률
  const petName = history.petname;      // 반려견, 묘의 이름
  const petBreed = history.petbreed;    // 반려견, 반려묘 종류
  // const userText = history.usertext; // 상담내용
  const [improvement, setImprovement] = useState(null); // 호전성 메세지 ex. 3
  let bodyPart;                         // 질병 부위
  
  // 모달 열기
  const openModal = () => {
    setModalIsOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
  };

  // 호전성 검사
  const handleImprovementCheck = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const { petname, diseaseid } = history;
    axios.post('http://127.0.0.1:3005/ai/check', 
    {
      user,
      petname,
      diseaseid,
      historyId,
    })
    .then((response) => {
      setImprovement(response.data.message);
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  };

  // improvement를 텍스트로 변환
  const formatImprovement = (improvementIndex) => {
    switch(improvementIndex) {
      case 0:
        return `비교할 사진이 없어 호전성을 검사할 수 없어요.`;
      case 1:
        return `과거에 비해 상태가 악화되었어요.`;
      case 2:
        return `과거에 비해 상태가 조금 나빠졌어요.`;
      case 3:
        return `과거에 비해 상태가 그대로에요.`;
      case 4:
        return `과거에 비해 반려동물의 상태가 개선되었으며, 건강하고 안정되어 지고 있어요.`;
      case 5:
        return `과거에 비해 현재 반려동물의 상태가 크게 나아졌으며, 최상의 상태를 보여줘요.`;
      default:
        return "현재 반려동물의 상태를 확인할 수 없어요.";
    }
  }

  // diseaseID를 질병 부위로 변환
  switch (history.diseaseid.substring(0, 2)) {
    case 'sk':
      bodyPart = '피부';
      break;
    case 'mu':
      bodyPart = '근골격';
      break;
    case 'ab':
      bodyPart = '복부';
      break;
    case 'ch':
      bodyPart = '흉부';
      break;
    case 'ey':
      bodyPart = '안구';
      break;
    case 'nor':
      bodyPart = '무증상';
      break;
    default:
      bodyPart = '알 수 없음';
  }

  // 프로필 이미지
  const renderAvatar = (
    <Avatar
      alt="profileImage"
      src={profileImage}
      sx={{
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        left: (theme) => theme.spacing(3),
        bottom: (theme) => theme.spacing(-2),
      }}
    />
  );

  // 질병 이름
  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
      }}
    >
      [{petName}]
      <br/>
      {diseaseName}
    </Link>
  );

  // 카드에 표시하고싶은 정보
  const renderInfo = (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={1.5}
      justifyContent="flex-end"
      sx={{
        mt: 3,
        color: 'text.disabled',
      }}
    >
      {[
        { number: 0, icon: 'eva:message-circle-fill' },
        { number: 0, icon: 'eva:eye-fill' },
        { number: 0, icon: 'eva:share-fill' },
      ].map((info, _index) => (
        <Stack
          key={_index}
          direction="row"
          sx={{
            opacity: 0.48,
            color: 'common.white',
          }}
        >
          <Iconify width={16} icon={info.icon} sx={{ mr: 0.5 }} />
          <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
        </Stack>
      ))}
    </Stack>
  );

  // 질병 사진
  const renderCover = (
    <Box
      component="img"
      alt="image"
      src={image}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  // 상담 시간
  const renderDate = (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="caption"
        component="div"
        sx={{
          mb: 2,
          color: 'text.disabled',
        }}
      >
        {dateInfo.toLocaleString()}
      </Typography>
    </Box>
  );

  // 카드의 모양
  const renderShape = (
    <SvgColor
      color="paper"
      src="/assets/icons/shape-avatar.svg"
      sx={{
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: 'absolute',
        color: 'background.paper',
      }}
    />
  );

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
    <Grid xs={12} sm={6} md={4}>
      <Card>
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 3 / 4)',
          }}
        >
          {renderShape}
          {renderAvatar}
          {renderCover}
        </Box>

        <Box
          sx={{
            p: (theme) => theme.spacing(4, 3, 3, 3),
          }}
        >
          {renderDate}
          {renderTitle}
          {renderInfo}

          <Grid container justifyContent="space-between">
            <Grid item>
              <Button variant="contained" onClick={() => setModalIsOpen(true)}>
                상세보기
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color='secondary' onClick={() => handleDeleteClick(history)}>
                삭제하기
              </Button>
            </Grid>
          </Grid>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="History Modal"
            shouldCloseOnOverlayClick
            style={{
              content: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                right: 'auto',
                bottom: 'auto',
                transform: 'translate(-50%, -50%)',

                width: '90%',
                height: '50%',
                background: 'rgba(255, 255, 255, 0.8)',
              },
              overlay: {
                background: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >

          <Box sx={{ display: 'flex' }}>
            <img src={image} alt="질병 이미지" style={{ marginRight: '20px', maxWidth: '450px', height: '425px' }} />
            <Box>
              <Typography variant="h2" style={{ fontFamily: 'Jalnan' }}>{petName}의 상담내용</Typography> <br/>
              <Typography variant="body1" style={{ fontFamily: 'Jalnan' }}>반려동물 종류: {petBreed}</Typography> <br/>
              <Typography variant="body1" style={{ fontFamily: 'Jalnan' }}>질병명: {diseaseName}</Typography> <br/>
              <Typography variant="body1" style={{ fontFamily: 'Jalnan' }}>질병 부위: {bodyPart}</Typography> <br/>
              <Typography variant="body1" style={{ fontFamily: 'Jalnan' }}>질병 확률: {poss}%</Typography> <br/>
              <Typography variant="body1" style={{ fontFamily: 'Jalnan' }}>상담 번호: {historyId}번</Typography> <br/>
              <Typography variant="body1" style={{ fontFamily: 'Jalnan' }}>상담 날짜: {dateInfo.toString()}</Typography>
              {improvement ? (
                <Typography variant="body1" style={{ fontFamily: 'Jalnan', marginTop: '20px' }}>{formatImprovement(improvement)}</Typography>
              ) : (
                <Button variant="contained" color="primary" onClick={handleImprovementCheck} style={{ marginTop: '35px' }}>호전성 검사</Button>
              )}
            </Box>
          </Box>

          </Modal>

        </Box>
      </Card>

    </Grid>
    </>
  );
}

PostCard.propTypes = {
  history: PropTypes.object.isRequired,
};
