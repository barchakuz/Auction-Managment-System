import React, { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import Style from './featureItem.module.css';


const MainBanner = () => {
  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2620&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
    },

    {
      url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
    },
    {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  let Background = slides[currentIndex].url;

  return (
    <div 
      style={{maxWidth:'100%', marginTop:'1rem', height:'780px', width:'full', margin:'auto', marginTop:'0.5rem', position:'relative' }}
    >
      <div
        style={{zIndex:11, display:'flex', alignItems:'center', justifyContent:'center', height:'full', width:'full', backgroundPosition:'center',backgroundSize:'cover', transitionDuration:'500ms' }}
      >
        <img src={slides[currentIndex].url} alt='img' 
        style={{zIndex:11, height:'600px', width:'100vw', objectFit:'cover', alignContent:'center',backgroundSize:'cover', transitionDuration:'500ms' }}

        />
      </div>
      {/* Left Arrow */}
      <div  
      className={Style.box}
      style={{ zIndex:111,display:'none', position:'absolute', top:'50%', transform:"translate(-0px, -50%)", left:'1.25rem', fontSize:'1.5rem', lineHeight:'2rem', borderRadius:'9999px', padding:'0.5rem', backgroundColor:'rgb(0 0 0 / 0.2)',color:'white', cursor:'pointer'  }}>

        <BsChevronCompactLeft onClick={prevSlide} color='yellow' size={30} />
      </div>
      {/* Right Arrow */}
      <div 
       className={Style.box}
      style={{zIndex:111,display:'none', position:'absolute', top:'50%', transform:"translate(-0px, -50%)", left:'1.25rem', fontSize:'1.5rem', lineHeight:'2rem', borderRadius:'9999px', padding:'0.5rem', backgroundColor:'rgb(0 0 0 / 0.2)',color:'white', cursor:'pointer'  }}
      >
        <BsChevronCompactRight onClick={nextSlide} color='yellow' size={30} />
      </div>
      <div
      style={{display:'flex', top:'1rem',justifyContent:'center', paddingTop:'0.5rem', paddingBottom:'0.5rem', zIndex:111  }}
>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            style={{fontSize:'1z.5rem', lineHeight:'2rem',cursor:'pointer'  }}
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainBanner
