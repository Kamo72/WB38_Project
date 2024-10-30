import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";

function VideoStream({ petname, petbreed, api, ...other }) {
  const webcamRef = useRef(null);
  const socket = useRef();
  const [results, setResults] = useState([]);
  const [firstDataSent, setFirstDataSent] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [detectedText, setDetectedText] = useState('질병을 감지중입니다...');
  let intervalId;

  const handleShowResults = () => {
    setShowResults(true);
  };

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

  const stopStreaming = () => {
    if (webcamRef.current && webcamRef.current.srcObject) {
      const tracks = webcamRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      webcamRef.current.srcObject = null;
    }
    
    if (socket.current) {
      clearInterval(intervalId);
      setDetectedText('');
      setFirstDataSent(false);
      socket.current.disconnect();
    }
  }

  const startStreaming = () => {
    setResults([]);
    setShowResults(false);
    setDetectedText('질병을 감지중입니다...');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const usertext = 'Help';

    socket.current = io('http://127.0.0.1:3006', {
      transports: ['websocket', 'polling'],
    });
    setIsStreaming(true);

    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      webcamRef.current.srcObject = stream;

       intervalId = setInterval(() => {
        const canvas = document.createElement('canvas');
        canvas.width = webcamRef.current.videoWidth;
        canvas.height = webcamRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(webcamRef.current, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((image) => {
          let dataToSend = { image };

          if (!firstDataSent) {
            dataToSend = {
              ...dataToSend,
              user,
              petname,
              petbreed,
              api,
              usertext,
            };
            setFirstDataSent(true);
          }
  
          socket.current.emit('image', dataToSend);
        })

      }, 1000);

      socket.current.on('text', (rasaResult) => {
        const detected = []

        if (rasaResult.status === "ok"){
          if(!rasaResult.result.diseaseid) { // diseaseid가 'nor'이 아닌 경우
            const result = {
              diseaseName: rasaResult.result.diseaseid,
              possibility: rasaResult.result.possibility,
              historyID: rasaResult.result.historyid,
              improvement: rasaResult.result.improvement,
            };
            detected.push(rasaResult.result.diseaseid);
            setResults([result]);        // 결과 설정
            socket.current.disconnect(); // 소켓 연결 끊기
          } else {
            const result = {
              diseaseName: rasaResult.result.diseaseid,
              possibility: rasaResult.result.possibility,
              historyID: rasaResult.result.historyid,
              improvement: rasaResult.result.improvement,
            }
            setResults([result]); // 결과 설정
          }
        }
      });
    });
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.disconnect();
    }
  }, []);

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
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem"
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 2,
              marginTop: 2,
            }}
          >
            <video
              ref={webcamRef}
              autoPlay
              style={{ width: "480px", height: "360px", border: "1px solid black" }}
            >
              <track kind="captions" />
            </video>
            <Box
              sx={{
                display: "flex",
                gap: "12rem",
                justifyContent: "flex-start",
                marginTop: 2,
              }}
            >
              <Button variant="contained" color="secondary" onClick={startStreaming}>
                Start Streaming
              </Button>
              <Button variant="contained" color="secondary" onClick={stopStreaming}>
                Stop Streaming
              </Button>
            </Box>
          </Box>
          <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      gap: 2,
      marginTop: 2,
    }}
  >
    {isStreaming && results.length === 0 && (
      <Typography sx={{ fontFamily: 'Jalnan, Roboto, sans-serif'}} > {detectedText} </Typography>
    )}
    {results.length > 0 && !showResults ? (
      <Button variant="contained" color="primary" onClick={handleShowResults}>
        질병이 감지되었습니다!
      </Button>
    ) : (
      showResults && 
      results.map((result, index) => (
        <Box key={index} sx={{ textAlign: "flex-start" }}>
          <Typography sx={{ fontFamily: 'Jalnan, Roboto, sans-serif'}}>
            {result.diseaseName === 'nor' || result.diseaseName === null ?
             `${petname}은(는) 어떠한 병도 감지되지 않았습니다.` :
             `${petname}가(이) ${getDiseaseName(result.diseaseName)}일 확률은 ${formatPossibility(result.possibility)}% 에요.`
            }
          </Typography>
          <Typography sx={{ fontFamily: 'Jalnan, Roboto, sans-serif'}} dangerouslySetInnerHTML={{ __html: formatImprovement(result.improvement) }} />
          <Typography sx={{ fontFamily: 'Jalnan, Roboto, sans-serif'}}>추가적인 질문을 원하시거나 가까운 동물병원을 찾고 싶다면 아래의 버튼을 클릭하세요 !</Typography>
          <br/>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              width: '100%',
            }}
          >
            <Button variant="contained" color="primary" onClick={() => window.open('/chat', '_blank')}>
              추가 질문하기
            </Button>
            <Button variant="contained" color="primary" onClick={() => window.open('/chart', '_blank')}>
              동물병원 찾기
            </Button>
          </Box>
        </Box>
      ))
    )}
  </Box>
        </Box>
      </CardContent>
    </Card>
  </>
  );
}

export default VideoStream;
