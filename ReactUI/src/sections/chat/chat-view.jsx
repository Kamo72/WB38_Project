import React, { useRef, useEffect, useState } from 'react';
import { TextField, List, ListItem, ListItemText, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { error } from 'src/theme/palette';
import Avatar from '@mui/material/Avatar';

export default function Chat() {
  // 섹션 => db로 요청하기 위한 변수, 각각 1~4번째 섹션
  // type1, type2으로 요청, question으로 받기
  const [type1, setType1] = useState('');
  const [type2, setType2] = useState('');
  const [question, setQuestion] = useState('');

  // 메세지 변수
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // 프로필 이미지
  const photo = '/assets/images/avatars/avatar_25.jpg';
  const renderAvatar = (
    <Avatar
      alt="photo"
      src={photo}
    />
  );

  const messagesEndRef = useRef(null);

  // 스크롤바 아래로
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 상담 내용에 대한 솔루션을 chat-view에 입장 시 즉시 요청
  useEffect(() => {
    axios.post('http://127.0.0.1:3005/chat', 
    {
      diseaseid: sessionStorage.getItem('diseaseid'),
      improvement: sessionStorage.getItem('improvement'),
      possibility: sessionStorage.getItem('possibility'),
    })
    .then((response) => {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}`;
      setMessages(prev => [...prev, {
        text: response.data.answer, 
        timestamp: time,
        user: false,
        isQuestion: true,
        isMessageQuestion: true,
      }]);
    })
  }, []);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleSendMessage = (event) => {
    if (event.key === 'Enter') {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}`;
      setMessages([...messages, { text: input, timestamp: time, user: true }]);
      setInput('');
      event.preventDefault();

      sendMessage(null, null, null, input);
    }
  };

  // 메세지 출력
  const sendMessage = (diseaseid, possibility, improvement, text) => {
    const data = {
      diseaseid,
      possibility,
      improvement,
      text,
    }

    fetch('http://127.0.0.1:3005/chat',{
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      console.log(response.body.data)
      if(!response.ok){
        throw new Error(response.status)
      }
      return response.json()
    })
    .then((responseData) => {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}`;
      setMessages(prev => [...prev, { text: JSON.stringify(responseData.answer), timestamp: time, user: false, isQuestion: true, isAnswerQuestion: true}]);
    })
  }

  // 첫번째 섹션 클릭 시 호출
  const handleQuestion = (name) => {
    let lists = [];
    switch(name) {
      case "피부관리":
        lists = ["피부질환증상", "피부질환치료", "피부질환예방", "피부질환식단"];
        break;
      case "건강관리":
        lists = ["식욕부진", "운동과 활동", "예방접종", "물 마시는 양", "기타 건강문제"];
        break;
      case "행동문제":
        lists = ["행동교정", "분리불안", "과도한 짖음", "공격성"];
        break;
      case "기타관리":
        lists = ["털 빠짐", "동물훈련", "사회화", "여행과 동반", "미용관리"];
        break;
      default:
    }
    lists.forEach((q) => {
      const now = new Date();
      const time = `${now.getHours()}:${now.getMinutes()}`;
      setMessages(prev => [...prev, { text: q, timestamp: time, user: false, isQuestion: true }]);

    });
  };

  // 두번째 섹션 클릭 시 호출
  const handleQuestion2 = (name2) => {
    const data = { type1, type2: name2 };
    fetch('http://127.0.0.1:3005/section', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((responseData) => {
      responseData.answer.forEach(q => {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes()}`;
        setMessages(prev => [...prev, { text: q, timestamp: time, user: false, isQuestion: true, isThirdQuestion: true }]);
      });
    })
  };

  // 세번째 섹션 클릭 시 호출
  const handleQuestion3 = (name3) => {
    const data = { type1, type2, question: name3 };
    fetch('http://127.0.0.1:3005/section', {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then((responseData) => {
      responseData.answer.forEach(q => {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes()}`;
        setMessages(prev => [...prev, { text: q, timestamp: time, user: false, isQuestion: true, isFourthQuestion: true }]);
      });
    })
  };

  // 첫번째 섹션 클릭
  const handleQuestionClick = (name) => {
    setType1(name);
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}`;
    setMessages([...messages, { text: name, timestamp: time, user: true }]);
    handleQuestion(name);
  };

  // 두번째 섹션 클릭
  const handleQuestion2Click = (name2) => {
    setType2(name2);
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}`;
    setMessages(prev => [...prev, { text: name2, timestamp: time, user: true }]);
    handleQuestion2(name2);
  };

  // 세번째 섹션 클릭
  const handleQuestion3Click = (name3) => {
    setQuestion(name3);
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}`;
    setMessages(prev => [...prev, { text: name3, timestamp: time, user: true }]);
    handleQuestion3(name3);
  };

  const sections = [
    { img: "/animal-skin.png", name: "피부관리" },
    { img: "/animal-health.png", name: "건강관리" },
    { img: "/animal-action.png", name: "행동문제" },
    { img: "/animal-etc.png", name: "기타관리" },
  ];

  const renderMessage = (message, index) => {
    if (!message.user && message.isQuestion) {

      if (message.isThirdQuestion) {
        return (
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleQuestion3Click(message.text)} 
            style={{ margin: '5px 0', display: 'block', width: '50%' }}
          >
            {message.text}
          </Button>
        );
      }

      if (message.isFourthQuestion) {
        return (
          <div style={{ fontFamily: 'Jalnan, Roboto, sans-serif', margin: '5px 0', display: 'block', width: '50%' }}>
            {message.text}
          </div>
        );
      }

      if (message.isMessageQuestion) {
        return (
          <div style={{ fontFamily: 'Jalnan, Roboto, sans-serif', margin: '5px 0', display: 'block', width: '50%' }}>
            {renderAvatar}
            {message.text.map((line, i) => (
              <div key={i}>
                {line}
              </div>
            ))}
          </div>
        );
      }

      if (message.isAnswerQuestion) {
        return (
          <div style={{ fontFamily: 'Jalnan, Roboto, sans-serif', margin: '5px 0', display: 'block', width: '50%' }}>
            {renderAvatar}
            {message.text}
          </div>
        );
      }

      return (
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleQuestion2Click(message.text)} 
          style={{ margin: '5px 0', display: 'block', width: '50%' }}
        >
          {message.text}
        </Button>
      );
    } 
  
    return (
      <ListItem 
        key={index} 
        alignItems="flex-start" 
        style={{ flexDirection: message.user ? 'row-reverse' : 'row' }}
      >
        <ListItemText
          primary={
            <Typography style={{ fontFamily: 'Jalnan, Roboto, sans-serif' }}>
              {message.text}
            </Typography>
          }
          secondary={
            <Typography style={{ fontFamily: 'Jalnan, Roboto, sans-serif' }}>
              {message.timestamp}
            </Typography>
          }
          style={{ textAlign: message.user ? 'right' : 'left' }}
        />
      </ListItem>
    );
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
      <div style={{ fontFamily: 'Jalnan, Roboto, sans-serif', width: '65%', height: '84vh', margin: 'auto', backgroundColor: '#8fb0c6', padding: '20px', borderRadius: '15px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <img src="/favicon/favicon.ico" alt="Logo" style={{ width: '34px', height: '34px' }} />
          <Button variant="contained" color="primary" component={Link} to="/dashboard">Go to Dashboard</Button>
        </div>
        <div style={{ height: '86%', marginBottom: '10px', padding: '10px', border: '1px solid #bbb', borderRadius: '15px', backgroundColor: '#fff', overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '10px' }}>
            {sections.map((section, index) => (
              <Box key={index} component="div" sx={{ width: '120px', height: '120px', boxShadow: 1, border: '4px solid #8fb0c6', borderRadius: '15px', backgroundImage: `url(${section.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={() => handleQuestionClick(section.name)}>
                <Button component="a" href="#" style={{ padding: 0, display: 'block', width: '100%', height: '100%' }} />
              </Box>
            ))}
          </div>
          <List>
            {messages.map((message, index) => renderMessage(message, index))}
            <div ref={messagesEndRef} />
          </List>
        </div>
        <TextField 
          value={input}
          onChange={handleInputChange} 
          onKeyDown={handleSendMessage}
          style={{ width: '100%', borderRadius: '15px', backgroundColor: '#fff' }}
          variant="outlined"
          placeholder="Send a message"
          inputProps={{
            style: { fontFamily: 'Jalnan, Roboto, sans-serif' }
          }}
        />
      </div>
    </>
  );
  
}
