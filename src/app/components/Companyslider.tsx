"use client";
import React from 'react';
import Slider from 'react-slick';

const CarCompanySlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
    '/sliderImages/BrandLogo_2.png',
    '/sliderImages/BrandLogo_3.png',
    '/sliderImages/BrandLogo_4.png',
    '/sliderImages/BrandLogo_5.png',
    '/sliderImages/BrandLogo_6.png',
    '/sliderImages/BrandLogo_7.png',
    '/sliderImages/BrandLogo_8.png',
    '/sliderImages/BrandLogo_9.png',
    '/sliderImages/BrandLogo_10.png',
    '/sliderImages/BrandLogo_11.png',
    '/sliderImages/BrandLogo_12.png',
    '/sliderImages/BrandLogo_13.png',
    '/sliderImages/BrandLogo_14.png',
    '/sliderImages/BrandLogo_15.png',
    '/sliderImages/BrandLogo_16.png',
    '/sliderImages/BrandLogo_17.png',
    '/sliderImages/BrandLogo_18.png',
    '/sliderImages/BrandLogo_19.png',
    '/sliderImages/BrandLogo_20.png',
    '/sliderImages/BrandLogo_21.png',
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {carCompanies.map((logo, index) => (
          <div key={index}>
            <img
              src={logo}
              alt={`Car Company ${index + 1}`}
              className="company-logo"
            />
          </div>
        ))}
      </Slider>
      <style jsx>{`
        .slider-container {
          width: 80%;
          margin: 0 auto;
          padding: 40px 0;
        }
        .company-logo {
          width: 100%;
          height: 150px;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
};

export default CarCompanySlider;
