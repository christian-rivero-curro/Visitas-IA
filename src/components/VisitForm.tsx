import React from 'react';
import Button from './Button.tsx';
import SearchPopup from './SearchPopup.tsx';
import VisitorSection from './VisitorSection.tsx';
import VisitSection from './VisitSection.tsx';
import { useVisitForm } from '../hooks/useVisitForm.ts';

const VisitForm: React.FC = () => {
  const {
    employees,
    visitor,
    visit,
    unknownVisitor,
    dniError,
    isPopupOpen,
    searchResults,
    popupTitle,
    isLoading,
    handleVisitorChange,
    handleVisitChange,
    handleEmployeeSelect,
    handleSearch,
    handleSelectVisitor,
    handleSubmit,
    loadLastVisit,
    cancelVisitor,
    cancelVisit,
    setUnknownVisitor,
    setIsPopupOpen
  } = useVisitForm();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {isPopupOpen && (
        <SearchPopup
          results={searchResults}
          onSelect={handleSelectVisitor}
          onClose={() => setIsPopupOpen(false)}
          title={popupTitle}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VisitorSection
          visitor={visitor}
          onVisitorChange={handleVisitorChange}
          onSearch={handleSearch}
          unknownVisitor={unknownVisitor}
          onUnknownVisitorChange={setUnknownVisitor}
          isLoading={isLoading}
          dniError={dniError}
        />

        <VisitSection
          visit={visit}
          employees={employees}
          onVisitChange={handleVisitChange}
          onEmployeeSelect={handleEmployeeSelect}
          onLoadLastVisit={loadLastVisit}
          onSearch={handleSearch}
          isLoading={isLoading}
        />
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <Button onClick={handleSubmit} variant="primary" size="lg">
          Acceptar
        </Button>
      </div>

      <div className="flex justify-center space-x-4 mt-4">
        <Button onClick={cancelVisitor} variant="secondary">
          Cancel·lar visitant
        </Button>
        <Button onClick={cancelVisit} variant="secondary">
          Cancel·lar visita
        </Button>
      </div>

      <div className="flex justify-end space-x-4 mt-4">
        <Button variant="secondary">
          Deixar pendent
        </Button>
        <Button variant="secondary">
          Veure pendents
        </Button>
      </div>
    </div>
  );
};

export default VisitForm;