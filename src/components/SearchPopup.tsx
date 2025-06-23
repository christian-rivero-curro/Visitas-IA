import React from 'react';

// Interfaz para los resultados que mostramos en la tabla
export interface SearchResult {
  id: number; // Usaremos el ID de la visita para obtener los datos completos si fuera necesario
  visitor: {
    dni: string;
    name: string;
    [key: string]: any; // Permite otras propiedades en el objeto visitor
  };
  [key: string]: any; // Permite otras propiedades en el objeto visit
}

interface SearchPopupProps {
  results: SearchResult[];
  onSelect: (visitorData: SearchResult['visitor']) => void;
  onClose: () => void;
  title: string;
}

const SearchPopup: React.FC<SearchPopupProps> = ({ results, onSelect, onClose, title }) => {
  return (
    // Fondo oscuro semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] flex flex-col transform">
        {/* Cabecera del modal */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-3xl font-light text-gray-500 hover:text-red-600 transition-colors"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        
        {/* Cuerpo del modal con scroll */}
        <div className="overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No s'han trobat resultats.</p>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">DNI</th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left text-sm font-medium text-gray-600">Nom Complet</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr
                    key={result.id} // Es importante usar un key único
                    onClick={() => onSelect(result.visitor)}
                    className="hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <td className="border-b border-gray-200 px-4 py-3 text-sm">{result.visitor.dni}</td>
                    <td className="border-b border-gray-200 px-4 py-3 text-sm">{result.visitor.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
