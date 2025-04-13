
import { useState, ChangeEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { saveNote } from "@/lib/storage";
import { toast } from "sonner";

interface NoteFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subjectId: string;
}

const NoteForm = ({ open, onClose, onSuccess, subjectId }: NoteFormProps) => {
  const [title, setTitle] = useState("");
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

    if (!file) {
      toast.error("Seleziona un file");
      return;
    }

    setLoading(true);
    try {
      // Converti il file in Base64
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          // Salva l'appunto
          saveNote(
            subjectId,
            title.trim(),
            file.name,
            event.target.result as string
          );
          toast.success("Appunto aggiunto con successo");
          setTitle("");
          setFile(null);
          onSuccess();
        }
      };
      reader.onerror = () => {
        throw new Error("Errore nella lettura del file");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Errore durante l'aggiunta dell'appunto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Aggiungi Appunto</DialogTitle>
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
            {file && (
              <p className="text-sm text-muted-foreground">
                File selezionato: {file.name}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Annulla
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !title.trim() || !file}
            className="w-full sm:w-auto bg-accent-teal hover:bg-accent-teal/90"
          >
            Genera
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteForm;
