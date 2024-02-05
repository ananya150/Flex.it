import React from 'react'
import Header from '@/components/create/Header';
import Provider from '@/components/create/Provider';
import CreateLink from '@/components/create/Create';


const Create = () => {
  return (
    <Provider>
      <div className='h-screen overflow-hidden bg-[#0D0D0D]'>
        <Header />
        <CreateLink/>
      </div>
    </Provider>
  )
}

export default Create