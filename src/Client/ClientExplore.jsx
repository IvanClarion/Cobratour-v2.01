
import Spline from '@splinetool/react-spline';
import MobilePanning from './Icons/mobile-panning.svg'
import MobileRotation from './Icons/mobile-rotation.svg'
import MobileZoom from './Icons/mobile-zoom.svg'
import PCPanning from './Icons/pc-panning.svg'
import PCRotate from './Icons/pc-rotate.svg'
import PCZoom from './Icons/pc-zoom.svg'
import Settings from './Icons/settings.svg'
import Tutorial from './Icons/tutorial.svg'
import { useState } from 'react';
import {AnimatePresence, motion} from 'framer-motion'
function ClientExplore() {
  const [tutorial, setTutorial] = useState(true);

  const closeTutorial = (e)=>{
    e.stopPropagation();
    setTutorial(false)
  }
  const openTutorial = (e)=>{
    e.stopPropagation();
    setTutorial(true)
  }
  return (
    <section >
      <section className='flex items-center h-screen  justify-start '>
        <div className='mx-2 flex gap-3 top-20 fixed text-white '>
        <button onClick={openTutorial} className='bg-home gap-2 flex items-center p-3 cursor-pointer rounded-md'>
          <img src={Tutorial} alt="" />
          <label className='hidden lg:block'>Tutorial</label>
        </button>
        <button className='bg-home gap-2 flex items-center p-3 cursor-pointer rounded-md'>
          <img src={Settings} alt="" />
          <label className='hidden lg:block'>Settings</label>
        </button>  
        </div>
        
        <Spline scene="https://prod.spline.design/qS6bUQoGN1zbpPsO/scene.splinecode?quality=low" />
        
      </section>
          
        
        {tutorial && ( 
          <AnimatePresence>
          <motion.div
          initial={{scaleY:0.1, opacity:0}}
          animate={{scaleY:1, opacity:1}}
          exit={{scaleY:0.1, opacity:0}}
          transition={{duration:1, delay:0.2}}
          >
          <section className='explore-modal-section z-50'>
            <div className='hidden lg:p-5 rounded-lg lg:gap-y-5 lg:flex lg:flex-col justify-center items-center bg-dark-gray'>
            <label className='text-light-maroon font-semibold text-3xl'>For Desktop</label>
            <div className='grid grid-cols-3 gap-x-5'>
              <div className='explore-container'>
                <label>Rotate</label>
                <img src={PCRotate} alt="pc-rotate" />
                <p>Hold Left Click To Rotate</p>
              </div>
              <div className='explore-container'>
                <label>Panning</label>
                <img src={PCPanning} alt="pc-rotate" />
                <p>Hold Ctrl and Left Mouse To Pan</p>
              </div>
              <div className='explore-container'>
                <label>Zoom</label>
                <img src={PCZoom} alt="pc-rotate" />
                <p>Use Scroll Wheel To Zoom In and Zoom Out</p>
              </div>
            </div>
            <button onClick={closeTutorial} className='explore-button'>I understand</button>
            </div>

            <div className='flex p-3 rounded-lg gap-y-3 lg:hidden flex-col justify-center h-fit w-w-90vw items-center bg-dark-gray'>
            <label className='text-light-maroon font-semibold text-xl'>For Mobile and Tablets</label>
            <div className='grid grid-cols-1 gap-y-5'>
              <div className='explore-container'>
                <label>Rotate</label>
                <img src={MobileRotation} alt="pc-rotate" className='size-8' />
                <p>Use Two Finger To Rotate </p>
              </div>
              <div className='explore-container'>
                <label>Panning</label>
                <img src={MobilePanning} alt="pc-rotate" className='size-8' />
                <p>Use One Finger To Pan</p>
              </div>
              <div className='explore-container'>
                <label>Zoom</label>
                <img src={MobileZoom} alt="pc-rotate"  className='size-8'/>
                <p>Use Two FInger And Pinch To Zoom In or Zoom Out</p>
              </div>
            </div>
            <button onClick={closeTutorial} className='explore-button'>I understand</button>
            </div>
          </section>
          </motion.div>
          </AnimatePresence>
          )}
          
    </section>
  );
}

export default ClientExplore
