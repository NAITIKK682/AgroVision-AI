import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HealthyDiseasedGallery = () => {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('tomato');

  const crops = [
    { id: 'tomato', name: 'Tomato / टमाटर' },
    { id: 'potato', name: 'Potato / आलू' },
    { id: 'apple', name: 'Apple / सेब' },
  ];

  // Mock data - replace with actual images
  const examples = {
    tomato: [
      {
        type: 'healthy',
        description: 'Healthy tomato leaf - Dark green, no spots',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTBGMkU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzJFOEI1NyI+SGVhbHRoeSBUb21hdG88L3RleHQ+PC9zdmc+',
      },
      {
        type: 'diseased',
        description: 'Early blight - Brown spots with concentric rings',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZFQkU2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0RDMTQzQyI+RWFybHkgQmxpZ2h0PC90ZXh0Pjwvc3ZnPg==',
      },
    ],
    potato: [
      {
        type: 'healthy',
        description: 'Healthy potato leaf - Bright green, no discoloration',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTBGMkU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzJFOEI1NyI+SGVhbHRoeSBQb3RhdG88L3RleHQ+PC9zdmc+',
      },
      {
        type: 'diseased',
        description: 'Late blight - Water-soaked lesions, white mold',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZFQkU2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0RDMTQzQyI+TGF0ZSBCbGlnaHQ8L3RleHQ+PC9zdmc+',
      },
    ],
    apple: [
      {
        type: 'healthy',
        description: 'Healthy apple leaf - Glossy green, no marks',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTBGMkU5Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzJFOEI1NyI+SGVhbHRoeSBBcHBsZTwvdGV4dD48L3N2Zz4=',
      },
      {
        type: 'diseased',
        description: 'Apple scab - Olive-green spots, velvety texture',
        image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkZFQkU2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0RDMTQzQyI+QXBwbGUgU2NhYjwvdGV4dD48L3N2Zz4=',
      },
    ],
  };

  return (
    <div className="agro-card">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">🖼️</span>
        {t('healthy_vs_diseased')}
      </h3>

      {/* Crop Selector */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => setSelectedCrop(crop.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedCrop === crop.id
                ? 'bg-agro-green text-white'
                : 'bg-agro-light text-agro-dark hover:bg-opacity-80'
            }`}
          >
            {crop.name}
          </button>
        ))}
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples[selectedCrop].map((example, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <img 
              src={example.image} 
              alt={example.type} 
              className="w-full h-48 object-cover"
            />
            <div className={`p-3 ${
              example.type === 'healthy' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <h4 className="font-bold mb-1">
                {example.type === 'healthy' ? '✓ Healthy' : '✗ Diseased'}
              </h4>
              <p className="text-sm text-gray-600">{example.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthyDiseasedGallery;