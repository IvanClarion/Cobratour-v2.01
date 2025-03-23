import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import MobilePanning from './Icons/mobile-panning.svg';
import MobileRotation from './Icons/mobile-rotation.svg';
import MobileZoom from './Icons/mobile-zoom.svg';
import PCPanning from './Icons/pc-panning.svg';
import PCRotate from './Icons/pc-rotate.svg';
import PCZoom from './Icons/pc-zoom.svg';
import Building from './Icons/building.svg';
import Tutorial from './Icons/tutorial.svg';
import DropDown from './Images/dropdown.svg';
import ExitModal from './Icons/client-exit-modal.svg';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';

function ClientExplore() {
  const [tutorial, setTutorial] = useState(true);
  const [buildingListModal, setBuildingListModal] = useState(false);
  const [facilitiesList, setFacilitiesList] = useState([]);
  const [expandedFacilities, setExpandedFacilities] = useState({});

  useEffect(() => {
    const fetchFacilities = async () => {
      const querySnapshot = await getDocs(collection(db, "Facilities"));
      const facilitiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFacilitiesList(facilitiesData);
    };

    fetchFacilities();
  }, []);

  const closeTutorial = (e) => {
    e.stopPropagation();
    setTutorial(false);
  };

  const openTutorial = (e) => {
    e.stopPropagation();
    setTutorial(true);
  };

  const toggleFacilityList = (facilityId) => {
    setExpandedFacilities(prevState => ({
      ...prevState,
      [facilityId]: !prevState[facilityId]
    }));
  };

  const openBuildingListModal = (e) => {
    e.stopPropagation();
    setBuildingListModal(true);
  };

  const closeBuildingListModal = (e) => {
    e.stopPropagation();
    setBuildingListModal(false);
  };

  return (
    <section className='image-pixelated'>
      <section className='flex items-center h-screen justify-start '>
        <div className='mx-2 flex gap-3 top-20 fixed text-white '>
          <button onClick={openTutorial} className='bg-home gap-2 flex items-center p-3 cursor-pointer rounded-md'>
            <img src={Tutorial} alt="" />
            <p className='hidden lg:block'>Tutorial</p>
          </button>
          <button onClick={openBuildingListModal} className='bg-home gap-2 flex items-center p-3 cursor-pointer rounded-md'>
            <img src={Building} alt="" />
            <p className='hidden lg:block'>Facilities</p>
          </button>
        </div>

        <Spline scene="https://prod.spline.design/qS6bUQoGN1zbpPsO/scene.splinecode?quality=low" />
      </section>

      {tutorial && (
        <AnimatePresence>
          <motion.div
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
            transition={{ duration: 1 }}
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
                    <img src={MobileZoom} alt="pc-rotate" className='size-8' />
                    <p>Use Two Fingers And Pinch To Zoom In or Zoom Out</p>
                  </div>
                </div>
                <button onClick={closeTutorial} className='explore-button'>I understand</button>
              </div>
            </section>
          </motion.div>
        </AnimatePresence>
      )}

      {buildingListModal && (
        <section className='modal-section break-words z-50'>
          <div className='building-container'>
            <div className='flex items-center gap-5'>
              <img onClick={closeBuildingListModal} src={ExitModal} alt='Exit Modal' className='exit-modal min-w-5 max-w-10' />
              <label className='text-2xl font-semibold'>Building Facilities</label>
            </div>
            <div className='building-list'>
              {facilitiesList.map((facility) => (
                <div key={facility.id} className='building-list-container relative'>
                  <article className='flex justify-between items-center'>
                    <img src={Building} alt="" className='bg-maroon-custom rounded-full p-2' />
                    <label className='lg:text-xl text-md font-semibold '>{facility.buildingName}</label>
                    <img src={DropDown} alt="" className='min-w-5 max-w-10' onClick={() => toggleFacilityList(facility.id)} />
                  </article>
                  <AnimatePresence>
                    {expandedFacilities[facility.id] && (
                      <motion.div className='overflow-hidden p-2'
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{ scaleY: 1, opacity: 1 }}
                        exit={{ scaleY: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ul className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 text-center h-52 overflow-y-scroll gap-3'>
                          {facility.facilities.map((facilityItem, index) => (
                            <li key={index} className='building-list-container2'>{facilityItem}</li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </section>
  );
}

export default ClientExplore;