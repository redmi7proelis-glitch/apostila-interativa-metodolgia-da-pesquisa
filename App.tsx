import React, { useState, useEffect, ReactNode } from "react";
import { UserProjectDrafts, TimelinePhase } from "./types";
import {
  DEFAULT_DRAFTS,
  EXAMPLE_DRAFTS,
  INITIAL_TIMELINE_PHASES,
  QUIZZES,
  SPRINTS_DATA,
} from "./data";
import { GanttChart } from "./components/GanttChart";
import { ResearchAssistant } from "./components/ResearchAssistant";
import { UnifiedProjectCanvas } from "./components/UnifiedProjectCanvas";
import { GIFaculdadeLogo } from "./components/GIFaculdadeLogo";
import {
  auth,
  db,
  googleSignIn,
  logout,
  createSheetsDb,
  writeStudentsToSheet,
  OperationType,
  handleFirestoreError,
  initAuth
} from "./firebase";
import { doc, getDoc, setDoc, collection, onSnapshot } from "firebase/firestore";
import { User } from "firebase/auth";
import {
  Database,
  CheckSquare,
  Plus,
  RefreshCw,
  Eye,
  ClipboardCheck,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Award,
  FileText,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
  Check,
  X,
  AlertTriangle,
  Scale,
  GraduationCap,
  Bookmark,
  HeartPulse,
  Sliders,
  Search,
  BookMarked,
  Download,
  Copy,
  Printer
} from "lucide-react";

