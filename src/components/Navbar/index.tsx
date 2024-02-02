"use client";
import React, {useState, useEffect} from 'react'

const Navbar = () => {

    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        let lastScrollY = window.pageYOffset;
    
        const handleScroll = () => {
          const currentScrollY = window.pageYOffset;
    
          setIsVisible(lastScrollY > currentScrollY );
          lastScrollY = currentScrollY;
        };
    
        window.addEventListener('scroll', handleScroll);
    
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);    


  return (
    <nav style={{
        position: 'fixed',
        width: '100%',
        backgroundColor: 'black',
        transition: 'top 0.3s',
        top: isVisible ? '0' : '-100px', // Adjust -100px as needed
      }}>        
      <span className='text-white'>Nav</span>
      </nav>  
    )
}

export default Navbar