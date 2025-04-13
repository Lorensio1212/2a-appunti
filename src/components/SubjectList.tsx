
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, MoreVertical, Trash2, Pencil } from "lucide-react";
import { getSubjects, deleteSubject, Subject } from "@/lib/storage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SubjectEditForm from "./SubjectEditForm";

const SubjectList = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const loadedSubjects = await getSubjects();
      setSubjects(loadedSubjects);
    } catch (error) {
      console.error("Errore nel caricamento delle materie:", error);
      toast.error("Impossibile caricare le materie");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
    
    // Aggiungi event listener per il dataUpdated event
    const handleDataUpdated = () => {
      loadSubjects();
    };
    
    window.addEventListener("dataUpdated", handleDataUpdated);
    
    return () => {
      window.removeEventListener("dataUpdated", handleDataUpdated);
    };
  }, []);

  const handleDeleteSubject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const deleted = await deleteSubject(id);
      if (deleted) {
        toast.success("Materia eliminata con successo");
      } else {
        toast.error("Impossibile eliminare la materia");
      }
    } catch (error) {
      toast.error("Errore durante l'eliminazione della materia");
      console.error(error);
    }
  };

  const handleEditSubject = (subject: Subject, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingSubject(subject);
  };

  const handleEditSuccess = () => {
    setEditingSubject(null);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Caricamento materie in corso...</p>
      </div>
    );
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nessuna materia. Aggiungine una!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <Link key={subject.id} to={`/subject/${subject.id}`}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Book className="h-5 w-5 text-accent-blue" />
                <h3 className="font-medium text-lg">{subject.name}</h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <button className="opacity-70 hover:opacity-100 focus:outline-none" onClick={(e) => e.preventDefault()}>
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem 
                    className="cursor-pointer" 
                    onClick={(e) => handleEditSubject(subject, e)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifica
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer" 
                    onClick={(e) => handleDeleteSubject(subject.id, e)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Elimina
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Creato il{" "}
                {new Date(subject.createdAt).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}

      {editingSubject && (
        <SubjectEditForm
          open={!!editingSubject}
          onClose={() => setEditingSubject(null)}
          onSuccess={handleEditSuccess}
          subject={editingSubject}
        />
      )}
    </div>
  );
};

export default SubjectList;
