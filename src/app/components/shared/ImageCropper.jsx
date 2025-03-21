'use client';

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check } from 'lucide-react';

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper({ 
  imageFile, 
  onCropComplete, 
  onCancel,
  aspectRatio = 1,
  circularCrop = true
}) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef(null);
  
  // Load the image when the component mounts
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImgSrc(reader.result?.toString() || '');
      });
      reader.readAsDataURL(imageFile);
    }
  }, [imageFile]);

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }

  const handleCropComplete = () => {
    if (!imgRef.current || !completedCrop) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    const pixelRatio = window.devicePixelRatio || 1;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Draw the cropped image
    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      // Create a new file from the blob
      const croppedImageFile = new File([blob], imageFile.name, {
        type: imageFile.type,
        lastModified: Date.now()
      });
      
      // Pass the cropped image file back
      onCropComplete(croppedImageFile);
    }, imageFile.type, 1);
  };

  if (!imgSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Crop Profile Image</h3>
          <button 
            type="button" 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={`border rounded-lg mb-4 overflow-hidden ${circularCrop ? 'cropper-circular' : ''}`}>
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop={circularCrop}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={imgSrc}
              onLoad={onImageLoad}
              className="max-h-96 w-auto"
            />
          </ReactCrop>
        </div>
        
        <div className="text-center text-sm text-gray-600 mb-4">
          Drag to reposition. Use handles to resize.
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCropComplete}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            <Check size={16} className="mr-2" />
            Apply Crop
          </button>
        </div>
      </div>
      
      {/* Add CSS for circular crop preview */}
      <style jsx global>{`
        .cropper-circular .ReactCrop__crop-selection {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
} 