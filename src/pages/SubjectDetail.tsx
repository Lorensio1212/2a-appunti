
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import AddButton from "@/components/AddButton";
import NotesList from "@/components/NotesList";
import NoteForm from "@/components/NoteForm";
import { getSubject } from "@/lib/storage";
import { toast } from "sonner";

const SubjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNoteForm, setShowNoteForm] = useState(false);

  useEffect(() => {
    const loadSubject = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const subjectData = await getSubject(id);
        setSubject(subjectData);
      } catch (error) {
        console.error("Errore nel caricamento della materia:", error);
        toast.error("Impossibile caricare la materia");
      } finally {
        setLoading(false);
      }
    };
    
    loadSubject();
    
    // Aggiungi un event listener per il dataUpdated event
    const handleDataUpdated = () => {
      loadSubject();
    };
    
    window.addEventListener("dataUpdated", handleDataUpdated);
    
    return () => {
      window.removeEventListener("dataUpdated", handleDataUpdated);
    };
  }, [id]);

  const handleAddNote = () => {
    setShowNoteForm(true);
  };

  const handleCloseForm = () => {
    setShowNoteForm(false);
  };

  const handleSuccess = () => {
    setShowNoteForm(false);
  };

  // Se è in caricamento
  if (loading) {
    return (
      <Layout
        title="Caricamento..."
        backLink={{ to: "/", label: "Torna alle materie" }}
      >
        <div className="text-center py-10">
          <p className="text-muted-foreground">Caricamento materia in corso...</p>
        </div>
      </Layout>
    );
  }

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
