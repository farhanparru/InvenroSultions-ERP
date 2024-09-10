import React, { useEffect } from 'react'
import HomeItemsSection from '../home/sections/body/components/HomeItemsSection'
import { getItems } from '../home/store/homeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreUserData } from '../../store/storeUser/storeUserSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const store_user = useSelector(getStoreUserData);

  useEffect(() => {
    dispatch(getItems(store_user?.accessToken));

  }, [])
  return (
    <div className='bg-white h-full'>
      <HomeItemsSection
        items_only={true}
      />
    </div>
  )
}

export default Orders
