"use client";
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';

const CarCompanySlider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const carCompanies = [
    '/sliderImages/BrandLogo_1.png',
    '/sliderImages/BrandLogo_3.png',
    '/sliderImages/BrandLogo_4.png',
    '/sliderImages/BrandLogo_6.png',
    '/sliderImages/BrandLogo_7.png',
    '/sliderImages/BrandLogo_8.png',
    '/sliderImages/BrandLogo_9.png',
    '/sliderImages/BrandLogo_10.png',
    '/sliderImages/BrandLogo_12.png',
    '/sliderImages/BrandLogo_13.png',
    '/sliderImages/BrandLogo_15.png',
    '/sliderImages/BrandLogo_16.png',
    '/sliderImages/BrandLogo_17.png',
    '/sliderImages/BrandLogo_18.png',
    '/sliderImages/BrandLogo_19.png',
    '/sliderImages/BrandLogo_20.png',
    '/sliderImages/BrandLogo_21.png',
  ];

  if (!mounted) {
    return (
      <div className="w-4/5 mx-auto py-10 flex items-center justify-center min-h-[150px]">
        <div className="grid grid-cols-3 gap-6 w-full opacity-60">
          {carCompanies.slice(0, 3).map((logo, index) => (
            <div key={index} className="flex justify-center">
              <img src={logo} alt="Car Company" className="w-full h-[150px] object-contain" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-4/5 mx-auto py-10">
      <Slider {...settings}>
        {carCompanies.map((logo, index) => (
          <div key={index}>
            <img
              src={logo}
              alt={`Car Company ${index + 1}`}
              className="w-full h-[150px] object-contain"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarCompanySlider;
