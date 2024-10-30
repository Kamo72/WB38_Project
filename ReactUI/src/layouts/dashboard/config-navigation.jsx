import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: icon('bars-solid'),
  },
  {
    title: 'chat',
    path: '/chat',
    icon: icon('chat'),
  },
  {
    title: 'history',
    path: '/history',
    icon: icon('history-card'),
  },
  {
    title: 'reference',
    path: '/reference',
    icon: icon('reference'),
  },
  {
    title: 'Chart',
    path: '/chart',
    icon: icon('map'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('login'),
  },
];

export default navConfig;
