import React, { useEffect, useRef } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

let markers = []; // 마커들을 저장할 배열을 선언합니다.

function loadScript(url) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}

function searchNearby(map, center, keyword = null) {
  const service = new window.google.maps.places.PlacesService(map);

  const request = {
    location: center,
    radius: '5000',
    type: ['veterinary_care'],
  };

  if (keyword) {
    request.keyword = keyword;
  }

  service.nearbySearch(request, (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      // 새로운 검색을 시작하기 전에 이전에 생성된 모든 마커를 제거합니다.
      for (let i = 0; i < markers.length; i += 1) {
        markers[i].setMap(null);
      }
      markers = [];

      // 검색된 장소들에 대한 bounds를 계산합니다.
      const bounds = new window.google.maps.LatLngBounds();

      for (let i = 0; i < results.length; i += 1) {
        createMarker(results[i], map);
        bounds.extend(results[i].geometry.location);
      }

      // 지도의 뷰포트를 검색된 장소들이 모두 보이도록 조절합니다.
      map.fitBounds(bounds);
    }
  });
}

function createMarker(place, map) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new window.google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  const infowindow = new window.google.maps.InfoWindow({
    content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
  });

  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });

  markers.push(marker); // 생성된 마커를 markers 배열에 추가합니다.
}

export default function MapCard() {
  const searchBoxRef = useRef();
  const mapRef = useRef();
  const map = useRef();
  const center = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      center.current = { lat: latitude, lng: longitude };

      loadScript(`https://maps.googleapis.com/maps/api/js?key=AIzaSyDmKptU2tr3XoYGeq41nxAviHPDCLg64D0&libraries=places`)
        .then(() => {
          map.current = new window.google.maps.Map(mapRef.current, {
            center: center.current,
            zoom: 12,
          });

          const searchBox = new window.google.maps.places.SearchBox(searchBoxRef.current);

          map.current.addListener('bounds_changed', () => {
            searchBox.setBounds(map.current.getBounds());
          });

          searchBox.addListener('places_changed', () => {
            const places = searchBox.getPlaces();

            if (places.length === 0) {
              return;
            }

            const bounds = new window.google.maps.LatLngBounds();
            places.forEach((place) => {
              if (!place.geometry || !place.geometry.location) {
                console.log("Returned place contains no geometry");
                return;
              }

              bounds.extend(place.geometry.location);
            });

            map.current.fitBounds(bounds);
          });
        });
    });
  }, []);

  const searchSpecialty = (keyword) => {
    if (map.current && center.current) {
      searchNearby(map.current, center.current, keyword);
    }
  };

  return (
    <Card sx={{ height: "fit-content", overflow: "hidden" }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Your Current Location
        </Typography>
        <TextField
          inputRef={searchBoxRef}
          placeholder="Search..."
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Box>
            <Button variant="contained" onClick={() => searchSpecialty()} style={{ margin: '10px' }}>가까운 동물병원 찾기</Button>
          </Box>
          <Box>
            <Button variant="contained" onClick={() => searchSpecialty('안과')} style={{ margin: '10px' }}>안과</Button>
            <Button variant="contained" onClick={() => searchSpecialty('피부')} style={{ margin: '10px' }}>피부</Button>
            <Button variant="contained" onClick={() => searchSpecialty('근골격')} style={{ margin: '10px' }}>근골격</Button>
            <Button variant="contained" onClick={() => searchSpecialty('흉부')} style={{ margin: '10px' }}>흉부</Button>
            <Button variant="contained" onClick={() => searchSpecialty('복부')} style={{ margin: '10px' }}>복부</Button>
          </Box>
        </Box>
        <div ref={mapRef} style={{ width: '100%', height: '600px', marginTop: '10px' }} />
      </CardContent>
    </Card>
  );
}
