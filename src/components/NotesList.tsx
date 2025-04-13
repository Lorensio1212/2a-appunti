
import { useEffect, useState } from "react";
import { Download, FileText, MoreVertical, Trash2, Pencil } from "lucide-react";
import { getNotes, Note, downloadFile, deleteNote } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NoteEditForm from "./NoteEditForm";

interface NotesListProps {
  subjectId: string;
}

const NotesList = ({ subjectId }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const loadNotes = () => {
    const loadedNotes = getNotes(subjectId);
    setNotes(loadedNotes);
  };

  const handleDownload = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      downloadFile(note);
      toast.success("Download iniziato");
    } catch (error) {
      toast.error("Errore durante il download");
      console.error(error);
    }
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    try {
      const deleted = deleteNote(id);
      if (deleted) {
        toast.success("Appunto eliminato con successo");
        loadNotes();
      } else {
        toast.error("Impossibile eliminare l'appunto");
      }
    } catch (error) {
      toast.error("Errore durante l'eliminazione dell'appunto");
      console.error(error);
    }
  };

  const handleEditNote = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingNote(note);
  };

  const handleEditSuccess = () => {
    setEditingNote(null);
    loadNotes();
  };

  useEffect(() => {
    loadNotes();
    // Aggiungi un event listener per aggiornare la lista quando cambia lo storage
    window.addEventListener("storage", loadNotes);
    return () => {
      window.removeEventListener("storage", loadNotes);
    };
  }, [subjectId]);

  if (notes.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">Nessun appunto. Aggiungine uno!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {notes.map((note) => (
        <Card key={note.id} className="h-full hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent-blue" />
              <h3 className="font-medium text-lg">{note.title}</h3>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="opacity-70 hover:opacity-100 focus:outline-none">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={(e) => handleEditNote(note, e)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifica
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-500 focus:text-red-500 cursor-pointer" 
                  onClick={(e) => handleDeleteNote(note.id, e)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Elimina
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground truncate">
              {note.filename}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={(e) => handleDownload(note, e)} 
              variant="outline" 
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Scarica
            </Button>
          </CardFooter>
        </Card>
      ))}

      {editingNote && (
        <NoteEditForm
          open={!!editingNote}
          onClose={() => setEditingNote(null)}
          onSuccess={handleEditSuccess}
          note={editingNote}
        />
      )}
    </div>
  );
};

export default NotesList;
