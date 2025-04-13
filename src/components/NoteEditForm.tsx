
import { useState, ChangeEvent } from "react";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateNote, Note } from "@/lib/storage";
import { toast } from "sonner";

interface NoteEditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  note: Note;
}

const NoteEditForm = ({ open, onClose, onSuccess, note }: NoteEditFormProps) => {
  const [title, setTitle] = useState(note.title);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Inserisci un titolo per l'appunto");
      return;
    }

    setLoading(true);
    try {
      if (file) {
        // Se c'è un nuovo file, lo convertiamo in Base64
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            // Aggiorna l'appunto con il nuovo file
            const updated = updateNote(
              note.id,
              title.trim(),
              file.name,
              event.target.result as string
            );
            
            if (updated) {
              toast.success("Appunto aggiornato con successo");
              onSuccess();
            } else {
              toast.error("Impossibile aggiornare l'appunto");
            }
            setLoading(false);
          }
        };
        reader.onerror = () => {
          toast.error("Errore nella lettura del file");
          setLoading(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Aggiorna solo il titolo
        const updated = updateNote(note.id, title.trim());
        if (updated) {
          toast.success("Appunto aggiornato con successo");
          onSuccess();
        } else {
          toast.error("Impossibile aggiornare l'appunto");
        }
        setLoading(false);
      }
    } catch (error) {
      toast.error("Errore durante l'aggiornamento dell'appunto");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Modifica Appunto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Titolo Appunto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Input
              type="file"
              onChange={handleFileChange}
              className="w-full"
            />
            {file ? (
              <p className="text-sm text-muted-foreground">
                Nuovo file selezionato: {file.name}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                File attuale: {note.filename}
              </p>
            )}
            <p className="text-xs text-muted-foreground italic">
              Lascia vuoto per mantenere il file esistente
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Annulla
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || (title === note.title && !file)}
            className="w-full sm:w-auto bg-accent-teal hover:bg-accent-teal/90"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Aggiorna
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditForm;
