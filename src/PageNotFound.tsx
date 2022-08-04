import React from 'react';
import image404 from './404.png';

const PageNotFound: React.FC = () => {
   return (
      <div className="w-screen h-screen bg-slate-100 absolute top-0">
         <div className="mx-0 mt-14 mb-10 text-center">
            <img
               className="m-auto"
               width="256"
               height="256"
               title=""
               alt=""
               src={image404}
            />
            <h1 className="text-7xl font-extralight mx-auto mt-4 mb-12">404</h1>
            <p>찾을 수 없는 페이지입니다.</p>
            <p>요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요.</p>
         </div>
      </div>
   );
};

export default PageNotFound;
