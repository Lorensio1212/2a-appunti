
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AddButton from "@/components/AddButton";
import NotesList from "@/components/NotesList";
import NoteForm from "@/components/NoteForm";
import { getSubject } from "@/lib/storage";

const SubjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState(id ? getSubject(id) : undefined);
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    if (id) {
      setSubject(getSubject(id));
    }
  }, [id]);

  const handleAddNote = () => {
    setShowNoteForm(true);
  };

  const handleCloseForm = () => {
    setShowNoteForm(false);
  };

  const handleSuccess = () => {
    setShowNoteForm(false);
    // Emette un evento per aggiornare la lista degli appunti
    window.dispatchEvent(new Event("storage"));
  };

  // Se l'ID non è valido o la materia non esiste
  if (!id || !subject) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout
      title={subject.name}
      backLink={{ to: "/", label: "Torna alle materie" }}
      action={<AddButton onClick={handleAddNote} label="Appunti" />}
    >
      <div className="space-y-6">
        <NotesList subjectId={id} />
        <NoteForm
          open={showNoteForm}
          onClose={handleCloseForm}
          onSuccess={handleSuccess}
          subjectId={id}
        />
      </div>
    </Layout>
  );
};

export default SubjectDetail;
