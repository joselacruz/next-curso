'use client';
import LoadingSecondary from '@common/LoadingSecondary';
import { TrashIcon } from '@heroicons/react/20/solid';
import { filterOutElementByProperty } from '@utils/arrayUtils';

export default function PreviewImg({ imagesList, setImagesList }) {
  function handleDelete(nameImg) {
    const filter = filterOutElementByProperty({ array: imagesList, propertyName: 'name', propertyValue: nameImg });
    setImagesList(filter);
  }
  return (
    <>
      {imagesList.length > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {imagesList.map((image, index) => {
            const name = image.name;

            return (
              <div className="relative h-max" key={index + name}>
                <img src={image.prewiew} alt="Vista previa" className={`w-full h-20 object-cover ${image.uploadUrl == null ? 'opacity-50' : 'opacity-1'} `} />
                <span className="text-xs">{image.name}</span>
                <div className="absolute  left-10  top-6 animate-spin">{image.uploadUrl == null && <LoadingSecondary width={'32'} height={'32'} />}</div>
                {image.uploadUrl !== null && <TrashIcon className="text-white absolute w-6 top-0 cursor-pointer hover:text-red-700 " onClick={() => handleDelete(name)} />}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
