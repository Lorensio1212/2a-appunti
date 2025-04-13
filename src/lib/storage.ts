
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

// Recupera le materie dal localStorage
export const getSubjects = (): Subject[] => {
  const subjects = localStorage.getItem('subjects');
  return subjects ? JSON.parse(subjects) : [];
};

// Salva una nuova materia
export const saveSubject = (name: string): Subject => {
  const subjects = getSubjects();
  const newSubject: Subject = {
    id: Date.now().toString(),
    name,
    createdAt: Date.now()
  };
  
  subjects.unshift(newSubject); // Aggiunge all'inizio dell'array
  localStorage.setItem('subjects', JSON.stringify(subjects));
  return newSubject;
};

// Ottiene una materia specifica tramite ID
export const getSubject = (id: string): Subject | undefined => {
  const subjects = getSubjects();
  return subjects.find(subject => subject.id === id);
};

// Recupera gli appunti per una materia specifica
export const getNotes = (subjectId: string): Note[] => {
  const notes = localStorage.getItem('notes');
  const allNotes = notes ? JSON.parse(notes) : [];
  return allNotes.filter((note: Note) => note.subjectId === subjectId);
};

// Salva un nuovo appunto
export const saveNote = (subjectId: string, title: string, filename: string, fileData: string): Note => {
  const notes = localStorage.getItem('notes');
  const allNotes = notes ? JSON.parse(notes) : [];
  
  const newNote: Note = {
    id: Date.now().toString(),
    subjectId,
    title,
    filename,
    fileData,
    createdAt: Date.now()
  };
  
  allNotes.unshift(newNote); // Aggiunge all'inizio dell'array
  localStorage.setItem('notes', JSON.stringify(allNotes));
  return newNote;
};

// Ottiene un appunto specifico tramite ID
export const getNote = (id: string): Note | undefined => {
  const notes = localStorage.getItem('notes');
  const allNotes = notes ? JSON.parse(notes) : [];
  return allNotes.find((note: Note) => note.id === id);
};

// Scarica un file
export const downloadFile = (note: Note) => {
  // Crea un elemento 'a' per il download
  const link = document.createElement('a');
  link.href = note.fileData;
  link.download = note.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
