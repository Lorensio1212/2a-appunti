
export interface Subject {
  id: string;
  name: string;
  createdAt: number;
}

export interface Note {
  id: string;
  subjectId: string;
  title: string;
  filename: string;
  fileData: string; // Base64 encoded file
  createdAt: number;
}

// URL di base per l'API
const API_BASE_URL = "https://jsonbin.io/v3/b";
// ID del bin JSON
const BIN_ID = "66930a1b266cfc3fde91381d";
// Chiave API per l'accesso
const API_KEY = "$2a$10$vKQ6mZUKaaJ6PVHnTiSnBuZ7Oc/T6g32cZ5vRJL8Wgydf0EftzZJC";

// Funzione per ottenere tutti i dati
const fetchData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/${BIN_ID}/latest`, {
      headers: {
        "X-Master-Key": API_KEY,
        "X-Bin-Meta": "false"
      }
    });
    
    if (!response.ok) {
      console.error("Errore nel recupero dei dati:", await response.text());
      return { subjects: [], notes: [] };
    }
    
    const data = await response.json();
    return data || { subjects: [], notes: [] };
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
    return { subjects: [], notes: [] };
  }
};

// Funzione per aggiornare tutti i dati
const updateData = async (data: { subjects: Subject[], notes: Note[] }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      console.error("Errore nell'aggiornamento dei dati:", await response.text());
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Errore durante l'aggiornamento dei dati:", error);
    return false;
  }
};

// Recupera le materie dal database condiviso
export const getSubjects = async (): Promise<Subject[]> => {
  const data = await fetchData();
  return data.subjects || [];
};

// Salva una nuova materia
export const saveSubject = async (name: string): Promise<Subject | null> => {
  const data = await fetchData();
  const newSubject: Subject = {
    id: Date.now().toString(),
    name,
    createdAt: Date.now()
  };
  
  const updatedSubjects = [newSubject, ...(data.subjects || [])];
  const success = await updateData({ ...data, subjects: updatedSubjects });
  
  if (success) {
    // Trigger un evento personalizzato per notificare altri componenti
    window.dispatchEvent(new CustomEvent("dataUpdated"));
    return newSubject;
  }
  return null;
};

// Ottiene una materia specifica tramite ID
export const getSubject = async (id: string): Promise<Subject | undefined> => {
  const data = await fetchData();
  return (data.subjects || []).find(subject => subject.id === id);
};

// Elimina una materia specifica tramite ID
export const deleteSubject = async (id: string): Promise<boolean> => {
  const data = await fetchData();
  const subjects = data.subjects || [];
  const filteredSubjects = subjects.filter(subject => subject.id !== id);
  
  if (filteredSubjects.length < subjects.length) {
    // Elimina anche tutti gli appunti associati alla materia
    const notes = data.notes || [];
    const filteredNotes = notes.filter((note: Note) => note.subjectId !== id);
    
    const success = await updateData({ 
      ...data, 
      subjects: filteredSubjects, 
      notes: filteredNotes 
    });
    
    if (success) {
      window.dispatchEvent(new CustomEvent("dataUpdated"));
      return true;
    }
  }
  return false;
};

// Aggiorna una materia esistente
export const updateSubject = async (id: string, name: string): Promise<boolean> => {
  const data = await fetchData();
  const subjects = data.subjects || [];
  const index = subjects.findIndex(subject => subject.id === id);
  
  if (index !== -1) {
    subjects[index] = {
      ...subjects[index],
      name
    };
    
    const success = await updateData({ ...data, subjects });
    if (success) {
      window.dispatchEvent(new CustomEvent("dataUpdated"));
      return true;
    }
  }
  return false;
};

// Recupera gli appunti per una materia specifica
export const getNotes = async (subjectId: string): Promise<Note[]> => {
  const data = await fetchData();
  const allNotes = data.notes || [];
  return allNotes.filter((note: Note) => note.subjectId === subjectId);
};

// Salva un nuovo appunto
export const saveNote = async (subjectId: string, title: string, filename: string, fileData: string): Promise<Note | null> => {
  const data = await fetchData();
  
  const newNote: Note = {
    id: Date.now().toString(),
    subjectId,
    title,
    filename,
    fileData,
    createdAt: Date.now()
  };
  
  const updatedNotes = [newNote, ...(data.notes || [])];
  const success = await updateData({ ...data, notes: updatedNotes });
  
  if (success) {
    window.dispatchEvent(new CustomEvent("dataUpdated"));
    return newNote;
  }
  return null;
};

// Ottiene un appunto specifico tramite ID
export const getNote = async (id: string): Promise<Note | undefined> => {
  const data = await fetchData();
  const allNotes = data.notes || [];
  return allNotes.find((note: Note) => note.id === id);
};

// Elimina un appunto specifico tramite ID
export const deleteNote = async (id: string): Promise<boolean> => {
  const data = await fetchData();
  const notes = data.notes || [];
  const filteredNotes = notes.filter((note: Note) => note.id !== id);
  
  if (filteredNotes.length < notes.length) {
    const success = await updateData({ ...data, notes: filteredNotes });
    if (success) {
      window.dispatchEvent(new CustomEvent("dataUpdated"));
      return true;
    }
  }
  return false;
};

// Aggiorna un appunto esistente
export const updateNote = async (id: string, title: string, filename?: string, fileData?: string): Promise<boolean> => {
  const data = await fetchData();
  const notes = data.notes || [];
  const index = notes.findIndex((note: Note) => note.id === id);
  
  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      ...(filename && { filename }),
      ...(fileData && { fileData })
    };
    
    const success = await updateData({ ...data, notes });
    if (success) {
      window.dispatchEvent(new CustomEvent("dataUpdated"));
      return true;
    }
  }
  return false;
};

// Scarica un file
export const downloadFile = (note: Note) => {
  const link = document.createElement('a');
  link.href = note.fileData;
  link.download = note.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
