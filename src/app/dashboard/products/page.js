'use client';
import { useEffect, useState } from 'react';
import { CheckIcon, XCircleIcon } from '@heroicons/react/20/solid';
import Modal from '@common/Modal';
import FormProduct from '@components/FormProduct';
import axios from 'axios';
import endPoints from '@services/api';
import Alert from '@common/Alert';
import useAlert from '@hooks/useAlert';
import { deleteProduct } from '@services/api/products';
import Link from 'next/link';

export default function products() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const { alert, setAlert, toggleAlert } = useAlert();

  useEffect(() => {
    async function getProducts() {
      const response = await axios.get(endPoints.products.allProducts);
      const data = response.data;
      setProducts(data);
    }
    try {
      getProducts();
    } catch (error) {
      console.log(error);
    }
  }, [alert]);

  const handleDelete = (id) => {
    deleteProduct(id).then(() => {
      setAlert({
        active: true,
        message: 'Delete product succesfully',
        type: 'success',
        autoClose: false,
      });
    });
  };

  function transformValitUrl(images) {
    let result = images;
    if (images.startsWith('["') && images.endsWith('"]')) {
      result = images.slice(2, -2);
    }
    return result;
  }
  return (
    <>
      <Alert alert={alert} handleClose={toggleAlert} />
      <div className="lg:flex lg:items-center lg:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">List of products</h2>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <span className="sm:ml-3">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => setOpen(true)}
            >
              <CheckIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Add Product
            </button>
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Id
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products?.map((product) => (
                    <tr key={`product-item-${product.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={product.images[0]} alt="" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">${product.price}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/dashboard/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <XCircleIcon className="flex-shirk-0 h6 w-6 text-gray-400 cursor-pointer" aria-hidden="true" onClick={() => handleDelete(product.id)}></XCircleIcon>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <FormProduct setAlert={setAlert} setOpen={setOpen} />
      </Modal>
    </>
  );
}
