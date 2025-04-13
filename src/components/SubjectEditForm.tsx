
import { useState } from "react";
import { X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { updateSubject, Subject } from "@/lib/storage";
import { toast } from "sonner";

interface SubjectEditFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subject: Subject;
}

const SubjectEditForm = ({ open, onClose, onSuccess, subject }: SubjectEditFormProps) => {
  const [name, setName] = useState(subject.name);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Inserisci un nome per la materia");
      return;
    }

    setLoading(true);
    try {
      const updated = updateSubject(subject.id, name.trim());
      if (updated) {
        toast.success("Materia aggiornata con successo");
        onSuccess();
      } else {
        toast.error("Impossibile aggiornare la materia");
      }
    } catch (error) {
      toast.error("Errore durante l'aggiornamento della materia");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Modifica Materia</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Nome Materia"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" />
            Annulla
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !name.trim() || name === subject.name} 
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

export default SubjectEditForm;