export default function App() {
  // Load drafting state from localStorage
  const [drafts, setDrafts] = useState<UserProjectDrafts>(() => {
    const saved = localStorage.getItem("pesquisa_apostila_drafts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved drafts", e);
      }
    }
    return DEFAULT_DRAFTS;
  });

  // Load timeline/Gantt phase heights from localStorage
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>(() => {
    const saved = localStorage.getItem("pesquisa_timeline");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved timeline", e);
      }
    }
    return INITIAL_TIMELINE_PHASES;
  });

  // State to track reading progress of doctrinal sections (8 chapters * 3 sections = 24 sections total)
  const [readSections, setReadSections] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem("pesquisa_read_sections");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing read sections", e);
      }
    }
    return {};
  });

  // State for saved/bookmarked doctrinal excerpts
  const [savedSections, setSavedSections] = useState<{ [key: string]: boolean }>(() => {
    const saved = localStorage.getItem("pesquisa_saved_sections");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved sections", e);
      }
    }
    return {};
  });

  // Personal notes logged per chapter
  const [personalNotes, setPersonalNotes] = useState<{ [chapterId: number]: string }>(() => {
    const saved = localStorage.getItem("pesquisa_personal_notes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing personal notes", e);
      }
    }
    return {};
  });

  // Main Tabs Navigation
  // Tabs: "boas-vindas" | "indice" | "leitura" | "simulado" | "glossario" | "salvos" | "teacher"
  const [activeTabKey, setActiveTabKey] = useState<string>(() => {
    const seen = localStorage.getItem("pesquisa_welcome_seen");
    return seen ? "indice" : "boas-vindas";
  });
  const [selectedChapterNum, setSelectedChapterNum] = useState<number>(1);
  const [abntMode, setAbntMode] = useState<"modern" | "abnt-serif" | "abnt-sans">(() => {
    return (localStorage.getItem("pesquisa_abnt_mode") as any) || "abnt-serif";
  });

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<{ [questionId: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState<{ [questionId: number]: boolean }>({});

  // Simulado Final States (Tab 3)
  const [simuladoAnswers, setSimuladoAnswers] = useState<{ [questionId: number]: number }>({});
  const [simuladoSubmitted, setSimuladoSubmitted] = useState<boolean>(false);
  const [simuladoGrade, setSimuladoGrade] = useState<{ correct: number; total: number } | null>(null);

  // Glossary Search Term
  const [glossarySearch, setGlossarySearch] = useState<string>("");

  // Backup states for reverting student draft previews
  const [backupDrafts, setBackupDrafts] = useState<any>(null);
  const [backupQuizAnswers, setBackupQuizAnswers] = useState<any>(null);
  const [backupQuizChecked, setBackupQuizChecked] = useState<any>(null);

  // AUTH AND ADMIN CONTROL STATES
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [sheetsConfig, setSheetsConfig] = useState<{
    spreadsheetId: string;
    spreadsheetUrl: string;
    professorEmail: string;
    lastSync?: string;
  } | null>(null);

  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [allCertificates, setAllCertificates] = useState<any[]>([]);
  const [syncingSheets, setSyncingSheets] = useState<boolean>(false);
  const [creatingSheet, setCreatingSheet] = useState<boolean>(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);
  const [viewingStudentName, setViewingStudentName] = useState<string | null>(null);
  const [viewingStudentEmail, setViewingStudentEmail] = useState<string | null>(null);

  // Active student certificate record
  const [activeCertificate, setActiveCertificate] = useState<any | null>(null);

  const ADMIN_EMAIL = "redmi7proelis@gmail.com";

  // Sync to local storage for offline resilience
  useEffect(() => {
    if (!viewingStudentId) {
      localStorage.setItem("pesquisa_apostila_drafts", JSON.stringify(drafts));
    }
  }, [drafts, viewingStudentId]);

  useEffect(() => {
    localStorage.setItem("pesquisa_timeline", JSON.stringify(timelinePhases));
  }, [timelinePhases]);

  useEffect(() => {
    localStorage.setItem("pesquisa_read_sections", JSON.stringify(readSections));
  }, [readSections]);

  useEffect(() => {
    localStorage.setItem("pesquisa_saved_sections", JSON.stringify(savedSections));
  }, [savedSections]);

  useEffect(() => {
    localStorage.setItem("pesquisa_personal_notes", JSON.stringify(personalNotes));
  }, [personalNotes]);

  // Setup Auth State Listener on Mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (loggedInUser, token) => {
        setUser(loggedInUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Load Student Progress when authenticated
  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      const loadStudentData = async () => {
        try {
          const docRef = doc(db, "students", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.drafts) {
              setDrafts(data.drafts);
            }
            if (data.quizzesAnswers) {
              setQuizAnswers(data.quizzesAnswers);
            }
            if (data.quizzesChecked) {
              setQuizChecked(data.quizzesChecked);
            }
            if (data.readSections) {
              setReadSections(data.readSections);
            }
            if (data.savedSections) {
              setSavedSections(data.savedSections);
            }
            if (data.personalNotes) {
              setPersonalNotes(data.personalNotes);
            }
          }
        } catch (error) {
          console.error("Error loading student progress from cloud:", error);
        }
      };
      loadStudentData();
    }
  }, [user]);

  // Auto-save Student Progress to Firestore on field updates
  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL && !viewingStudentId) {
      const saveStudentData = async () => {
        try {
          const docRef = doc(db, "students", user.uid);
          const completeness = calculateCompleteness();
          await setDoc(docRef, {
            uid: user.uid,
            name: user.displayName || "Aluno",
            email: user.email || "",
            progress: completeness,
            drafts: drafts,
            quizzesAnswers: quizAnswers,
            quizzesChecked: quizChecked,
            readSections: readSections,
            savedSections: savedSections,
            personalNotes: personalNotes,
            lastActive: new Date().toISOString()
          }, { merge: true });
        } catch (error) {
          console.error("Error auto-saving progress:", error);
        }
      };

      const timer = setTimeout(() => {
        saveStudentData();
      }, 1500); // 1.5s debounce to keep writes efficient

      return () => clearTimeout(timer);
    }
  }, [drafts, quizAnswers, quizChecked, readSections, savedSections, personalNotes, user, viewingStudentId]);

  // Load Teacher Subscription and Collections
  useEffect(() => {
    if (user && user.email === ADMIN_EMAIL) {
      const sRef = collection(db, "students");
      const unsubS = onSnapshot(sRef, (snap) => {
        const list: any[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setAllStudents(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, "students");
      });

      const cRef = collection(db, "certificates");
      const unsubC = onSnapshot(cRef, (snap) => {
        const list: any[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setAllCertificates(list);
      }, (err) => {
        handleFirestoreError(err, OperationType.LIST, "certificates");
      });

      const loadConf = async () => {
        try {
          const cfSnap = await getDoc(doc(db, "adminConfig", "sheetsConfig"));
          if (cfSnap.exists()) {
            setSheetsConfig(cfSnap.data() as any);
          }
        } catch (e) {
          console.error("Error loading sheets config", e);
        }
      };
      loadConf();

      return () => {
        unsubS();
        unsubC();
      };
    }
  }, [user]);

  // Student certificate state listener
  useEffect(() => {
    if (user && user.email !== ADMIN_EMAIL) {
      const unsub = onSnapshot(doc(db, "certificates", user.uid), (snap) => {
        if (snap.exists()) {
          setActiveCertificate(snap.data());
        } else {
          setActiveCertificate(null);
        }
      });
      return () => unsub();
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProjectDrafts, value: any) => {
    setDrafts((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "population" || field === "object" || field === "context") {
        const pop = field === "population" ? value : prev.population;
        const obj = field === "object" ? value : prev.object;
        const ctx = field === "context" ? value : prev.context;

        if (pop.trim() || obj.trim() || ctx.trim()) {
          updated.delimitedTheme = `A pesquisa sobre ${obj.trim() || "[Objeto]"} envolvendo ${pop.trim() || "[População]"} será contextualizada em ${ctx.trim() || "[Contexto]"}.`;
        }
      }
      return updated;
    });
  };

  const handleReset = () => {
    if (window.confirm("Deseja realmente limpar todos os seus dados de rascunhos e progresso?")) {
      setDrafts(DEFAULT_DRAFTS);
      setTimelinePhases(INITIAL_TIMELINE_PHASES);
      setQuizAnswers({});
      setQuizChecked({});
      setReadSections({});
      setSavedSections({});
      setPersonalNotes({});
      setSimuladoAnswers({});
      setSimuladoSubmitted(false);
      setSimuladoGrade(null);
      localStorage.removeItem("pesquisa_welcome_seen");
      setActiveTabKey("boas-vindas");
    }
  };

  const handleSetExample = () => {
    setDrafts(EXAMPLE_DRAFTS);
    setTimelinePhases(INITIAL_TIMELINE_PHASES);
    
    // Auto fill quizzes
    const autoQuizzes: any = {};
    const autoChecked: any = {};
    for (let c = 1; c <= 9; c++) {
      const qs = QUIZZES[c] || [];
      qs.forEach((q) => {
        autoQuizzes[q.id] = q.correctIndex;
        autoChecked[q.id] = true;
      });
    }
    setQuizAnswers(autoQuizzes);
    setQuizChecked(autoChecked);

    // Auto mark all sections as read to experience 100% progress
    const autoRead: any = {};
    for (let s = 1; s <= 9; s++) {
      autoRead[`sprint-${s}-sec-0`] = true;
      autoRead[`sprint-${s}-sec-1`] = true;
      autoRead[`sprint-${s}-sec-2`] = true;
    }
    setReadSections(autoRead);

    setActiveTabKey("salvos"); // Go to review space immediately
  };

  // Calculate project completion progress based on input fields (Draft Completeness)
  const calculateCompleteness = () => {
    const fieldsToTrack: (keyof UserProjectDrafts)[] = [
      "theme",
      "population",
      "object",
      "context",
      "delimitedTheme",
      "researchProblem",
      "generalObjective",
      "specificObjective1",
      "hypotheses",
      "justificationSocial",
      "justificationScientific",
      "researchType",
      "dataCollectionTool",
      "expectedResultsText",
    ];

    const filledCount = fieldsToTrack.reduce((acc, field) => {
      const val = drafts[field];
      if (typeof val === "string" && val.trim().length > 3) return acc + 1;
      if (typeof val === "boolean" && val === true) return acc + 1;
      return acc;
    }, 0);

    return Math.round((filledCount / fieldsToTrack.length) * 100);
  };

  const completenessPercentage = calculateCompleteness();

  // Problem validator helpful checks
  const validateProblem = (problem: string) => {
    const checks = {
      isQuestion: problem.trim().endsWith("?"),
      startsWithInterrogative: /^(Como|De que|Quais|Qual|Por que|De que forma|Onde|Quando)/i.test(problem.trim()),
      hasLength: problem.trim().length > 15,
      isDicotomic: /^(É|O|Se|A|As|Os|Fará|Vai|Pode)\s/i.test(problem.trim()),
    };
    return checks;
  };

  const problemValidation = validateProblem(drafts.researchProblem);

  // Progress numbers based on sections read
  const totalDoctrinalSections = 27;
  const sectionsReadCount = Object.values(readSections).filter(v => v === true).length;
  const sectionsReadPercentage = Math.round((sectionsReadCount / totalDoctrinalSections) * 100);

  // Chapters completed = Sprints where all 3 sections are read
  const getCompletedChaptersCount = () => {
    let count = 0;
    for (let c = 1; c <= 9; c++) {
      if (
        readSections[`sprint-${c}-sec-0`] &&
        readSections[`sprint-${c}-sec-1`] &&
        readSections[`sprint-${c}-sec-2`]
      ) {
        count++;
      }
    }
    return count;
  };
  const completedChaptersCount = getCompletedChaptersCount();

  // Answered quiz questions count
  const answeredQuizzesCount = Object.keys(quizChecked).length;

  // Bookmarked items count
  const bookmarksCount = Object.values(savedSections).filter(v => v === true).length;

  const currentSprint = SPRINTS_DATA[selectedChapterNum];

  // Helper to split markdown into doctrinal sections cleanly under ABNT formats
  const parseDoctrinalSections = (markdown: string) => {
    const rawLines = markdown.split("\n");
    const sections: { title: string; paragraphs: string[] }[] = [];
    let currentSec: { title: string; paragraphs: string[] } | null = null;
    let tempPara = "";

    rawLines.forEach((line) => {
      const trimmed = line.trim();
      
      // If line is a heading starting with ###
      if (trimmed.startsWith("###")) {
        // Close previous paragraph if it exists
        if (tempPara) {
          if (currentSec) {
            currentSec.paragraphs.push(tempPara);
          } else {
            currentSec = { title: "Apoio Metodológico", paragraphs: [tempPara] };
          }
          tempPara = "";
        }
        
        // Push previous section if it exists
        if (currentSec) {
          sections.push(currentSec);
        }
        
        // Start a new section
        currentSec = {
          title: trimmed.replace(/^###\s*/, ""),
          paragraphs: []
        };
      } else {
        // It's a normal body line
        if (trimmed === "") {
          // Empty line triggers saving the accumulated paragraph
          if (tempPara) {
            if (currentSec) {
              currentSec.paragraphs.push(tempPara);
            } else {
              currentSec = { title: "Apoio Metodológico", paragraphs: [tempPara] };
            }
            tempPara = "";
          }
        } else {
          // Accumulate line
          if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed) || trimmed.startsWith("|")) {
            // Lists or tables should be separate paragraphs
            if (tempPara) {
              if (currentSec) {
                currentSec.paragraphs.push(tempPara);
              } else {
                currentSec = { title: "Apoio Metodológico", paragraphs: [tempPara] };
              }
              tempPara = "";
            }
            if (currentSec) {
              currentSec.paragraphs.push(line); // Preserve original spaces for bullet indents
            } else {
              currentSec = { title: "Apoio Metodológico", paragraphs: [line] };
            }
          } else {
            // Normal text block accumulation
            tempPara = tempPara ? `${tempPara}\n${trimmed}` : trimmed;
          }
        }
      }
    });

    if (tempPara) {
      if (currentSec) {
        currentSec.paragraphs.push(tempPara);
      } else {
        currentSec = { title: "Apoio Metodológico", paragraphs: [tempPara] };
      }
    }
    if (currentSec) {
      sections.push(currentSec);
    }
    return sections;
  };

  // Compile final exam test questions (Simulado Final) - 1 to 2 questions from each sprint
  const compileSimuladoFinal = () => {
    const test: { id: number; sprintNum: number; question: string; options: string[]; correctIndex: number; explanation: string }[] = [];
    for (let i = 1; i <= 8; i++) {
      const sprintQuizzes = QUIZZES[i] || [];
      sprintQuizzes.forEach((quiz) => {
        test.push({ ...quiz, sprintNum: i });
      });
    }
    return test;
  };

  const simuladoQuestions = compileSimuladoFinal();

  const handleSimuladoSubmit = () => {
    let corr = 0;
    simuladoQuestions.forEach((q) => {
      if (simuladoAnswers[q.id] === q.correctIndex) {
        corr++;
      }
    });
    setSimuladoGrade({ correct: corr, total: simuladoQuestions.length });
    setSimuladoSubmitted(true);
  };

  // Glossary static items
  const glossaryItems = [
    {
      term: "P.O.C. (Mnemônico)",
      author: "Elisangela Campos (Metodologia)",
      definition: "População (Quem?), Objeto (O que estudar especificamente?) e Contexto (Onde/Quando?). O triângulo regulador fundamental ensinado para recortar e delimitar perfeitamente qualquer tema científico.",
    },
    {
      term: "Análise de Conteúdo",
      author: "Laurence Bardin (2011)",
      definition: "Técnica metodológica estruturada em três fases indispensáveis para pesquisas qualitativas: pré-análise, exploração profunda do material documental/discursivo, e tratamento das inferências interpretativas.",
    },
    {
      term: "TCLE",
      author: "Resolução CNS 510/16",
      definition: "Termo de Consentimento Livre e Esclarecido. Documento protocolado que descreve benefícios, riscos e direitos protetivos a voluntários, de preenchimento obrigatório para pesquisas envolvendo contato humano.",
    },
    {
      term: "Classificação das Pesquisas",
      author: "Gil (2019)",
      definition: "Agrega as pesquisas em Exploratórias (primeiro contato com o fenômeno), Descritivas (perfilamento das variáveis) ou Explicativas (motivos reais de causa e de causalidade).",
    },
    {
      term: "Rigor no Planejamento",
      author: "Lakatos & Marconi (2021)",
      definition: "Sustenta que o projeto de pesquisa é a especificação das fases operacionais fundamentais do estudo para evitar desperdícios temporais, inconsistências teóricas e amostragem inválida.",
    },
    {
      term: "Diretrizes Filosóficas",
      author: "Severino (2017)",
      definition: "Fornece os caminhos para a leitura e escrita crítica e a fundamentação epistemológica rigorosa da tese científica, ensinando a estruturação textual coerente.",
    },
    {
      term: "Hipótese Conjectural",
      author: "Definição Doutrinária",
      definition: "Resposta de cunho provisório à pergunta formulada no problema de pesquisa. Deve ser dotada de clareza conceitual, exequibilidade, e validade epistemológica antes de ser testada em campo.",
    },
    {
      term: "Objetivo Geral",
      author: "Padrão Metodológico",
      definition: "Enunciado principal que aponta a intenção máxima e a conquista da pesquisa científica. É redigido de forma obrigatória com um verbo de ação no infinitivo (analisar, comparar, verificar).",
    },
    {
      term: "Plataforma Brasil",
      author: "CEP / CONEP",
      definition: "Base oficial eletrônica brasileira unificada que reúne projetos que envolvem seres humanos para avaliação ética do colegiado acadêmico local regulatório.",
    }
  ];

  const filteredGlossary = glossaryItems.filter(
    (item) =>
      item.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.definition.toLowerCase().includes(glossarySearch.toLowerCase()) ||
      item.author.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  const formatBoldItalic = (text: string): React.ReactNode => {
    const boldParts = text.split("**");
    return boldParts.map((bPart, bIdx) => {
      const isBold = bIdx % 2 === 1;
      const iParts = bPart.split("*");
      const subFormatted = iParts.map((iPart, iIdx) => {
        const isItalic = iIdx % 2 === 1;
        if (isItalic) {
          return <em key={iIdx} className="italic not-pre-line">{iPart}</em>;
        }
        return iPart;
      });

      if (isBold) {
        return <strong key={bIdx} className="font-extrabold not-pre-line">{subFormatted}</strong>;
      }
      return <span key={bIdx}>{subFormatted}</span>;
    });
  };

  const renderParagraph = (pText: string, idx: number, isAbntActive: boolean, fontClass: string) => {
    const trimmed = pText.trim();
    const rProps = (row: string) => row.split("|").map(col => col.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    
    // 1. Render Markdown Tables
    if (trimmed.startsWith("|")) {
      const rows = pText.split("\n").map(r => r.trim()).filter(r => r !== "");
      if (rows.length === 0) return null;
      
      const headerRow = rProps(rows[0]);
      const dataRows = rows.slice(1).filter(r => !r.includes("---") && r.trim() !== "").map(rProps);

      return (
        <div key={idx} className="my-5 overflow-x-auto border border-slate-150 rounded-lg p-2 bg-white shadow-3xs">
          <table className={`w-full text-left border-collapse ${isAbntActive ? 'font-abnt-sans text-[11px] leading-relaxed text-black' : 'font-sans text-xs text-slate-800'}`}>
            <thead>
              <tr className={isAbntActive ? "border-t border-b-2 border-black font-extrabold" : "bg-slate-50 border-b border-slate-200 font-bold"}>
                {headerRow.map((col, cIdx) => (
                  <th key={cIdx} className="px-3 py-2 text-left uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((cols, rIdx) => (
                <tr 
                  key={rIdx} 
                  className={
                    isAbntActive 
                      ? "border-b border-slate-200/45 last:border-b-2 last:border-black hover:bg-slate-50/50" 
                      : "border-b border-slate-100 hover:bg-slate-50"
                  }
                >
                  {cols.map((col, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-justify">{formatBoldItalic(col)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className={`mt-1.5 px-3 leading-none italic ${isAbntActive ? 'font-abnt-sans text-[9px] text-[#222]' : 'font-sans text-[10px] text-slate-450'}`}>
            {isAbntActive ? "Fonte: Produção conjunta da GI Faculdade de Pesquisa." : "Fonte: Metodologia e Exemplificação da Disciplina."}
          </p>
        </div>
      );
    }

    // 2. Render List Items (Ordered or Unordered)
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.substring(2);
      const parsedContent = formatBoldItalic(content);

      if (isAbntActive) {
        return (
          <div key={idx} className={`pl-6 flex items-start gap-2.5 text-[12px] leading-[1.4] text-black ${fontClass} text-justify my-1.5`}>
            <span className="select-none font-bold text-slate-850">—</span>
            <span className="flex-1">{parsedContent}</span>
          </div>
        );
      } else {
        return (
          <div key={idx} className="pl-5 flex items-start gap-2 text-xs text-slate-750 leading-relaxed my-1.5 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
            <span className="flex-1">{parsedContent}</span>
          </div>
        );
      }
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+\.)\s(.*)/);
      const num = numMatch ? numMatch[1] : "";
      const content = numMatch ? numMatch[2] : trimmed;
      const parsedContent = formatBoldItalic(content);

      if (isAbntActive) {
        return (
          <div key={idx} className={`pl-6 flex items-start gap-2 text-[12px] leading-[1.4] text-black ${fontClass} text-justify my-1.5`}>
            <span className="font-bold select-none">{num}</span>
            <span className="flex-1">{parsedContent}</span>
          </div>
        );
      } else {
        return (
          <div key={idx} className="pl-5 flex items-start gap-2 text-xs text-slate-750 leading-relaxed my-1.5 font-sans">
            <span className="font-bold text-amber-500 font-mono text-xs select-none">{num}</span>
            <span className="flex-1">{parsedContent}</span>
          </div>
        );
      }
    }

    // 3. Blockquotes (Direct Citations > 3 lines or italicized examples)
    const isDirectLongQuote = (trimmed.length > 120 && (trimmed.toLowerCase().includes("segundo") || trimmed.toLowerCase().includes("conforme") || trimmed.toLowerCase().includes("de acordo"))) || trimmed.startsWith('"') || trimmed.startsWith('“') || trimmed.startsWith('*Exemplo');

    if (isAbntActive && isDirectLongQuote) {
      const quoteText = trimmed.replace(/^["'“*]|["'”*]$/g, ""); 
      const parsedContent = formatBoldItalic(quoteText);

      return (
        <div 
          key={idx} 
          className={`pl-12 md:pl-20 pr-4 my-4 text-[10px] md:text-[10.5px] leading-[1.3] text-slate-805 text-justify border-l-2 border-slate-400 relative ${fontClass}`}
          style={{ letterSpacing: '0.01em' }}
        >
          <span className="italic">{parsedContent}</span>
        </div>
      );
    }

    // 4. Regular Paragraph
    const parsedContent = formatBoldItalic(trimmed);
    
    if (isAbntActive) {
      return (
        <p 
          key={idx} 
          className={`text-[12.5px] leading-[1.6] text-black text-justify py-1 ${fontClass}`}
          style={{ textIndent: '1.25cm' }}
        >
          {parsedContent}
        </p>
      );
    } else {
      return (
        <p key={idx} className="text-xs text-slate-650 leading-relaxed text-justify whitespace-pre-line font-sans relative py-0.5">
          {parsedContent}
        </p>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans select-text pb-12">
      
      {/* HEADER BAR */}
      <header className="bg-white border-b border-slate-250/80 shadow-3xs">
        <div className="max-w-[1550px] mx-auto px-4 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo Title text */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-[#FCB705]/80 flex items-center justify-center font-display font-black text-[#FCB705] text-sm shadow-sm select-none">
              gi
            </div>
            <div>
              <h1 className="font-display font-black text-slate-950 text-sm md:text-base leading-none tracking-tight">
                GI Faculdade <span className="text-slate-400 font-normal">| Pesquisa Científica</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9.5px] text-[#FCB705] font-mono font-extrabold uppercase tracking-widest bg-slate-950/5 px-1.5 py-0.5 rounded leading-none">
                  Apostila Científica Ativa
                </span>
                <span className="bg-amber-100/60 border border-amber-200 text-amber-850 text-[8px] px-1.5 py-0.5 rounded font-mono font-bold leading-none uppercase tracking-wide">
                  Metodologia Acadêmica de Ponta
                </span>
              </div>
            </div>
          </div>

          {/* User Sign In and Account Settings */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-[#FDFBF7] border border-slate-200 p-1.5 pr-3 rounded-full shadow-3xs">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName || "A"}`}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full border border-slate-300"
                  alt="Perfil"
                />
                <div className="min-w-0 flex flex-col">
                  <span className="font-sans font-bold text-[11px] text-[#0F0F0F] leading-none truncate">
                    {user.displayName}
                  </span>
                  <span className="text-[8px] text-slate-450 font-mono mt-0.5 truncate max-w-[120px]">
                    {user.email}
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-slate-200 mx-1" />
                <button
                  onClick={async () => {
                    await logout();
                    setUser(null);
                    setAccessToken(null);
                    window.location.reload();
                  }}
                  className="text-red-500 hover:text-red-700 font-bold font-sans text-[10px] cursor-pointer hover:underline uppercase tracking-wide px-1"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={async () => {
                  setIsLoggingIn(true);
                  try {
                    const result = await googleSignIn();
                    if (result) {
                      setUser(result.user);
                      setAccessToken(result.accessToken);
                    }
                  } catch (err) {
                    console.error("Erro no login:", err);
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                disabled={isLoggingIn}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-950 hover:bg-slate-800 text-[#FCB705] border border-[#FCB705]/30 py-1.5 px-3.5 rounded-full font-bold text-[11px] shadow-sm cursor-pointer select-none transition-all"
              >
                <Database className="w-3.5 h-3.5 text-[#FCB705]" />
                {isLoggingIn ? "Conectando..." : "Entrar com Google"}
              </button>
            )}
          </div>

        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-[1550px] mx-auto px-4 mt-5 space-y-5">
        
        {/* Banner Review Mode */}
        {viewingStudentId && (
          <div className="bg-amber-600 text-white rounded-xl p-4 border border-amber-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 flex-shrink-0 animate-pulse text-amber-200" />
              <div>
                <h4 className="font-sans font-bold text-xs md:text-sm">
                  Modo de Revisão Ativo — Aluno: {viewingStudentName}
                </h4>
                <p className="text-[10px] text-amber-100 font-mono">
                  Você está visualizando os rascunhos acadêmicos e quizes de {viewingStudentEmail}.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                // Restore backup
                setDrafts(backupDrafts || DEFAULT_DRAFTS);
                setQuizAnswers(backupQuizAnswers || {});
                setQuizChecked(backupQuizChecked || {});
                setViewingStudentId(null);
                setViewingStudentName(null);
                setViewingStudentEmail(null);
                setActiveTabKey("teacher"); // Back to teacher pane
              }}
              className="bg-white hover:bg-amber-50 text-amber-900 font-black px-4 py-2 rounded-lg text-[11px] shadow-sm cursor-pointer select-none transition-all"
            >
              Voltar ao Meu Painel Docente
            </button>
          </div>
        )}

        {/* PROGRESSO DE RENDIMENTO MODULE - Styled exactly like the user's attachment */}
        <section id="rendimento-header" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row justify-between items-stretch gap-6">
            
            {/* Left side: Progress percentage bar and stats explanation text */}
            <div className="flex-1 space-y-3.5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-black tracking-wider text-[#A17100] uppercase">
                  Evolução do Estudante
                </span>
                <h2 className="text-sm font-sans font-extrabold uppercase text-slate-500 tracking-wider">
                  PROGRESSO DE RENDIMENTO
                </h2>
              </div>

              {/* Progress and large percentage block */}
              <div className="flex items-baseline gap-3.5">
                <span className="text-4xl md:text-5xl font-extrabold font-display text-slate-950 tracking-tight leading-none">
                  {sectionsReadPercentage}%
                </span>
                <span className="text-xs text-slate-500 font-medium">Leitura Dinâmica e Doutrinária</span>
              </div>

              {/* Real horizontal progression bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <div
                    className="h-full bg-slate-950 rounded-full transition-all duration-700 ease-out relative"
                    style={{ width: `${sectionsReadPercentage}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-[#FCB705] rounded-full" />
                  </div>
                </div>
                <div className="flex justify-between text-[10.5px] text-slate-500 leading-normal">
                  <p className="font-medium font-sans">
                    Você leu <strong className="text-slate-950">{sectionsReadCount}</strong> de {totalDoctrinalSections} seções doutrinárias e concluiu <strong className="text-amber-600 font-bold">{completedChaptersCount}</strong> capítulos.
                  </p>
                  <span className="font-mono text-slate-400">
                    {sectionsReadCount}/24 seções
                  </span>
                </div>
              </div>
            </div>

            {/* Split separator for wide view */}
            <div className="hidden lg:block w-[1px] bg-slate-200 self-stretch my-1" />

            {/* Right side: 3 Small count status cards from the attachment */}
            <div className="grid grid-cols-3 gap-3.5 w-full lg:w-[480px] flex-shrink-0">
              
              {/* Box 1: Concluídos */}
              <div className="bg-slate-50 hover:bg-slate-100/50 transition-colors border border-slate-200/60 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display leading-none">
                  {completedChaptersCount}
                </span>
                <span className="text-[9.5px] md:text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Concluídos
                </span>
              </div>

              {/* Box 2: Quizzes */}
              <div className="bg-slate-50 hover:bg-slate-100/50 transition-colors border border-slate-200/60 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display leading-none">
                  {answeredQuizzesCount}
                </span>
                <span className="text-[9.5px] md:text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Quizzes
                </span>
              </div>

              {/* Box 3: Salvos */}
              <div className="bg-slate-50 hover:bg-slate-100/50 transition-colors border border-slate-200/60 rounded-xl p-3.5 flex flex-col justify-center items-center text-center">
                <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-display leading-none">
                  {bookmarksCount}
                </span>
                <span className="text-[9.5px] md:text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  Salvos
                </span>
              </div>

            </div>

          </div>
        </section>

        {/* ROW OF HORIZONTAL NAVIGATION TABS - Perfectly matching user request */}
        <nav id="horizontal-tabs-row" className="flex items-center gap-1.5 border-b border-slate-205 pb-1 overflow-x-auto custom-scrollbar whitespace-nowrap">
          
          <button
            onClick={() => setActiveTabKey("boas-vindas")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex items-center gap-2 transition-all cursor-pointer ${
              activeTabKey === "boas-vindas"
                ? "bg-slate-950 text-[#FCB705] font-extrabold shadow-sm border border-slate-800"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>Boas-vindas / Apresentação</span>
          </button>

          <button
            onClick={() => setActiveTabKey("indice")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex items-center gap-2 transition-all cursor-pointer ${
              activeTabKey === "indice"
                ? "bg-slate-950 text-[#FCB705] font-extrabold shadow-sm border border-slate-800"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-550 text-amber-500" />
            <span>Índice Geral (8 Sprints)</span>
          </button>

          <button
            onClick={() => setActiveTabKey("leitura")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex items-center gap-2 transition-all cursor-pointer ${
              activeTabKey === "leitura"
                ? "bg-slate-950 text-[#FCB705] font-extrabold shadow-sm border border-slate-800"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
            }`}
          >
            <BookMarked className="w-3.5 h-3.5 text-amber-500" />
            <span>Estudo & Rascunho da Semana</span>
            <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono leading-none ${
              activeTabKey === "leitura" 
                ? "bg-amber-500/10 text-amber-500 border border-amber-550/20" 
                : "bg-slate-100 border border-slate-200 text-slate-700"
            }`}>
              Semana {selectedChapterNum}
            </span>
          </button>

          <button
            onClick={() => setActiveTabKey("simulado")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex items-center gap-2 transition-all cursor-pointer ${
              activeTabKey === "simulado"
                ? "bg-slate-950 text-[#FCB705] font-extrabold shadow-sm border border-slate-800"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulado Final & Certificado</span>
          </button>

          <button
            onClick={() => setActiveTabKey("glossario")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex items-center gap-2 transition-all cursor-pointer ${
              activeTabKey === "glossario"
                ? "bg-slate-950 text-[#FCB705] font-extrabold shadow-sm border border-slate-800"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Glossário Doutrinário</span>
          </button>

          <button
            onClick={() => setActiveTabKey("salvos")}
            className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex items-center gap-2 transition-all cursor-pointer ${
              activeTabKey === "salvos"
                ? "bg-slate-950 text-[#FCB705] font-extrabold shadow-sm border border-slate-800"
                : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Meus Salvos/Notas ({bookmarksCount})</span>
          </button>

          <div className="flex-grow" />

          {/* Teacher panel with sliders icon as slider button */}
          {user?.email === ADMIN_EMAIL && (
            <button
              onClick={() => setActiveTabKey("teacher")}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold leading-none flex items-center gap-1.5 transition-all cursor-pointer border ${
                activeTabKey === "teacher"
                  ? "bg-rose-600 text-white shadow-sm font-black border-rose-700 animate-pulse"
                  : "bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100/70"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Área do Professor</span>
            </button>
          )}

          {/* Quickstart Help button trigger Sparkles AI icon */}
          <button
            onClick={() => {
              if (activeTabKey !== "leitura") {
                setActiveTabKey("leitura");
              }
              const assistantEl = document.getElementById("ai-advisor-panel");
              if (assistantEl) {
                assistantEl.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-600 flex items-center justify-center cursor-pointer hover:bg-amber-100/50 ml-1.5 transition-colors shadow-3xs flex-shrink-0"
            title="Conselho Coorientador de IA"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
          </button>

        </nav>

        {/* ------------------------- BOAS VINDAS (TAB: "boas-vindas") ------------------------- */}
        {activeTabKey === "boas-vindas" && (
          <div className="space-y-6 animate-fade-in text-slate-850">
            {/* Main Welcome Hero */}
            <div className="bg-[#FDFBF7] rounded-3xl border border-slate-205 shadow-sm p-6 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-80 h-80 bg-amber-100/20 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-50/30 rounded-full blur-3xl -z-10" />
              
              {/* College Logo component */}
              <GIFaculdadeLogo className="mb-6 scale-100 hover:scale-[1.02] transition-transform duration-300" />
              
              <div className="max-w-3xl text-center space-y-4">
                <span className="text-[10px] font-mono font-black uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full">
                  Metodologia Científica Prática
                </span>
                
                <h1 className="text-xl md:text-3xl font-display font-black text-slate-950 tracking-tight leading-tight">
                  Bem-vindo à Apostila Interativa de Estudo Prático
                </h1>
                
                <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                  Esta plataforma foi especialmente desenvolvida para acompanhar você no design e amadurecimento lógico do seu projeto científico. Sob as coordenadas da <strong>Profª. Elisangela Campos</strong>, você colocará a mão na massa através de um roteiro de 9 sprints semanais integradas.
                </p>
                
                {/* CTA Button */}
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => {
                      localStorage.setItem("pesquisa_welcome_seen", "true");
                      setActiveTabKey("indice");
                    }}
                    className="group bg-slate-950 hover:bg-slate-850 text-[#FCB705] border border-[#FCB705]/40 font-bold px-6 py-3 rounded-xl text-xs md:text-sm shadow-md hover:shadow-amber-500/10 transition-all cursor-pointer select-none inline-flex items-center gap-2"
                  >
                    <span>Iniciar Minha Jornada de Pesquisa</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Highlights Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-3xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-display font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                  1. Roteiro de 8 Capítulos
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                  Sprints detalhadas desenhadas para cobrir desde a delimitação do seu problema (P.O.C.) até a análise e os resultados.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-3xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="font-display font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                  2. Construção Guiada (Rascunho)
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                  Escreva e estruture tema, hipóteses e objetivos diretamente em formulários validados metodologicamente.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-3xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-display font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                  3. Coorientador Inteligente
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                  Um assistente cognitivo integrado para refinar e validar os elementos lógicos do seu projeto em tempo real.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-5 rounded-xl space-y-3 shadow-3xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Database className="w-4 h-4" />
                </div>
                <h3 className="font-display font-extrabold text-xs text-slate-950 uppercase tracking-wide">
                  4. Relatório Acadêmico Real
                </h3>
                <p className="text-[11.5px] text-slate-500 leading-relaxed font-sans">
                  Gere um cronograma Gantt dinâmico integrado e exporte sua ficha metodológica final para entrega formal à faculdade.
                </p>
              </div>
            </div>

            {/* Message from Coordinator Card */}
            <div className="bg-slate-950 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="w-16 h-16 rounded-full bg-[#FCB705] flex-shrink-0 flex items-center justify-center font-display font-black text-xl text-slate-950 border border-amber-300">
                EC
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-mono tracking-widest uppercase text-amber-400 block font-bold">Mensagem da Coordenação</span>
                <p className="text-xs md:text-[13px] italic font-sans text-slate-100 leading-relaxed max-w-4xl">
                  &ldquo;A ciência se faz com rigor, planejamento e paixão intelectual. Esta ferramenta ativa foi concebida para que vocês experimentem o nascimento de uma contribuição científica real de forma estruturada. Sigam as sprints, respondam com persistência e cultivem a curiosidade.&rdquo;
                </p>
                <div className="pt-1 text-[11px] font-mono text-amber-300 font-bold">
                  Profª. Elisangela Campos &mdash; Tutora e Coordenadora de Metodologia da Pesquisa
                </div>
              </div>
            </div>
            
            {/* Quickstart tutorial */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 md:p-6 space-y-3.5 shadow-3xs">
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-widest font-display flex items-center gap-1.5 pl-0.5">
                <Info className="w-4 h-4 text-amber-500" />
                Como Utilizar Esta Apostila
              </h3>
              <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans text-slate-600 leading-normal">
                <li className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center font-mono font-black text-[10px] text-amber-600">1</span>
                    Acesse o Índice Geral
                  </div>
                  <p>Inspecione a sequência de 8 Capítulos e comece as leituras obrigatórias de cada semana.</p>
                </li>
                <li className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center font-mono font-black text-[10px] text-amber-600">2</span>
                    Pratique Concomitantemente
                  </div>
                  <p>À medida que lê, preencha os formulários de prática da semana para estruturar a monografia.</p>
                </li>
                <li className="space-y-1">
                  <div className="font-bold text-slate-905 flex items-center gap-1.5 font-sans">
                    <span className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center font-mono font-black text-[10px] text-amber-600">3</span>
                    Teste e Sincronize
                  </div>
                  <p>Responda aos testes e sincronize com a planilha do professor para comprovar sua nota acadêmica.</p>
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* ------------------------- INDICE GERAL (TAB: "indice") ------------------------- */}
        {activeTabKey === "indice" && (
          <div className="space-y-6 animate-fade-in text-slate-850">
            
            {/* Header intro landing module */}
            <div className="bg-slate-950 text-white rounded-2xl overflow-hidden shadow-xs border-2 border-[#FCB705]/25 p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
              
              <div className="max-w-4xl relative space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#FCB705]/10 border border-[#FCB705]/20 text-[#FCB705] px-3 py-1 rounded-full text-[10px] font-bold">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
                  Plano Intelectual de Estudo Prático
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FCB705] font-black block">
                    Metodologia Científica Coorientada
                  </span>
                  <h1 className="text-xl md:text-3xl font-display font-black text-white tracking-tight leading-tight">
                    Roteiro de Metodologia Ativa - 9 Capítulos
                  </h1>
                </div>

                <p className="text-slate-300 text-xs md:text-xs leading-relaxed max-w-4xl">
                  Bem-vindo à apostila interativa definitiva. Navegue pelos <strong>9 capítulos</strong> estruturados para consolidar o seu desenho científico. A cada semana, realize as leituras doutrinárias essenciais para cumprir as etapas de seu projeto, responda aos simuladores e receba avaliação coorientadora por Inteligência Artificial em tempo real.
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2.5 pt-3 border-t border-slate-800 text-[10.5px] text-slate-400 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Coordenação Geral</span>
                    <span className="text-slate-200 font-medium">Profª. Elisangela Campos</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold">Referência Base</span>
                    <span className="text-slate-200 font-medium">Lakatos & Marconi, Severino, Gil, Bardin</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-bold font-sans">Modelo Proposto</span>
                    <span className="text-slate-200 font-medium">Adultização nas Redes Sociais</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS ROW */}
            <div className="bg-slate-50 border border-slate-205 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-slate-905 text-xs md:text-sm">
                  Quer ver como funciona um projeto preenchido?
                </h4>
                <p className="text-[11px] text-slate-500 leading-normal max-w-2xl font-sans">
                  Clique para carregar o modelo pedagógico preenchido da Profª. Elisangela sobre adultização infanto-juvenil no TikTok para inspecionar exemplos ou limpe o cache.
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleSetExample}
                  className="bg-slate-950 hover:bg-slate-900 border border-[#FCB705]/40 text-[#FCB705] font-extrabold px-3.5 py-1.5 rounded-lg text-xs transition-all shadow-3xs cursor-pointer select-none"
                >
                  Carregar Exemplo Modelo (100% Conclusão)
                </button>
                <button
                  onClick={handleReset}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer select-none"
                >
                  Resetar Dados
                </button>
              </div>
            </div>

            {/* Chapters Bento Layout Grid */}
            <div className="space-y-3.5">
              <h3 className="text-xs font-bold text-slate-950 uppercase tracking-widest font-display flex items-center gap-1.5 pl-0.5 pt-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                Matriz de Capítulos
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {Object.values(SPRINTS_DATA).map((sprint) => {
                  const s0 = readSections[`sprint-${sprint.num}-sec-0`] ? 1 : 0;
                  const s1 = readSections[`sprint-${sprint.num}-sec-1`] ? 1 : 0;
                  const s2 = readSections[`sprint-${sprint.num}-sec-2`] ? 1 : 0;
                  const readSecsCount = s0 + s1 + s2;
                  const isDone = readSecsCount === 3;

                  return (
                    <div
                      key={sprint.num}
                      onClick={() => {
                        setSelectedChapterNum(sprint.num);
                        setActiveTabKey("leitura");
                      }}
                      className="bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between space-y-3"
                    >
                      <div className="flex gap-3 items-start">
                        <div className={`w-9 h-9 rounded-lg flex flex-shrink-0 items-center justify-center font-mono text-sm font-black transition-all ${
                          isDone 
                            ? "bg-emerald-500 text-white" 
                            : "bg-slate-100 text-slate-800 group-hover:bg-slate-950 group-hover:text-[#FCB705] group-hover:border group-hover:border-[#FCB705]/40"
                        }`}>
                          {sprint.num}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9.5px] text-slate-400 font-mono leading-none">{sprint.dates}</span>
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-1 py-0.5 rounded font-mono leading-none">{sprint.pages}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 mt-1.5 group-hover:text-amber-650 transition-colors line-clamp-1 font-display">
                            {sprint.title}
                          </h4>
                          <p className="text-[10.5px] text-slate-450 line-clamp-2 leading-tight mt-1">
                            {sprint.summary}
                          </p>
                        </div>
                      </div>

                      {/* Chapters sub status */}
                      <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>Leitura:</span>
                          <span className={`${isDone ? "text-emerald-600 font-bold" : "text-slate-600 font-mono"}`}>
                            {readSecsCount}/3 lidos
                          </span>
                        </div>
                        
                        <div className="flex gap-1.5 text-[8.5px] font-mono tracking-wider">
                          <span className={`px-1 rounded-sm leading-tight uppercase font-extrabold ${
                            QUIZZES[sprint.num] && QUIZZES[sprint.num].every(q => quizChecked[q.id])
                              ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-100"
                              : "bg-slate-100 text-slate-400"
                          }`}>
                            Quiz
                          </span>
                          <span className="bg-amber-50 text-amber-700 px-1 rounded-sm font-black border border-amber-250/50 uppercase">
                            Prática
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ------------------------- LEITURA ATIVA DO CAPÍTULO (TAB: "leitura") ------------------------- */}
        {activeTabKey === "leitura" && currentSprint && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Active Chapter select bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-3xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[10.5px] font-bold">Estudando Ativamente:</span>
                <span className="text-[11px] bg-amber-500/10 border border-amber-300/30 text-amber-700 px-2.5 py-0.5 rounded font-mono font-black uppercase">
                  Capítulo {selectedChapterNum}
                </span>
                <h3 className="hidden md:block text-xs font-bold text-slate-800">
                  {currentSprint.title}
                </h3>
              </div>
              
              {/* Pills to change chapters */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
                  const isCur = selectedChapterNum === n;
                  const isRead = readSections[`sprint-${n}-sec-0`] && readSections[`sprint-${n}-sec-1`] && readSections[`sprint-${n}-sec-2`];
                  return (
                    <button
                      key={n}
                      onClick={() => setSelectedChapterNum(n)}
                      className={`w-7 h-7 rounded-md font-mono text-xs font-black flex items-center justify-center transition-all cursor-pointer ${
                        isCur
                          ? "bg-slate-950 text-[#FCB705] border border-amber-500/20 shadow-xs"
                          : isRead
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Split Screen Master Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* LEFT COLUMN: THEORY BOOK with individual Section read-switches */}
              <div className="col-span-12 lg:col-span-7 space-y-4">
                
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-2.5 border-b border-slate-100 gap-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-display">
                          Apoio Teórico do Capítulo {currentSprint.num}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Autor de Referência: {currentSprint.pages}</p>
                      </div>
                    </div>
                    <span className="text-[9.5px] text-slate-400 italic font-sans">Marque a leitura de cada tópico abaixo</span>
                  </div>

                  {/* Selector for ABNT layout vs Modern layout */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[9px] flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-amber-500" /> FORMATO DE LEITURA CIENTÍFICA (ABNT)
                      </span>
                      <p className="text-slate-500 text-[10px]">Customize o estilo de visualização do texto para as normas da ABNT ou modo moderno.</p>
                    </div>
                    
                    <div className="flex items-center gap-1.5 self-center sm:self-auto flex-shrink-0 font-sans">
                      <button
                        onClick={() => {
                          setAbntMode("abnt-serif");
                          localStorage.setItem("pesquisa_abnt_mode", "abnt-serif");
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                          abntMode === "abnt-serif"
                            ? "bg-slate-950 text-[#FCB705] border-slate-950 shadow-md"
                            : "bg-white border-slate-250 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Formato de Tese Acadêmica no padrão Times/Lora com recuo 1.25cm"
                      >
                        📖 Times (ABNT)
                      </button>
                      <button
                        onClick={() => {
                          setAbntMode("abnt-sans");
                          localStorage.setItem("pesquisa_abnt_mode", "abnt-sans");
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                          abntMode === "abnt-sans"
                            ? "bg-slate-950 text-[#FCB705] border-slate-950 shadow-md"
                            : "bg-white border-slate-250 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Formato Arial/Arimo profissional para relatórios e monografias"
                      >
                        📄 Arial (ABNT)
                      </button>
                      <button
                        onClick={() => {
                          setAbntMode("modern");
                          localStorage.setItem("pesquisa_abnt_mode", "modern");
                        }}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                          abntMode === "modern"
                            ? "bg-slate-950 text-[#FCB705] border-slate-950 shadow-md"
                            : "bg-white border-slate-250 text-slate-600 hover:bg-slate-100"
                        }`}
                        title="Formato Moderno com layout responsivo do ecossistema digital"
                      >
                        📱 Moderno / Fluído
                      </button>
                    </div>
                  </div>

                  {abntMode !== "modern" && (
                    <div className="bg-amber-500/5 border border-amber-500/15 p-2.5 rounded-lg text-[9.5px] leading-snug flex items-start gap-2 text-amber-900 font-sans">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                      <div>
                        <strong>Normas Técnicas Aplicadas da ABNT & IBGE:</strong> Fonte oficial tamanho 12 no corpo do texto • Espaçamento entrelinhas rigoroso de 1,5 • Parágrafos com recuo de primeira linha de 1,25 cm • Citações longas superiores a 3 linhas formatadas em painel com recuo esquerdo de 4 cm e letra tamanho 10 • Tabelas em padrão IBGE (apenas bordas horizontais no topo/rodapé de cabeçalho).
                      </div>
                    </div>
                  )}

                  {/* Parse and Render Doctrinal Sections card by card */}
                  <div className="space-y-5">
                    {parseDoctrinalSections(currentSprint.contentMarkdown).map((sec, secIdx) => {
                      const sectionId = `sprint-${selectedChapterNum}-sec-${secIdx}`;
                      const isLido = readSections[sectionId] || false;
                      const isSaved = savedSections[sectionId] || false;
                      const isAbntActive = abntMode !== "modern";
                      const isSerif = abntMode === "abnt-serif";
                      const fontClass = isSerif ? "font-abnt-serif" : "font-abnt-sans";

                      return (
                        <div
                          key={secIdx}
                          className={`transition-all ${
                            isAbntActive
                              ? "p-6 md:p-8 bg-white border border-slate-250 shadow-xs relative rounded-lg"
                              : `p-4 rounded-xl border ${
                                  isLido
                                    ? "bg-emerald-50/20 border-emerald-250 border-emerald-205"
                                    : "bg-slate-50 border-slate-200/60"
                                }`
                          }`}
                        >
                          {/* Top ABNT Watermark header to resemble a real printed sheet */}
                          {isAbntActive && (
                            <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono border-b border-slate-100 pb-2 mb-4 select-none">
                              <span>GI FACULDADE DE PESQUISA CIENTÍFICA</span>
                              <span>APOSTILA ACADÊMICA ATIVA</span>
                              <span>PÁGINA {selectedChapterNum}.{secIdx + 1}</span>
                            </div>
                          )}

                          {/* Heading section */}
                          <div className="flex justify-between items-start gap-3.5 mb-3.5">
                            <h4 className={
                              isAbntActive
                                ? `text-[13px] font-bold text-slate-900 border-l-4 border-slate-800 pl-2 block leading-6 tracking-tight ${fontClass}`
                                : "text-xs font-bold text-slate-950 uppercase tracking-wide border-l-4 border-amber-500 pl-2 block font-display"
                            }>
                              {sec.title}
                            </h4>

                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              
                              {/* Save Bookmark button */}
                              <button
                                onClick={() => {
                                  setSavedSections((prev) => ({ ...prev, [sectionId]: !isSaved }));
                                }}
                                className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                                  isSaved
                                    ? "bg-amber-100 border-amber-300 text-amber-800"
                                    : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                }`}
                                title={isSaved ? "Salvo" : "Favoritar Seção"}
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>

                              {/* Lido check trigger */}
                              <button
                                onClick={() => {
                                  setReadSections((prev) => ({ ...prev, [sectionId]: !isLido }));
                                }}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 select-none transition-all cursor-pointer ${
                                  isLido
                                    ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                {isLido ? "Lido!" : "Lido"}
                              </button>

                            </div>
                          </div>

                          {/* Paragraphs */}
                          <div className={
                            isAbntActive
                              ? "space-y-4 pt-1 border-t border-slate-100"
                              : "space-y-2 text-xs text-slate-600 leading-normal font-sans pt-1.5 border-t border-slate-100/50"
                          }>
                            {sec.paragraphs.map((pText, pIdx) => 
                              renderParagraph(pText, pIdx, isAbntActive, fontClass)
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Evaluation Active Quiz Card */}
                {QUIZZES[selectedChapterNum] && (
                  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3.5">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-display">
                        Quiz de Fixação Metodológica do Capítulo
                      </h3>
                    </div>
                    
                    <div className="space-y-3.5">
                      {QUIZZES[selectedChapterNum].map((q) => {
                        const answerIndex = quizAnswers[q.id];
                        const isChecked = quizChecked[q.id];
                        const isAnswered = answerIndex !== undefined;

                        return (
                          <div key={q.id} className="border border-slate-100 p-3.5 rounded-lg bg-slate-50/40 space-y-2.5">
                            <h4 className="text-[11.5px] font-bold text-slate-800 leading-tight">
                              {q.question}
                            </h4>
                            
                            <div className="space-y-1.5">
                              {q.options.map((opt, optIdx) => {
                                let optStyle = "border-slate-240 bg-white hover:bg-slate-50 text-slate-705";
                                
                                if (isChecked) {
                                  if (optIdx === q.correctIndex) {
                                    optStyle = "bg-emerald-500 text-white border-emerald-500 font-semibold";
                                  } else if (optIdx === answerIndex) {
                                    optStyle = "bg-rose-500 text-white border-rose-500 font-semibold";
                                  } else {
                                    optStyle = "bg-slate-150 text-slate-400 border-slate-200 opacity-60";
                                  }
                                } else if (answerIndex === optIdx) {
                                  optStyle = "bg-slate-950 text-[#FCB705] border-[#FCB705]/40 font-extrabold shadow-sm";
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    disabled={isChecked}
                                    onClick={() => {
                                      setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                      setQuizChecked((prev) => ({ ...prev, [q.id]: true }));
                                    }}
                                    className={`w-full text-left px-3 py-1.5 rounded-md border text-[11px] leading-tight transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                                  >
                                    <span>{opt}</span>
                                    {isChecked && optIdx === q.correctIndex && <Check className="w-3.5 h-3.5 flex-shrink-0 text-white" />}
                                    {isChecked && optIdx === answerIndex && optIdx !== q.correctIndex && <X className="w-3.5 h-3.5 flex-shrink-0 text-white" />}
                                  </button>
                                );
                              })}
                            </div>

                            {isChecked && (
                              <div className={`p-3 rounded-lg border text-[10px] leading-relaxed ${
                                answerIndex === q.correctIndex
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                  : "bg-rose-50 border-rose-200 text-rose-800"
                              }`}>
                                <div className="font-bold flex items-center gap-1 mb-0.5.5">
                                  {answerIndex === q.correctIndex ? (
                                    <span>🎉 Resposta Correta!</span>
                                  ) : (
                                    <span>❌ Resposta Errada</span>
                                  )}
                                </div>
                                <p className="font-sans leading-normal">{q.explanation}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: WORKSHOP LAB DRAWING FIELDS AND PERSONAL CAPTURE */}
              <div className="col-span-12 lg:col-span-5 space-y-4">
                
                {/* Personal Notes capture for chapter */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-3xs space-y-2">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span className="text-[10.5px] uppercase font-mono font-bold tracking-wider text-slate-500">Minhas Notas do Capítulo</span>
                  </div>
                  <textarea
                    rows={2}
                    value={personalNotes[selectedChapterNum] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPersonalNotes((prev) => ({ ...prev, [selectedChapterNum]: val }));
                    }}
                    placeholder="Digite anotações pessoais livres ou citações interessantes deste capítulo para salvar..."
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-amber-500 text-xs leading-normal"
                  />
                </div>

                {/* Practice Workshop Draft Forms per Chapter - Restructured from original split view */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-4">
                    <Award className="w-4 h-4 text-amber-500" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs font-sans uppercase tracking-wider leading-none">
                        Ficha de Prática Científica
                      </h3>
                      <span className="text-[9px] uppercase font-mono text-slate-400 mt-1 block">Rascunho de Concepção</span>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                    
                    {/* Chapter 1: Introduction */}
                    {selectedChapterNum === 1 && (
                      <div className="space-y-3.1 text-xs">
                        <div className="bg-amber-500/10 border border-amber-500/25 p-4 rounded-xl text-center space-y-2.5">
                          <p className="font-medium text-slate-700 leading-normal text-[11px]">
                            No Capítulo 1, sintonize os componentes científicos gerais. Navegue pelas próximas semanas nas pílulas acima para rascunhar cada parte de sua proposta metodológica individual!
                          </p>
                          <button
                            onClick={() => setSelectedChapterNum(2)}
                            className="bg-slate-950 hover:bg-slate-850 text-[#FCB705] border border-[#FCB705]/40 font-bold px-3.5 py-1.5 rounded-lg text-xs leading-none transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-3xs"
                          >
                            Ir para Capítulo 2 <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Onboarding checklist */}
                        <div className="border border-slate-150 p-3.5 rounded-lg space-y-2.5 bg-slate-50/40">
                          <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider font-display">Metas da Iniciação Científica</h4>
                          <div className="space-y-1.5 leading-snug font-sans">
                            <label className="flex items-start gap-2 text-slate-650">
                              <input type="checkbox" defaultChecked className="mt-0.5 accent-amber-500 h-3.5 w-3.5 flex-shrink-0" />
                              <span>Compreendi que um projeto acadêmico delimita a viabilidade teórica e de campo.</span>
                            </label>
                            <label className="flex items-start gap-2 text-slate-650">
                              <input type="checkbox" defaultChecked className="mt-0.5 accent-amber-500 h-3.5 w-3.5 flex-shrink-0" />
                              <span>Familiarizei-me com as correntes teóricas brasileiras de iniciação.</span>
                            </label>
                            <label className="flex items-start gap-2 text-slate-650">
                              <input type="checkbox" className="mt-0.5 accent-amber-500 h-3.5 w-3.5 flex-shrink-0" />
                              <span>Pronto para usar a técnica de P.O.C. no Capítulo 2.</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Chapter 2: Themes */}
                    {selectedChapterNum === 2 && (
                      <div className="space-y-3 text-xs text-slate-750">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 leading-relaxed block text-[11px]">
                          <strong>Passo 2:</strong> Defina seu assunto científico amplo e subdivida-o na técnica triangular P.O.C.
                        </div>

                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10px]">TEMA AMPLO INICIAL:</label>
                          <input
                            type="text"
                            value={drafts.theme}
                            placeholder="Ex: Adultização precoce infantil nas mídias sociais digitais"
                            onChange={(e) => handleInputChange("theme", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-600 text-xs"
                          />
                        </div>

                        <div className="space-y-2.5 pt-2 border-t border-slate-100">
                          <span className="font-mono text-indigo-600 block font-bold text-[9px] tracking-wider uppercase">TÉCNICA DO P.O.C. (Recorte de Tema)</span>
                          
                          <div>
                            <label className="text-slate-500 font-bold block mb-1 text-[10px]">População (P) - Quem será focado?</label>
                            <input
                              type="text"
                              value={drafts.population}
                              placeholder="Ex: Crianças entre 9 e 12 anos e familiares"
                              onChange={(e) => handleInputChange("population", e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-slate-500 font-bold block mb-1 text-[10px]">Objeto (O) - Qual fenômeno explícito analisar?</label>
                            <input
                              type="text"
                              value={drafts.object}
                              placeholder="Ex: Sinais de adultização precoce (vestimentas e falas sensualizadas)"
                              onChange={(e) => handleInputChange("object", e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-slate-500 font-bold block mb-1 text-[10px]">Contexto (C) - Onde/Quando?</label>
                            <input
                              type="text"
                              value={drafts.context}
                              placeholder="Ex: Plataformas TikTok e Instagram no Brasil entre 2023-2025"
                              onChange={(e) => handleInputChange("context", e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <label className="text-slate-500 font-bold block mb-1 text-[10px]">TEMA COMPILADO E DELIMITADO:</label>
                          <textarea
                            rows={2}
                            value={drafts.delimitedTheme}
                            placeholder="Frase fluida compilada da sua Delimitação."
                            onChange={(e) => handleInputChange("delimitedTheme", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Chapter 3: Problem */}
                    {selectedChapterNum === 3 && (
                      <div className="space-y-4 text-xs">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 italic leading-snug">
                          Tema Delimitado Anterior: <strong className="text-indigo-650 italic font-medium">{drafts.delimitedTheme || drafts.theme || "Pendente de preenchimento no Cap 2."}</strong>
                        </div>

                        <div>
                          <label className="text-slate-650 font-bold block mb-1">Seu Problema de Pesquisa (Pergunta Central):</label>
                          <textarea
                            rows={3}
                            value={drafts.researchProblem}
                            placeholder="Ex: Como a presença ativa nas plataformas digitais TikTok influencia a adoção de posturas..."
                            onChange={(e) => handleInputChange("researchProblem", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 text-xs leading-normal"
                          />
                        </div>

                        {/* Interactive validator audit component */}
                        <div className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-150 space-y-2">
                          <h4 className="font-extrabold text-slate-800 flex items-center gap-1 text-[10.5px]">
                            <Info className="w-4 h-4 text-indigo-600" /> Consultoria Técnica de Fraseologia
                          </h4>
                          
                          <div className="space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span>Termina com ponto de interrogação?</span>
                              {problemValidation.isQuestion ? (
                                <span className="text-emerald-600 font-bold flex items-center"><Check className="w-3.5 h-3.5" /> Sim</span>
                              ) : (
                                <span className="text-rose-500 font-bold flex items-center"><X className="w-3.5 h-3.5" /> Não</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span>Indica termo interrogativo amplo?</span>
                              {problemValidation.startsWithInterrogative ? (
                                <span className="text-emerald-600 font-bold flex items-center"><Check className="w-3.5 h-3.5" /> Sim</span>
                              ) : (
                                <span className="text-amber-700 font-bold flex items-center"><AlertTriangle className="w-3.5 h-3.5" /> Fraco</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <span>Livre de Dicotomia Simples (Sim/Não)?</span>
                              {!problemValidation.isDicotomic ? (
                                <span className="text-emerald-600 font-bold flex items-center"><Check className="w-3.5 h-3.5" /> Seguro</span>
                              ) : (
                                <span className="text-amber-705 font-bold flex items-center leading-none text-amber-750">Evite verbos diretos</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Chapter 4: Objectives & Congress */}
                    {selectedChapterNum === 4 && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 uppercase tracking-wide text-[9px]">Objetivo Geral máximo:</label>
                          <input
                            type="text"
                            value={drafts.generalObjective}
                            placeholder="Analisar a influência da participação ativa sobre..."
                            onChange={(e) => handleInputChange("generalObjective", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <label className="text-slate-500 font-bold block mb-1 uppercase tracking-wide text-[9px]">Objetivos Específicos (Etapas):</label>
                          <input
                            type="text"
                            value={drafts.specificObjective1}
                            placeholder="1. Mapear os tipos de conteúdos mais visualizados..."
                            onChange={(e) => handleInputChange("specificObjective1", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                          <input
                            type="text"
                            value={drafts.specificObjective2}
                            placeholder="2. Identificar os marcadores estéticos visuais..."
                            onChange={(e) => handleInputChange("specificObjective2", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <label className="text-slate-500 font-bold block mb-1 uppercase tracking-wide text-[9px]">Hipóteses Provisórias:</label>
                          <textarea
                            rows={2}
                            value={drafts.hypotheses}
                            placeholder="H1: Crianças com maior exposição online reproduzem mais marcadores."
                            onChange={(e) => handleInputChange("hypotheses", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5"
                          />
                        </div>

                        {/* Interactive Health Congress Activity */}
                        <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl space-y-2 pt-2.5">
                          <div className="flex items-center gap-2">
                            <HeartPulse className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                            <div>
                              <h4 className="font-bold text-emerald-800 text-[11px] leading-none uppercase">
                                Simulador: Escuta Ativa do Congresso de Saúde
                              </h4>
                            </div>
                          </div>
                          <p className="text-[10.5px] text-slate-600 leading-normal">
                            Simule escuta científica de uma palestra real e extraia componentes científicos chaves:
                          </p>
                          <input
                            type="text"
                            value={drafts.congressLectureTitle}
                            placeholder="Nome / Tema da Palestra Escutada..."
                            onChange={(e) => handleInputChange("congressLectureTitle", e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-800 rounded-lg p-1.5 focus:outline-none text-xs"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={drafts.congressProblem}
                              placeholder="Problema extraído..."
                              onChange={(e) => handleInputChange("congressProblem", e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-800 rounded p-1.5 text-[10.5px]"
                            />
                            <input
                              type="text"
                              value={drafts.congressObjective}
                              placeholder="Objetivo extraído..."
                              onChange={(e) => handleInputChange("congressObjective", e.target.value)}
                              className="w-full bg-white border border-slate-200 text-slate-800 rounded p-1.5 text-[10.5px]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Chapter 5: Justification */}
                    {selectedChapterNum === 5 && (
                      <div className="space-y-3.5 text-xs">
                        <div className="bg-slate-55 p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[10px] font-mono font-bold text-indigo-650 block uppercase">Manual de Severino (2017)</span>
                          <p className="text-slate-500 text-[10.5px] leading-relaxed mt-0.5">
                            Explique os pilares argumentativos que comprovam o valor e a pertinência teórica tripla do seu tema:
                          </p>
                        </div>

                        <div>
                          <label className="text-slate-550 font-bold block mb-1">Relevância Social (Qual utilidade comunitária?)</label>
                          <textarea
                            rows={2}
                            value={drafts.justificationSocial}
                            placeholder="Ex: Apoia famílias e educadores a limitarem a hipersexualização decorrente..."
                            onChange={(e) => handleInputChange("justificationSocial", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="text-slate-550 font-bold block mb-1 font-sans">Relevância Científica (Contribuição teórica?)</label>
                          <textarea
                            rows={2}
                            value={drafts.justificationScientific}
                            placeholder="Ex: Amplia discussões qualitativas ligadas a algoritmos de indicação estéticos..."
                            onChange={(e) => handleInputChange("justificationScientific", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="text-slate-550 font-bold block mb-1">Relevância Prática (Uso no labor acadêmico/diário?)</label>
                          <textarea
                            rows={2}
                            value={drafts.justificationPractical}
                            placeholder="Ex: Instrumento prático para psicologia escolar formular guias protetivos..."
                            onChange={(e) => handleInputChange("justificationPractical", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="text-slate-550 font-bold block mb-1 font-sans">Estudo de Viabilidade física (Temos tempo/acesso?)</label>
                          <input
                            type="text"
                            value={drafts.justificationViability}
                            placeholder="Ex: Viável pois investiga mídias públicas digitais e usa entrevistas online..."
                            onChange={(e) => handleInputChange("justificationViability", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                        </div>
                      </div>
                    )}

                    {/* Chapter 6: Methodology Classifications */}
                    {selectedChapterNum === 6 && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-slate-505 font-bold block mb-1">Classificação por Fins (Suas metas):</label>
                          <select
                            value={drafts.researchType}
                            onChange={(e) => handleInputChange("researchType", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 focus:outline-none text-xs cursor-pointer"
                          >
                            <option value="">Selecione...</option>
                            <option value="Exploratória">Exploratória (contato inicial e hipóteses)</option>
                            <option value="Descritiva">Descritiva (coleta de frequências e perfil)</option>
                            <option value="Explicativa">Explicativa (relação causal de fenômenos)</option>
                            <option value="Exploratória e Descritiva">Mista (Exploratória + Descritiva)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-slate-505 font-bold block mb-1">Classificação por Meios (Filosofia metodológica):</label>
                          <div className="grid grid-cols-3 gap-2">
                            {["Qualitativa", "Quantitativa", "Mista / Integrada"].map((appr) => {
                              const isSel = drafts.researchApproach === appr;
                              return (
                                <button
                                  key={appr}
                                  type="button"
                                  onClick={() => handleInputChange("researchApproach", appr)}
                                  className={`p-2 rounded-lg border font-bold text-center transition-all text-[11px] cursor-pointer ${
                                    isSel
                                      ? "bg-indigo-600 border-indigo-600 text-white shadow-3xs"
                                      : "bg-slate-50 border-slate-200 hover:bg-slate-100/70 text-slate-700"
                                  }`}
                                >
                                  {appr}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <label className="text-slate-505 font-bold block mb-1">Amostra pretendida e Critérios de inclusão:</label>
                          <textarea
                            rows={3}
                            value={drafts.sampleCriteria}
                            placeholder="Ex: 15 perfis abertos altamente engajados do TikTok; Filtro: acima de 50 mil seguidores..."
                            onChange={(e) => handleInputChange("sampleCriteria", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 leading-relaxed text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* Chapter 7: Data Collection */}
                    {selectedChapterNum === 7 && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-slate-500 font-bold block mb-1">Seu Instrumento de Coleta de dados:</label>
                          <input
                            type="text"
                            value={drafts.dataCollectionTool}
                            placeholder="Ex: Ficha de catalogação de postagens e roteiro de entrevista..."
                            onChange={(e) => handleInputChange("dataCollectionTool", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2"
                          />
                        </div>

                        <div>
                          <label className="text-slate-500 font-bold block mb-1">Método de Análise de dados planejado:</label>
                          <select
                            value={drafts.dataAnalysisMethod}
                            onChange={(e) => handleInputChange("dataAnalysisMethod", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2 cursor-pointer focus:outline-none"
                          >
                            <option value="">Selecione...</option>
                            <option value="Análise de Conteúdo Temática (Bardin 2011)">Análise de Conteúdo Temática (Bardin)</option>
                            <option value="Estatística Descritiva (Médias, Gráficos)">Estatística Descritiva de dados quantitativos</option>
                            <option value="Análise Hermenêutica / Dialética">Hermenêutica e Análise Discursiva</option>
                            <option value="Método Comparativo Teórico">Tabulação comparativa conceitual</option>
                          </select>
                        </div>

                        {/* Ethics Approval check box */}
                        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2 pt-2.5 text-xs">
                          <label className="flex items-start gap-2 text-slate-700 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={drafts.ethicsApprovalNeeded}
                              onChange={(e) => handleInputChange("ethicsApprovalNeeded", e.target.checked)}
                              className="mt-1 accent-indigo-600 h-4 w-4"
                            />
                            <div>
                              <span>Haverá interação direta com seres humanos no estudo?</span>
                              <p className="text-[10px] text-slate-450 leading-normal font-normal mt-0.5">
                                Selecione se deseja interagir com pais ou crianças em entrevistas ou testes. Isto requer comitê de ética nacional.
                              </p>
                            </div>
                          </label>

                          {drafts.ethicsApprovalNeeded && (
                            <div className="bg-white border border-indigo-150 rounded p-2 text-[10px] leading-relaxed text-indigo-950 flex items-start gap-1 font-mono">
                              <Scale className="w-4 h-4 text-indigo-650 flex-shrink-0" />
                              <span>De acordo com a Resolução CNS 510/16 brasileira, o envio à aprovação pela Plataforma Brasil CEP/CONEP é altamente prioritário.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Chapter 8: Expected results */}
                    {selectedChapterNum === 8 && (
                      <div className="space-y-4 text-xs">
                        <div>
                          <label className="text-slate-500 font-bold block mb-1 text-[10.5px]">Expectativa de Resultados Esperados:</label>
                          <textarea
                            rows={3}
                            value={drafts.expectedResultsText}
                            placeholder="Espera-se catalogar os tipos mais recorrentes de comportamentos estéticos, mapear as reações..."
                            onChange={(e) => handleInputChange("expectedResultsText", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg p-2.5 leading-normal"
                          />
                        </div>

                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5">
                          <Clock className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                          <div>
                            <span className="font-bold text-slate-800 text-xs">Estudo de Prazos (Gantt)</span>
                            <span className="text-[10px] text-slate-450 block leading-tight mt-0.5">
                              Encontre o cronograma físico interativo na aba 'Meus Salvos' para organizar a viabilidade operacional das frentes.
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </div>

            {/* Float interactive Gantt chart if selected Chapter 8 */}
            {selectedChapterNum === 8 && (
              <div className="pt-2 animate-fade-in">
                <GanttChart phases={timelinePhases} onPhaseChange={setTimelinePhases} />
              </div>
            )}

            {/* IA Chat Assistente coorientador */}
            <div id="ai-advisor-panel" className="pt-3">
              <ResearchAssistant sprintNum={selectedChapterNum} drafts={drafts} />
            </div>

          </div>
        )}

        {/* ------------------------- SIMULADO FINAL & CERTIFICADO (TAB: "simulado") ------------------------- */}
        {activeTabKey === "simulado" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Split layout: final test & printable certificate emission code */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Exam panel */}
              <div className="col-span-12 lg:col-span-6 bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-3xs">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <Clock className="w-5 h-5 text-indigo-650 text-indigo-600" />
                  <div>
                    <h3 className="font-display font-semibold text-xs py-0.5 uppercase tracking-wide text-slate-800">Simulado Acadêmico Final</h3>
                    <p className="text-[10px] text-slate-400 font-mono">12 questões compiladas de todo o curso</p>
                  </div>
                </div>

                {simuladoSubmitted ? (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center space-y-3">
                    <Award className="w-10 h-10 text-indigo-600 mx-auto" />
                    <h4 className="text-sm font-bold text-indigo-900 uppercase">Simulado Final Concluído!</h4>
                    <p className="text-3xl font-black text-slate-900 font-display">
                      {simuladoGrade?.correct} de {simuladoGrade?.total} Corretas
                    </p>
                    <p className="text-xs leading-relaxed text-slate-600 max-w-sm mx-auto font-sans">
                      Seu aproveitamento teórico foi registrado. Se você errou questões, revise os capítulos teóricos pertinentes na barra de abas.
                    </p>
                    <button
                      onClick={() => {
                        setSimuladoAnswers({});
                        setSimuladoSubmitted(false);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold p-1.5 px-4 rounded-lg text-xs leading-none transition-all cursor-pointer"
                    >
                      Atestar Novamente
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    {simuladoQuestions.slice(0, 12).map((q, idx) => {
                      const selOpt = simuladoAnswers[q.id];
                      return (
                        <div key={q.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/40 space-y-2">
                          <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase">Questão {idx + 1} (semana {q.sprintNum})</span>
                          <h4 className="text-[11.5px] font-bold text-slate-800 leading-tight">
                            {q.question}
                          </h4>
                          <div className="space-y-1">
                            {q.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => setSimuladoAnswers(prev => ({ ...prev, [q.id]: oIdx }))}
                                className={`w-full text-left px-3 py-1.5 rounded border text-[11px] leading-tight transition-all cursor-pointer ${
                                  selOpt === oIdx 
                                    ? "bg-indigo-600 text-white border-indigo-600 font-bold" 
                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    <button
                      onClick={handleSimuladoSubmit}
                      className="w-full bg-slate-905 bg-slate-900 hover:bg-slate-800 text-white font-bold p-2 px-4 rounded-lg text-xs text-center transition-all cursor-pointer"
                    >
                      Finalizar e Corrigir Simulado
                    </button>
                  </div>
                )}
              </div>

              {/* Certificate panel */}
              <div className="col-span-12 lg:col-span-6 space-y-4">
                
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <div>
                      <h3 className="font-display font-semibold text-xs py-0.5 uppercase tracking-wide text-slate-900">Emissão de Certificado</h3>
                      <p className="text-[10px] text-slate-400 font-mono">Homologação de evolução de mídias</p>
                    </div>
                  </div>

                  {sectionsReadPercentage < 100 && completenessPercentage < 100 ? (
                    <div className="bg-slate-50 border border-slate-250 p-5 rounded-xl text-center space-y-3">
                      <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
                      <h4 className="font-bold text-slate-800 text-xs">Evolução Insuficiente do Dashboard</h4>
                      <p className="text-xs leading-relaxed text-slate-505 font-sans max-w-sm mx-auto">
                        Para emitir o certificado, é necessário ler as 24 seções doutrinárias ou preencher os rascunhos acadêmicos completos da Ficha Prática!
                      </p>
                      <div className="text-[11px] font-mono text-slate-400">
                        Suas leituras: <strong className="text-indigo-650">{sectionsReadCount}/24 lidos</strong> | Draft: <strong className="text-indigo-650">{completenessPercentage}% preenchido</strong>
                      </div>
                    </div>
                  ) : !activeCertificate ? (
                    <div className="space-y-3.5 text-center py-3">
                      <p className="text-xs leading-relaxed text-slate-600 max-w-lg mx-auto">
                        Parabéns! Você alcançou o progresso acadêmico necessário para obter a homologação de sua apostila interativa no Google Drive da Profª Elisangela.
                      </p>
                      <button
                        onClick={async () => {
                          const code = "MP-" + Math.random().toString(36).substr(2, 9).toUpperCase();
                          try {
                            await setDoc(doc(db, "certificates", user?.uid || "anonymous_student"), {
                              id: user?.uid || "anonymous_student",
                              studentUid: user?.uid || "anonymous_student",
                              studentName: user?.displayName || "Aluno",
                              studentEmail: user?.email || "aluno_anonimo@email.com",
                              issueDate: new Date().toISOString(),
                              status: "pending",
                              certificateCode: code
                            });
                          } catch (e) {
                            console.error("Error creating certificate request", e);
                          }
                        }}
                        className="bg-indigo-600 hover:bg-indigo-550 text-white font-bold p-2 px-5 rounded-lg text-xs leading-none select-none transition-all cursor-pointer shadow-3xs border border-indigo-700"
                      >
                        Solicitar Emissão de Certificado Oficial
                      </button>
                    </div>
                  ) : activeCertificate.status === "pending" ? (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-center font-sans space-y-2">
                      <h4 className="text-xs font-bold text-amber-800">⏳ Homologação Solicitada com Sucesso!</h4>
                      <p className="text-[11px] leading-relaxed text-slate-600">
                        Sua solicitação de certificado (Protocolo: <strong>{activeCertificate.certificateCode}</strong>) está aguardando verificação e liberação pela Profª. Elisangela Campos. Volte em breve!
                      </p>
                    </div>
                  ) : (
                    /* DELIVERED GLAMOROUS PRINTABLE ACADEMIC CERTIFICATE */
                    <div className="space-y-4">
                      <div className="border-[8px] border-double border-indigo-950 p-6 md:p-8 bg-slate-50 rounded-xl shadow-inner max-w-3xl mx-auto text-center font-serif relative overflow-hidden select-none">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
                        
                        <span className="text-[10px] font-sans font-bold tracking-widest text-indigo-755 block uppercase mb-1">
                          República Federativa do Brasil
                        </span>
                        <h2 className="text-lg md:text-xl font-black text-indigo-950 tracking-tight leading-none font-display mb-1">
                          Certificado de Conclusão Acadêmica
                        </h2>
                        <span className="text-slate-400 block text-[9.5px] uppercase font-sans tracking-wide mb-6">
                          MÍDIAS SOCIAIS E METODOLOGIA CIENTÍFICA
                        </span>

                        <p className="text-[10.5px] md:text-[11px] leading-relaxed max-w-2xl mx-auto text-slate-700 italic font-sans mb-6">
                          Certificamos para os devidos fins que o estudante de iniciação científica <strong className="text-slate-900 not-italic uppercase font-bold tracking-wide border-b border-slate-355 px-1">{activeCertificate.studentName}</strong> concluiu com aproveitamento integral a elaboração prática guiada por Inteligência Artificial de sua proposta científica abrangendo a adultização infantil nas mídias sociais digitais na Apostila Interativa, ministrado pela <span className="font-semibold text-slate-800 not-italic">Profª. Elisangela Campos</span> em 2026.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-sans text-[9px] leading-tight text-slate-500 mb-4 italic font-sans">
                          <div>
                            <span className="block font-bold text-slate-705 not-italic">Profª. Elisangela Campos</span>
                            <span className="block text-[8px] uppercase font-mono tracking-wider text-slate-400 mt-1">Coordenadora Acadêmica</span>
                          </div>
                          <div>
                            <span className="block font-bold text-slate-705 not-italic">Data de Emissão</span>
                            <span className="block text-[8px] uppercase text-slate-60s mt-1">
                              {new Date(activeCertificate.issueDate).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>

                        <div className="text-[8px] font-mono text-slate-400 text-center pt-2">
                          Código de Autenticação: <strong className="text-slate-600">{activeCertificate.certificateCode}</strong>
                        </div>
                      </div>

                      <div className="text-center">
                        <button
                          onClick={() => window.print()}
                          className="bg-indigo-950 hover:bg-slate-900 text-white font-bold p-2 px-4 rounded-lg text-xs select-none transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <ClipboardCheck className="w-4 h-4" /> Imprimir ou Salvar em PDF
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <ResearchAssistant sprintNum={9} drafts={drafts} />
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ------------------------- GLOSSÁRIO DOUTRINÁRIO (TAB: "glossario") ------------------------- */}
        {activeTabKey === "glossario" && (
          <div className="space-y-4 animate-fade-in text-slate-800">
            <div className="bg-indigo-955 bg-indigo-900 text-white rounded-xl p-5 space-y-2.5">
              <h3 className="font-display font-medium text-sm md:text-base">Glossário Doutrinário Geral</h3>
              <p className="text-[11.5px] leading-relaxed text-indigo-200">
                Consulte em tempo real definições e as correntes teóricas chaves de autores de referência de leitura (Lakatos & Marconi, Gil, Bardin, Severino, etc.).
              </p>
              
              {/* Search input bar */}
              <div className="relative max-w-md pt-1.5">
                <Search className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  placeholder="Pesquisar termo metodológico ou autor..."
                  className="w-full bg-white text-slate-800 px-3 py-1.5 pl-9 rounded-lg text-xs focus:outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredGlossary.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-xl shadow-3xs space-y-2 hover:border-indigo-500 transition-all">
                  <div className="flex justify-between items-start gap-1">
                    <span className="font-display font-bold text-slate-900 text-xs">{item.term}</span>
                    <span className="text-[9px] font-mono text-indigo-650 bg-indigo-50 border border-indigo-100 px-1 rounded uppercase">
                      {item.author}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed">{item.definition}</p>
                </div>
              ))}
              {filteredGlossary.length === 0 && (
                <p className="col-span-full py-6 text-slate-400 text-center text-xs font-sans">Nenhum termo doutrinário atende à sua pesquisa.</p>
              )}
            </div>
          </div>
        )}

        {/* ------------------------- MEUS SALVOS/NOTAS (TAB: "salvos") ------------------------- */}
        {activeTabKey === "salvos" && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Bookmarked highlights section */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-3xs">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-105">
                <Bookmark className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-display font-semibold text-xs py-0.5 uppercase tracking-wide text-slate-950">Trechos Doutrinários Salvos</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Bookmarking acadêmico persistente</p>
                </div>
              </div>

              {Object.keys(savedSections).filter(k => savedSections[k]).length === 0 ? (
                <p className="text-xs text-slate-400 py-2.5 font-sans">Você ainda não favoritou nenhum trecho de apoio teórico nos capítulos.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {Object.keys(savedSections).map((secKey) => {
                    if (!savedSections[secKey]) return null;
                    const parts = secKey.split("-");
                    const sprNum = parseInt(parts[1], 10);
                    const secIdx = parseInt(parts[3], 10);
                    const sprObj = SPRINTS_DATA[sprNum];
                    if (!sprObj) return null;
                    const parsedSecs = parseDoctrinalSections(sprObj.contentMarkdown);
                    const targetSec = parsedSecs[secIdx];
                    if (!targetSec) return null;

                    return (
                      <div key={secKey} className="bg-slate-50 p-4 border border-slate-200 rounded-xl flex flex-col justify-between space-y-2.5">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start text-[9.5px]">
                            <span className="bg-indigo-50 border border-indigo-150 text-indigo-700 px-1 rounded uppercase tracking-wider font-bold">
                              Semana {sprNum}
                            </span>
                            <span className="text-slate-400 font-mono">Índice {secIdx + 1}</span>
                          </div>
                          <h4 className="font-bold text-[11px] text-slate-800 line-clamp-1">{targetSec.title}</h4>
                          <p className="text-xs font-sans text-slate-500 line-clamp-3 leading-relaxed">
                            {targetSec.paragraphs[0]}
                          </p>
                        </div>

                        <div className="border-t border-slate-100/60 pt-2.5 flex justify-between items-center">
                          <button
                            onClick={() => {
                              setSelectedChapterNum(sprNum);
                              setActiveTabKey("leitura");
                            }}
                            className="text-indigo-600 hover:text-indigo-805 text-[10.5px] font-bold cursor-pointer inline-flex items-center gap-1 hover:underline"
                          >
                            Ir para Capítulo <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => setSavedSections(prev => ({ ...prev, [secKey]: false }))}
                            className="text-[10px] text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Embedded interactive Gantt chart */}
            <div id="gantt-board-canvas" className="bg-slate-900 text-slate-100 rounded-xl p-0.5 border border-slate-800">
              <GanttChart phases={timelinePhases} onPhaseChange={setTimelinePhases} />
            </div>

            {/* General consolidate scientific paper report (UnifiedProjectCanvas) */}
            <div id="project-consolidated-canvas" className="bg-white rounded-xl border border-slate-205">
              <UnifiedProjectCanvas
                drafts={drafts}
                timelinePhases={timelinePhases}
                onReset={handleReset}
                onSetExampleDraft={handleSetExample}
              />
            </div>

          </div>
        )}

        {/* ------------------------- ÁREA DO PROFESSOR (TAB: "teacher") ------------------------- */}
        {activeTabKey === "teacher" && user?.email === ADMIN_EMAIL && (
          <div className="space-y-6 animate-fade-in text-slate-805">
            
            {/* Master administrative top card */}
            <div className="bg-rose-955 bg-rose-900 border border-rose-955 rounded-xl p-5 text-rose-50 flex justify-between items-center gap-4 flex-wrap shadow-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-rose-300 font-mono uppercase tracking-wider font-bold">Coordenação de Laboratório</span>
                <h2 className="text-xl md:text-2xl font-black font-display text-white">Painel da Profª. Elisangela Campos</h2>
                <p className="text-xs text-rose-200 font-sans leading-normal">
                  Sincronize as evoluções individuais, libere novos certificados emitidos e realize inspeções por amostragem.
                </p>
              </div>
            </div>

            {/* Google Drive and Google Sheets Integration Settings Card */}
            <div className="bg-white rounded-xl border border-slate-202 p-5 space-y-4 shadow-3xs">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                <Database className="w-5 h-5 text-rose-600" />
                <div>
                  <h3 className="font-display font-semibold text-xs py-0.5 uppercase tracking-wider text-slate-900">Vínculo com o Google Drive & Sheets</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Armazenamento oficial e persistente de notas de mídias</p>
                </div>
              </div>

              {!sheetsConfig ? (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-4 space-y-3">
                  <p className="text-xs text-slate-700 leading-normal font-sans">
                    Sua conta não possui nenhuma planilha Google de aprovação de notas de iniciação acadêmica gerada no momento. Clique para dar permissão ao Google Sheets de seu e-mail <strong>{ADMIN_EMAIL}</strong>.
                  </p>
                  <button
                    disabled={creatingSheet}
                    onClick={async () => {
                      if (!accessToken) {
                        alert("Efetue login com o Google para autorizar o acesso ao Drive.");
                        return;
                      }
                      setCreatingSheet(true);
                      try {
                        const res = await createSheetsDb(accessToken);
                        const sheetsObj = {
                          spreadsheetId: res.spreadsheetId,
                          spreadsheetUrl: res.url,
                          professorEmail: ADMIN_EMAIL,
                          lastSync: new Date().toISOString()
                        };
                        await setDoc(doc(db, "adminConfig", "sheetsConfig"), sheetsObj);
                        setSheetsConfig(sheetsObj);
                        alert("Planilha criada com sucesso no seu Google Drive!");
                      } catch (err: any) {
                        console.error("Erro ao configurar planilha", err);
                        alert(`Falha: ${err.message || err}`);
                      } finally {
                        setCreatingSheet(false);
                      }
                    }}
                    className="bg-rose-600 hover:bg-rose-550 border border-rose-700 font-bold px-4 py-2 rounded-lg text-xs text-white shadow-sm inline-flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-white" />
                    {creatingSheet ? "Criando no Google Drive..." : "Criar Planilha no Meu Drive"}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3.5 text-xs text-slate-705 leading-normal">
                    <div className="space-y-1">
                      <span className="text-slate-400 text-[10px] font-mono block">Planilha Acadêmica Conectada</span>
                      <a
                        href={sheetsConfig.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-black text-rose-600 font-sans hover:underline block break-all"
                      >
                        {sheetsConfig.spreadsheetUrl}
                      </a>
                    </div>
                    <div className="space-y-1 md:text-right">
                      <span className="text-slate-400 text-[10px] font-mono block">Sincronia Recente</span>
                      <span className="font-semibold text-slate-800">
                        {sheetsConfig.lastSync 
                          ? new Date(sheetsConfig.lastSync).toLocaleString("pt-BR") 
                          : "Inédita"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={syncingSheets}
                      onClick={async () => {
                        if (!accessToken) {
                          alert("Acesso expirado. Faça login novamente para renovar credenciais do Google Drive.");
                          return;
                        }
                        setSyncingSheets(true);
                        try {
                          const formattedForSheet = allStudents.map((st) => {
                            const studentCert = allCertificates.find((c) => c.studentUid === st.uid);
                            return {
                              uid: st.uid,
                              name: st.name || "Sem Nome",
                              email: st.email || "",
                              progress: st.progress || 0,
                              lastActive: st.lastActive ? new Date(st.lastActive).toLocaleString("pt-BR") : "Inativo",
                              certificateStatus: studentCert ? (studentCert.status === "delivered" ? "Emitido" : "Pendente de Homologação") : "Não solicitado",
                              certificateCode: studentCert ? studentCert.certificateCode : "N/A"
                            };
                          });

                          await writeStudentsToSheet(accessToken, sheetsConfig.spreadsheetId, formattedForSheet);
                          
                          const timestamp = new Date().toISOString();
                          await setDoc(doc(db, "adminConfig", "sheetsConfig"), {
                            ...sheetsConfig,
                            lastSync: timestamp
                          });
                          
                          setSheetsConfig((prev: any) => ({ ...prev, lastSync: timestamp }));
                          alert("Evolução dos alunos sincronizada com sucesso na planilha do seu Google Drive!");
                        } catch (err: any) {
                          console.error("Sync error", err);
                          alert(`Erro ao sincronizar dados: ${err.message || err}`);
                        } finally {
                          setSyncingSheets(false);
                        }
                      }}
                      className="bg-rose-605 bg-rose-600 hover:bg-rose-500 font-bold px-3.5 py-2 rounded-lg text-xs text-white shadow-3xs inline-flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${syncingSheets ? "animate-spin" : ""}`} />
                      {syncingSheets ? "Sincronizando..." : "Sincronizar com Google Sheets"}
                    </button>
                    <a
                      href={sheetsConfig.spreadsheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-900 hover:bg-slate-800 font-bold px-3.5 py-2 rounded-lg text-xs text-white select-none text-center flex items-center justify-center cursor-pointer transition-colors"
                    >
                      Abrir Planilha
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
              <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-3xs">
                <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Iniciantes Cadastrados</span>
                <span className="text-2xl font-black text-slate-800 font-display">{allStudents.length}</span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-3xs">
                <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Conclusões Inteiras (100%)</span>
                <span className="text-2xl font-black text-emerald-600 font-display">
                  {allStudents.filter((s) => s.progress === 100).length}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-3xs">
                <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Homologações Pendentes</span>
                <span className="text-2xl font-black text-amber-600 font-display">
                  {allCertificates.filter((c) => c.status === "pending").length}
                </span>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-xl text-center shadow-3xs">
                <span className="text-slate-400 font-mono text-[9px] uppercase font-bold block">Códigos Cert emitidos</span>
                <span className="text-2xl font-black text-indigo-600 font-display">
                  {allCertificates.filter((c) => c.status === "delivered").length}
                </span>
              </div>
            </div>

            {/* Students list */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-slate-100">
                <CheckSquare className="w-4 h-4 text-slate-500" />
                <h3 className="font-display font-semibold text-[11px] uppercase tracking-wider text-slate-900 leading-none">
                  Acompanhamento de Alunos Cadastrados
                </h3>
              </div>

              {allStudents.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Nenhum aluno registrado no banco de dados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 leading-snug border-collapse border-b border-slate-100">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase font-bold">
                        <th className="py-2.5 px-3">Estudante</th>
                        <th className="py-2.5 px-3">Evolução de Atividades</th>
                        <th className="py-2.5 px-3">Última Atividade</th>
                        <th className="py-2.5 px-3">Certificado</th>
                        <th className="py-2.5 px-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allStudents.map((st) => {
                        const studentCert = allCertificates.find((c) => c.studentUid === st.uid);
                        return (
                          <tr key={st.uid} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-3 font-sans">
                              <span className="font-bold text-slate-950 block">{st.name || "Aluno sem Nome"}</span>
                              <span className="text-[10px] text-slate-400 font-mono block">{st.email}</span>
                            </td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-indigo-600 w-8">{st.progress || 0}%</span>
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-600 rounded-full"
                                    style={{ width: `${st.progress || 0}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">
                              {st.lastActive ? new Date(st.lastActive).toLocaleString("pt-BR") : "Inativo"}
                            </td>
                            <td className="py-2.5 px-3">
                              {studentCert ? (
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  studentCert.status === "delivered" 
                                    ? "bg-indigo-50 text-indigo-650 border border-indigo-100" 
                                    : "bg-amber-50 text-amber-600 border border-amber-100"
                                }`}>
                                  {studentCert.status === "delivered" ? "Emitido" : "Pendente"}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Não solicitado</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                              {/* Audit student drafts */}
                              <button
                                onClick={() => {
                                  // Backup profile first
                                  setBackupDrafts(drafts);
                                  setBackupQuizAnswers(quizAnswers);
                                  setBackupQuizChecked(quizChecked);
                                  // Set student context
                                  setDrafts(st.drafts || DEFAULT_DRAFTS);
                                  setQuizAnswers(st.quizzesAnswers || {});
                                  setQuizChecked(st.quizzesChecked || {});
                                  setViewingStudentId(st.uid);
                                  setViewingStudentName(st.name);
                                  setViewingStudentEmail(st.email);
                                  setActiveTabKey("salvos"); // Go directly to consolidated workspace
                                }}
                                className="inline-flex items-center gap-1 border border-slate-200 hover:bg-slate-150 bg-white p-1 px-2.5 rounded-lg font-sans text-[10px] text-slate-700 transition-all cursor-pointer select-none"
                              >
                                <Eye className="w-3 h-3 text-indigo-500" /> Revisar Rascunhos
                              </button>

                              {/* Emit pending certificate */}
                              {studentCert && studentCert.status === "pending" && (
                                <button
                                  onClick={async () => {
                                    try {
                                      await setDoc(doc(db, "certificates", st.uid), {
                                        status: "delivered"
                                      }, { merge: true });
                                    } catch (err) {
                                      console.error("Error issuing certificate:", err);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 border border-indigo-650 bg-indigo-600 text-white font-bold p-1 px-2.5 rounded-lg font-sans text-[10px] hover:bg-indigo-550 transition-all cursor-pointer select-none"
                                >
                                  Emitir Certificado
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
