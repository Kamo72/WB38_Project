import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';

export default function AnalyticsOrderTimeline({ title, subheader, list, lineLength, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Timeline
        sx={{
          m: 0,
          p: 3,
          display: 'flex',
          flexDirection: 'row',
          [`& .${timelineItemClasses.root}`]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '20%', // 너비를 고정합니다
            position: 'relative',
            '&:not(:last-child):after': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: '47%',
              right: `-35%`, // 선의 길이를 prop에서 받은 값으로 설정합니다
              width: `70%`, // 선의 길이를 prop에서 받은 값의 두 배로 설정합니다
              height: '2px',
              backgroundColor: 'darkgrey', // 선의 색상을 설정합니다
            },
          },
          [`& .${timelineItemClasses.root}:before`]: {
            display: 'none',
          },
        }}
      >
        {list.map((item, index) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </Timeline>
    </Card>
  );
}

AnalyticsOrderTimeline.propTypes = {
  list: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
  lineLength: PropTypes.number, // 선의 길이를 설정하는 prop을 추가합니다
};

// ----------------------------------------------------------------------

function OrderItem({ item }) {
  const { type, title, text, isCompleted } = item;

  return (
    <TimelineItem>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="subtitle2">{title}</Typography>

        <TimelineSeparator>
          <TimelineDot
            color={
              (type === 'order1' && (isCompleted ? 'success' : 'error')) ||
              (type === 'order2' && (isCompleted ? 'success' : 'error')) ||
              (type === 'order3' && (isCompleted ? 'success' : 'error')) ||
              (type === 'order4' && (isCompleted ? 'success' : 'error')) ||
              (isCompleted ? 'success' : 'error')
            }
          />
        </TimelineSeparator>

        <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1 }}>
          {text}
        </Typography>
      </Box>
    </TimelineItem>
  );
}

OrderItem.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    isCompleted: PropTypes.bool,
  }),
};
