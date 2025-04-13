
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book } from "lucide-react";
import { getSubjects, Subject } from "@/lib/storage";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Book className="h-5 w-5 text-accent-blue" />
              <h3 className="font-medium text-lg">{subject.name}</h3>
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
