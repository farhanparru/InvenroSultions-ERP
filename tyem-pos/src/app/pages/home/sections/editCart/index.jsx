import React from 'react'
import { useSelector } from 'react-redux';
import CartItem from '../../components/CartItem';
import HomeCartFooter from '../cart/components/HomeCartFooter';
import EditCartFooter from './editCartFooter';

const EditCart = () => {
    const editOrder = useSelector((state) => state.order.editOrder);
    
    return (
        <div className="w-[35%] relative h-full bg-white-800 text-black border-l-[3px] border-chicket-border flex flex-col">
            {editOrder && editOrder.orderitems && editOrder.orderitems.length > 0 ? (
                <>
                    <div className="home__cart-top flex gap-3   ml-3 mr-3 mt-2">
                  
                        <div className="home__cart-items flex flex-col pb-60 flex-auto gap-2 p-3 overflow-y-scroll ">
                        
                            {[...editOrder?.orderitems]?.reverse().map((item, index) => {
                                return <CartItem key={item.id} index={index} item={item} />;
                            })}
                        </div>
                    </div>
                    <EditCartFooter />
                </>
            ) : (
                <div className="home__cart-empty">
                    No items in the cart.
                </div>
            )}

        </div>
    )
}

export default EditCart