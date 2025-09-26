import React from 'react'
import Image from 'next/image'
import img from '../src/assets/feature.png'
import Link from 'next/link'

const FeaturesBanner = () => {
  return (
    <section className='features-section'>
  <div className='title'>
    <h1>Unique and Authentic Designer Clothing</h1>
  </div>

  <div className='content'>
    <div className='left'>
      <div className="feature-background">
        Different from others
      </div>
      <div>
        <h3>Using High-Quality Fabrics</h3>
        <p>We use premium, soft, and breathable fabrics to ensure maximum comfort and durability in every outfit.</p>
      </div>
      <div>
        <h3>100% Handmade Embroidery</h3>
        <p>Each piece is carefully crafted with intricate hand embroidery, making every outfit truly unique and authentic.</p>
      </div>
      <div>
        <h3>Modern & Elegant Designs</h3>
        <p>Our collections blend traditional charm with contemporary fashion, perfect for any occasion or celebration.</p>
      </div>
      <div>
        <h3>Discounts on Bulk Orders</h3>
        <p>Enjoy exclusive savings when purchasing multiple pieces — ideal for family events or group celebrations.</p>
      </div>
    </div>

    <div className='right'>
      <Image src={img} width={300} height={350} alt='Clothing Image' />
      <div>
        <p>Each outfit is ethically crafted in our family-owned workshop with unmatched attention to detail. Fabrics and embroidery are 100% traceable, ensuring authenticity and quality in every piece.</p>
        <Link href={'/products'}>
          <button className='btn' type='button'>See All Products</button>
        </Link>
      </div>
    </div>
  </div>
</section>

  )
}

export default FeaturesBanner
