import React, { useRef } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import { HiOutlineTrash } from 'react-icons/hi';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import { urlFor } from '../lib/client';

const Cart = () => {
  const cartRef = useRef();
  const router = useRouter();
  const { cartItems, totalPrice, totalQty, onRemove, toggleCartItemQuantity } = useStateContext();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    router.push('/order');
  };

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>
      <div className='cart-container'>
        <div className='cart-items'>
          {cartItems.length < 1 && (
            <div className='empty-cart'>
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
              <button 
                className='btn' 
                onClick={() => router.push('/')}
              >
                Continue Shopping
              </button>
            </div>
          )}

          {cartItems.length >= 1 && cartItems.map((item) => (
            <div key={`${item._id}-${item.selectedSize}`} className='item-card'>
              <div className='item-image'>
                <img src={urlFor(item?.image[0])} alt={item.name} />
              </div>
              <div className='item-details'>
                <div className='name-and-remove'>
                  <h3>{item.name}</h3>  
                  <button 
                    type='button' 
                    onClick={() => onRemove(item)} 
                    className='remove-item'
                  >
                    <HiOutlineTrash size={28} />  
                  </button>
                </div>
                {item.selectedSize && <p className='item-size'>Size: {item.selectedSize}</p>}
                <p className='item-tag'>Dress</p>
                <p className='delivery-est'>Delivery Estimation</p>
                <p className='delivery-days'>5 Working Days</p>
                <div className='price-and-qty'>
                  <span className='price'>PKR{item.price * item.quantity}</span>  
                  <div>
                    <span 
                      className='minus' 
                      onClick={() => toggleCartItemQuantity(item._id, item.selectedSize, 'dec')}
                    >
                      <AiOutlineMinus />
                    </span>
                    <span className='num'>{item.quantity}</span>
                    <span 
                      className='plus' 
                      onClick={() => toggleCartItemQuantity(item._id, item.selectedSize, 'inc')}
                    >
                      <AiOutlinePlus />
                    </span>
                  </div>   
                </div>
              </div>
            </div>
          ))}    
        </div>

        {cartItems.length >= 1 && (
          <div className='order-summary'>
            <h3>Order Summary</h3>
            <div className='qty'>
              <p>Quantity</p>
              <span>{totalQty} Product{totalQty > 1 ? 's' : ''}</span>
            </div>
            <div className='subtotal'>
              <p>Sub Total</p>
              <span>PKR{totalPrice}</span>
            </div>
            <div>
              <button 
                className='btn' 
                type='button' 
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>         
          </div>
        )}  
      </div>
    </div>
  );
};

export default Cart;