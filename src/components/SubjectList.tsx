
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, MoreVertical, Trash2 } from "lucide-react";
import { getSubjects, deleteSubject, Subject } from "@/lib/storage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SubjectList = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const loadSubjects = () => {
    const loadedSubjects = getSubjects();
    setSubjects(loadedSubjects);
  };

  useEffect(() => {
    loadSubjects();
    // Aggiungi un event listener per aggiornare la lista quando cambia lo storage
    window.addEventListener("storage", loadSubjects);
    return () => {
      window.removeEventListener("storage", loadSubjects);
    };
  }, []);

  const handleDeleteSubject = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const deleted = deleteSubject(id);
      if (deleted) {
        toast.success("Materia eliminata con successo");
        loadSubjects();
      } else {
        toast.error("Impossibile eliminare la materia");
      }
    } catch (error) {
      toast.error("Errore durante l'eliminazione della materia");
      console.error(error);
    }
  };

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
    </div>
  );
};

export default SubjectList;
