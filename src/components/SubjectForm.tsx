
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { saveSubject } from "@/lib/storage";
import { toast } from "sonner";

interface SubjectFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SubjectForm = ({ open, onClose, onSuccess }: SubjectFormProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("Inserisci un nome per la materia");
      return;
    }

    setLoading(true);
    try {
      saveSubject(name.trim());
      toast.success("Materia aggiunta con successo");
      setName("");
      onSuccess();
    } catch (error) {
      toast.error("Errore durante l'aggiunta della materia");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Aggiungi Materia</DialogTitle>
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
            disabled={loading || !name.trim()} 
            className="w-full sm:w-auto bg-accent-teal hover:bg-accent-teal/90"
          >
            Crea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubjectForm;
