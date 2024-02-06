import React from 'react'
import Provider from '@/components/create/Provider'
import Header from '@/components/create/Header'
import Claim from '@/components/claim/Claim'
import { AccountService } from '@/service/wallet/service'
import { db } from '@/utils/db'
import { getKeyPairFromHash } from '@/components/claim/claimUtils'
import Claimed from '@/components/claim/Claimed'

const ClaimPage = async ({ params }: { params: { slug: string } }) => {

  const hashLink = params.slug;
  const {address} = await getKeyPairFromHash(hashLink);
  const data: any = await db.get(address);

  return (
    <Provider>
      <div className='h-screen overflow-hidden bg-[#0D0D0D]'>
        <Header />
          {
            data["isClaimed"] ? 
             <Claimed data={data} />
             :
             <Claim data={data} address={address} link={hashLink} /> 
          }
      </div>
    </Provider>
  )
}

export default ClaimPage