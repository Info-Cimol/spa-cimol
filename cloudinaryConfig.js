import { v2 as cloudinary } from 'cloudinary-core';
import { useEffect } from 'react';

const CloudinaryConfig = () => {
  
    useEffect(() => {
    cloudinary.config({ 
      cloud_name: 'dzpbclwij', 
      api_key: '346628249128189', 
      api_secret: 'ymXLYIi5OJsUZYJHUjRnx2kxv8g' 
    });
  }, []); 

  return null; 
};

export default CloudinaryConfig;