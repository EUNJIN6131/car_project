import React, { useState, useEffect, useRef } from 'react';
import { Card, CardMedia } from '@mui/material';
import './Slideshow.css';

// 이미지 데이터를 배열로 정의
const imagesData = [];

for (let i = 1; i < 11; i++) {
  const image = { id: i, src: `https://licenseplate-iru.s3.ap-northeast-2.amazonaws.com/sample/possible/img${i}.jpg` };
  imagesData.push(image);
}
export default function Images({ showRecord }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageRef = useRef(null); // Ref 생성

  // 현재 이미지를 가져와서 showRecord 함수에 전달
  const currentImage = imagesData[currentImageIndex];

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesData.length);
    }, 20000);
    return () => {
      console.log("currentImageIndex", currentImageIndex)
      if (currentImage) {
        // 이미지 Ref에 접근하여 src 속성 얻기
        const src = imageRef.current ? imageRef.current.src : '';
        loadImage(src);
      }
      clearInterval(interval);
    };
  }, [currentImageIndex]);


  const loadImage = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc);
      if (response.ok) {
        const blob = await response.blob();
        showRecord(blob);
      } else {
        console.error('Failed to load image');
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  // useEffect(() => {
  //   console.log("currentImageIndex", currentImageIndex)
  //   if (currentImage) {
  //     // 이미지 Ref에 접근하여 src 속성 얻기
  //     const src = imageRef.current ? imageRef.current.src : '';
  //     loadImage(src);
  //   }
  // }, [currentImageIndex]);

  return (
    <div className="slideshow-container">
      {currentImage && (
        <Card  style={{ height: 'fit-content', width: '100%' }}>
          <CardMedia
            component="img"
            alt="Displayed Image"
            src={currentImage.src}
            ref={imageRef} // 이미지 요소에 Ref 설정
            style={{ height: '50vh', width: '100%', objectFit: 'cover' }}
          />
        </Card>
      )}
    </div>
  );
}
