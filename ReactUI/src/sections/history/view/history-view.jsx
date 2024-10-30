import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

export default function HistoryView() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('user');
    if (userInfo) {
      setLoading(true);
      axios.post('http://127.0.0.1:3005/ai', { user: JSON.parse(userInfo) })
        .then((response) => {
          setHistory(response.data.userHistory.history);
          setLoading(false);
        })
        .catch((error) => {
          console.error('There was an error!', error);
          setLoading(false);
        });
    }
  }, []);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">History</Typography>
      </Stack>

      <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
        <PostSearch />
        <PostSort
          options={[
            { value: 'latest', label: 'time' },
            { value: 'popular', label: 'disease' },
            { value: 'oldest', label: 'abc' },
          ]}
        />
      </Stack>

      <>
      {loading ? (
        <div
          style={{marginTop: '120px'}}
          className="loader"
        />
      ) : (
      <Grid container spacing={3}>
        {history.map((historyItem, index) => (
          // historyItem을 PostCard 컴포넌트로 전달
          <PostCard key={index} history={historyItem} />
        ))}
      </Grid>
      )}
      </>

    </Container>
  );
}
