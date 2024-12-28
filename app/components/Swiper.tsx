import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const MySwiper: React.FC = () => {
  return (
    <div style={{ height: '100%', background: '#eee' }}>
      <Swiper
        className="mySwiper"
        modules={[Navigation]}
        navigation
        style={{ width: '100%', height: '100%' }}
      >
        {Array.from({ length: 4 }, (_, index) => (
          <SwiperSlide key={index} style={swiperSlideStyle}>
            Slide {index + 1}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const swiperSlideStyle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '18px',
  background: '#fff',
  display: 'flex',
  alignItems: 'left',
};

export default MySwiper;
