
import { useState } from "react";
import Layout from "@/components/Layout";
import AddButton from "@/components/AddButton";
import SubjectList from "@/components/SubjectList";
import SubjectForm from "@/components/SubjectForm";

const Index = () => {
  const [showSubjectForm, setShowSubjectForm] = useState(false);

  const handleAddSubject = () => {
    setShowSubjectForm(true);
  };

  const handleCloseForm = () => {
    setShowSubjectForm(false);
  };

  const handleSuccess = () => {
    setShowSubjectForm(false);
    // Emette un evento per aggiornare la lista delle materie
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Layout
      action={<AddButton onClick={handleAddSubject} />}
    >
      <div className="space-y-6">
        <SubjectList />
        <SubjectForm 
          open={showSubjectForm} 
          onClose={handleCloseForm} 
          onSuccess={handleSuccess} 
        />
      </div>
    </Layout>
  );
};

export default Index;
