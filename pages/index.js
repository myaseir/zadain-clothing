import React from 'react'
import {client} from '../lib/client'
import { HeroBanner, EventsBanner, Newsletter, FeaturesBanner, Product } from '../components'
import { Navigation, A11y, Lazy } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Home = ({ products }) => {
  return (
    <>
  
      <HeroBanner />
      <EventsBanner />

      <div className="products-outer-container">
        <div className="subtitle">
          <span>PRODUCTS</span>
          <h2>Check What We Have</h2>
        </div>

        <div className="products-container">
          <Swiper
            breakpoints={{
              300: { slidesPerView: 1, spaceBetween: 100 },
              1000: { slidesPerView: 2, spaceBetween: 0 },
              1260: { slidesPerView: 3, spaceBetween: 0 }
            }}
            modules={[Navigation, A11y]}
            spaceBetween={0}
            slidesPerView={3}
            navigation
          >
            {products?.map(product => (
              <SwiperSlide key={product._id}>
                <Product product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <FeaturesBanner />
      <Newsletter />
    </>
  );
};


export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);
  // const bannerQuery = '*[_type == "banner"]';
  // const bannerData = await client.fetch(bannerQuery);

  return {
    props: { products }
  }
}

export default Home