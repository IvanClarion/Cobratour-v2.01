import React, { useState } from 'react'
import CobyProfile from './Images/coby.webp'
import ExitModal from './Icons/x.svg'
function Coby() {
    const [chatBot, setChatBot] = useState(false);

    const openChatBot = (e)=>{
        e.stopPropagation()
        setChatBot(true)
    }
    const closeChatBot = (e)=>{
        e.stopPropagation()
        setChatBot(false)
    }
  return (
    <>
    <section className='flex h-svh w-svw justify-center items-center'>
        {chatBot && (
        
        <section className='modal-section  gap-2 justify-center items-start'>
        <div className='flex h-full items-start my-5 gap-2'>
            
            <iframe src='https://interfaces.zapier.com/embed/chatbot/cm7sstze8000tivebfpax0y8v'
            style={{height:'90%', width:'350px', borderRadius:'20px'}}
           
            />
            <img src={ExitModal} alt="" className='exit-modal2' onClick={closeChatBot} />
        </div>
        </section>
         )}
         {!chatBot && ( 
         <div className="coby-profile" onClick={openChatBot}>
            <img src={CobyProfile} alt="" className='rounded-full' />
         </div>
         )}
    </section>
    </>
  )
}

export default Coby
