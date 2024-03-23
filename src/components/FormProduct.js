'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct, updateProduct } from '@services/api/products';
import PreviewImg from '@components/PreviewImg';
import { isDuplicateElement } from '@utils/arrayUtils';
import { saveImgToCloud } from '@services/api/saveImgToCloud';
import Alert from '@common/Alert';
import useAlert from '@hooks/useAlert';

export default function FormProduct({ setOpen, setAlert, product }) {
  const formRef = useRef(null);
  const router = useRouter();
  const { alert: newAlert, setAlert: setNewAlert, toggleAlert: toogleNewAlert } = useAlert();
  const [formDisabled, setFormDisabled] = useState(true);

  const [imagesList, setImagesList] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(formRef.current);

    //Array con  todas las url de las imagenes
    const imgWithCloudUrl = imagesList.map((img) => img.uploadUrl);

    const data = {
      title: formData.get('title'),
      price: parseInt(formData.get('price')),
      description: formData.get('description'),
      categoryId: parseInt(formData.get('category')),
      images: imgWithCloudUrl,
    };

    if (product) {
      updateProduct(product.id, data).then(() => {
        router.push('/dashboard/products/');
      });
    } else {
      addProduct(data)
        .then(() => {
          setAlert({
            active: true,
            message: 'Product added successfully',
            type: 'success',
            autoClose: true,
          });
          setOpen(false);
        })
        .catch((error) => {
          setAlert({
            active: true,
            message: error.message,
            type: 'error',
            autoClose: true,
          });
        });
    }
  };

  const onchangeImagens = async () => {
    //Desactivar el Boton Del Formulario
    setFormDisabled(true);

    //Obteniendo las imagenes del Formulario
    const formData = new FormData(formRef.current);
    const img = formData.get('images');

    //Creando la url blob  para  monstrar  en  PreviewImg
    const prewiewURL = URL.createObjectURL(img);

    //Verifica si la imagen selecionada ya fue agregada
    const imgIsDuplicate = isDuplicateElement({ array: imagesList, propertyName: 'name', propertyValue: img.name });

    // Si la imagen el Duplicada montamos el componente Alert dentro de  Formulario
    if (imgIsDuplicate) {
      setNewAlert({
        active: true,
        message: 'this image already exists',
        type: 'success',
        autoClose: false,
      });
    } else {
      //Actualizamos el estado para rasterar todas las imagenes seleccionadas
      setImagesList([...imagesList, { prewiew: prewiewURL, uploadUrl: null, name: img.name }]);

      const lastIndex = imagesList.length;
      handleCloud();

      //Funcion para subir la imagen a la nube

      async function handleCloud() {
        try {
          const newUrl = await saveImgToCloud(img);

          //Actualizar el estado que rastrea las imagenes seleccionadas actualizando el valor de  uploadUrl

          setImagesList((prevImagesList) => {
            const updatedList = [...prevImagesList];
            updatedList[lastIndex].uploadUrl = newUrl;

            //Activar el boton una vez que la promesa se cumpla
            setFormDisabled(false);
            return updatedList;
          });

          // Reiniciar solo el campo de entrada de archivos
          const fileInput = formRef.current.querySelector('input[type="file"]');
          fileInput.value = ''; // Reiniciar el valor del campo de entrada de archivos
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    if (product) {
      const imagesListFromProduct = product.images.map((img, index) => {
        const transformUseInImagesList = { prewiew: img, uploadUrl: img, name: `cloud imagen ${index + 1}` };
        return transformUseInImagesList;
      });
      setImagesList(imagesListFromProduct);
      setFormDisabled(false);
    }
  }, [product]);

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="absolute">
        <Alert alert={newAlert} handleClose={toogleNewAlert}></Alert>
      </div>
      <div className="overflow-hidden">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                defaultValue={product?.title}
                type="text"
                name="title"
                id="title"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required={true}
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                defaultValue={product?.price}
                type="number"
                name="price"
                id="price"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required={true}
              />
            </div>
            <div className="col-span-6">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                defaultValue={product?.category}
                autoComplete="category-name"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="1">Clothes</option>
                <option value="2">Electronics</option>
                <option value="3">Furniture</option>
                <option value="4">Toys</option>
                <option value="5">Others</option>
              </select>
            </div>

            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                defaultValue={product?.description}
                name="description"
                id="description"
                autoComplete="description"
                rows="3"
                className="form-textarea mt-1 block w-full mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                required={true}
              />
            </div>
            <div className="col-span-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PreviewImg imagesList={imagesList} setImagesList={setImagesList} />

                    {!imagesList.length > 0 && (
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden={true}>
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}

                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input defaultValue={product?.images} id="images" name="images" type="file" className="sr-only" onChange={onchangeImagens} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${formDisabled ? 'opacity-70 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
            disabled={formDisabled}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
