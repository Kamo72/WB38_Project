import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';

const websites = [
  {
    name: "PetMD",
    url: "https://www.petmd.com/",
    description: "PetMD는 반려동물의 건강을 위한 다양한 정보를 제공하는 사이트입니다. 질병 정보, 건강 팁, 영양 정보 등을 찾을 수 있습니다.",
    image: "/1.PNG"
  },
  {
    name: "Veterinary Manual",
    url: "https://www.msdvetmanual.com/",
    description: "Veterinary Manual는 전문가들이 작성한 반려동물의 질병 및 치료 관련 정보를 제공합니다. 심화된 내용을 원하는 사용자에게 적합한 사이트입니다.",
    image: "/2.PNG"
  },
];

// ----------------------------------------------------------------------

export default function ReferenceView() {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Reference
      </Typography>

      <Grid container direction="column" spacing={3}>
        {websites.map((website, index) => (
          <Grid key={index} item xs={12}>
            <Link href={website.url} target="_blank" rel="noopener" underline="none">
              <Card sx={{ height: "fit-content", overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  height="auto"
                  image={website.image}
                  alt={website.name}
                />
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {website.name}
                  </Typography>
                  <Typography variant="body2">
                    {website.description}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
