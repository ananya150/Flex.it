import React from 'react'
import Provider from '@/components/create/Provider'
import Header from '@/components/create/Header'
import Claim from '@/components/claim/Claim'

const ClaimPage = ({ params }: { params: { slug: string } }) => {

  const data = {
    "amount": "0.1",
    "image": "",
    "isClaimed": false,
    "message": "",
    "toAddress": "0x29a3214f43cebc782bcba48a82999eafa4901e58",
    "type": 0
  }

  const address = '0x29a3214f43cebc782bcba48a82999eafa4901e58';
  const hashLink = params.slug;

  return (
    <Provider>
      <div className='h-screen overflow-hidden bg-[#0D0D0D]'>
        <Header />
        <Claim data={data} address={address} link={hashLink} />
      </div>
    </Provider>
  )
}

export default ClaimPage