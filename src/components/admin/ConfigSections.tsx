
import React from 'react';
import { useAdminConfig } from '@/contexts/AdminConfigContext';
import ApiConfigForm from '@/components/admin/ApiConfigForm';
import ContactConfigForm from '@/components/admin/ContactConfigForm';
import CompanyConfigForm from '@/components/admin/CompanyConfigForm';

const ConfigSections = () => {
  const { 
    config, 
    isSaving, 
    handleApiChange, 
    handleContactChange, 
    handleCompanyNameChange, 
    handleSave 
  } = useAdminConfig();

  return (
    <div className="space-y-8">
      <ApiConfigForm 
        endpoint={config.api.endpoint} 
        apiKey={config.api.apiKey} 
        onChange={handleApiChange} 
      />
      
      <ContactConfigForm 
        contact={{
          name: config.footer.CONTACT_PERSON.NAME,
          title: config.footer.CONTACT_PERSON.TITLE,
          photoUrl: config.footer.CONTACT_PERSON.PHOTO_URL,
          meetingUrl: config.footer.CONTACT_PERSON.MEETING_URL,
          linkedinUrl: config.footer.CONTACT_PERSON.LINKEDIN_URL
        }}
        onChange={handleContactChange}
      />
      
      <CompanyConfigForm 
        name={config.footer.COMPANY.NAME}
        onChange={handleCompanyNameChange}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ConfigSections;
