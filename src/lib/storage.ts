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

// Elimina una materia specifica tramite ID
export const deleteSubject = (id: string): boolean => {
  const subjects = getSubjects();
  const filteredSubjects = subjects.filter(subject => subject.id !== id);
  
  if (filteredSubjects.length < subjects.length) {
    localStorage.setItem('subjects', JSON.stringify(filteredSubjects));
    
    // Elimina anche tutti gli appunti associati alla materia
    const notes = localStorage.getItem('notes');
    if (notes) {
      const allNotes = JSON.parse(notes);
      const filteredNotes = allNotes.filter((note: Note) => note.subjectId !== id);
      localStorage.setItem('notes', JSON.stringify(filteredNotes));
    }
    
    return true;
  }
  return false;
};

// Aggiorna una materia esistente
export const updateSubject = (id: string, name: string): boolean => {
  const subjects = getSubjects();
  const index = subjects.findIndex(subject => subject.id === id);
  
  if (index !== -1) {
    subjects[index] = {
      ...subjects[index],
      name
    };
    localStorage.setItem('subjects', JSON.stringify(subjects));
    return true;
  }
  return false;
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

// Elimina un appunto specifico tramite ID
export const deleteNote = (id: string): boolean => {
  const notes = localStorage.getItem('notes');
  if (!notes) return false;
  
  const allNotes = JSON.parse(notes);
  const filteredNotes = allNotes.filter((note: Note) => note.id !== id);
  
  if (filteredNotes.length < allNotes.length) {
    localStorage.setItem('notes', JSON.stringify(filteredNotes));
    return true;
  }
  return false;
};

// Aggiorna un appunto esistente
export const updateNote = (id: string, title: string, filename?: string, fileData?: string): boolean => {
  const notes = localStorage.getItem('notes');
  if (!notes) return false;
  
  const allNotes = JSON.parse(notes);
  const index = allNotes.findIndex((note: Note) => note.id === id);
  
  if (index !== -1) {
    allNotes[index] = {
      ...allNotes[index],
      title,
      ...(filename && { filename }),
      ...(fileData && { fileData })
    };
    localStorage.setItem('notes', JSON.stringify(allNotes));
    return true;
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
