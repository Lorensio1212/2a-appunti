
import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { getNotes, Note, downloadFile } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

interface NotesListProps {
  subjectId: string;
}

const NotesList = ({ subjectId }: NotesListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = () => {
    const loadedNotes = getNotes(subjectId);
    setNotes(loadedNotes);
  };

  const handleDownload = (note: Note) => {
    try {
      downloadFile(note);
      toast.success("Download iniziato");
    } catch (error) {
      toast.error("Errore durante il download");
      console.error(error);
    }
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
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <FileText className="h-5 w-5 text-accent-blue" />
            <h3 className="font-medium text-lg">{note.title}</h3>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground truncate">
              {note.filename}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleDownload(note)} 
              variant="outline" 
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Scarica
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;
