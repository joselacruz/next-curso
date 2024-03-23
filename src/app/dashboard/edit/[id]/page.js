'use client';
import React, { useEffect, useState } from 'react';
import FormProduct from '@components/FormProduct';
import { useRouter } from 'next/navigation';
import endPoints from '@services/api';
import axios from 'axios';

export default function pageProductEdit(params) {
  const router = useRouter();
  const ProductId = params.params.id;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function get() {
      const response = await axios.get(endPoints.products.getProduct(ProductId));
      const data = response.data;
      setProduct(data);
    }

    get();
  }, [ProductId]);
  return <FormProduct product={product}></FormProduct>;
}
