import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { enterKanbanCardDocument, getKanbanCardDocument } from "@/firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GripVertical, Loader, Plus, SaveIcon, Trash2, XIcon } from "lucide-react";
import { motion } from "motion/react";
import { type Dispatch, type DragEvent, type FormEvent, type SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
//@ts-ignore
import { enableDragDropTouch } from "@/lib/drag-drop-touch.esm.min.js";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { auth } from "@/firebase/firebase";

type ColumnType = "inStock" | "runningLow" | "outOfStock" | "restocked";

export type CardType = {
  title: string;
  id: string;
  column: ColumnType;
  uid: string;
  displayName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export function KanbanBoard() {
  const {
    data: kanbanCards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["kanbanCards"],
    queryFn: getKanbanCardDocument,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });

  const queryClient = useQueryClient();

  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    if (kanbanCards) {
      console.log("kanbanCards", kanbanCards);
      // Set the initial state of cards
      setCards(kanbanCards);
    }
  }, [kanbanCards]);

  const enterKanbanCardMutation = useMutation({
    mutationFn: enterKanbanCardDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kanbanCards"] });
      toast("Kanban card entered successfully!");
    },
  });

  const saveCards = () => {
    // Save cards to firestore
    enterKanbanCardMutation.mutate(cards);
  };
  useEffect(() => {
    enableDragDropTouch(); // Apply polyfill for touch support
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader className="animate-spin" size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        Error: {error.message}
        <br />
        Press F5 to Refresh!
      </div>
    );
  }

  return (
    <div className="flex gap-3 bg-muted dark:bg-background shadow-sm p-2 border rounded-lg w-full h-full overflow-y-auto text-card-foreground">
      <div className="flex flex-wrap landscape:flex-nowrap flex-[80%] landscape:gap-3 landscape:w-full landscape:h-full">
        <KanbanColumn
          title="In Stock"
          column="inStock"
          headingColor="text-blue-500"
          cards={cards}
          setCards={setCards}
        />
        <KanbanColumn
          title="Running Low"
          column="runningLow"
          headingColor="text-yellow-500"
          cards={cards}
          setCards={setCards}
        />
        <KanbanColumn
          title="Out of Stock"
          column="outOfStock"
          headingColor="text-red-600"
          cards={cards}
          setCards={setCards}
        />
        <KanbanColumn
          title="Restocked"
          column="restocked"
          headingColor="text-emerald-400"
          cards={cards}
          setCards={setCards}
        />
      </div>

      <div className="flex flex-col flex-1/5 gap-6 bg-muted dark:bg-background rounded-lg w-full h-full overflow-hidden text-card-foreground">
        <Button
          className="inline-flex items-center gap-2 px-4 py-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm transition-opacity duration-500"
          onClick={saveCards} // Save cards when button is clicked
        >
          <SaveIcon color="#ffffff" />
          {enterKanbanCardMutation.isPending ? " Saving..." : "Save"}
        </Button>

        <KanbanDelete setCards={setCards} />
      </div>
    </div>
  );
}

type KanbanColumnProps = {
  title: string;
  headingColor: string;
  cards: CardType[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const KanbanColumn = ({ title, headingColor, cards, column, setCards }: KanbanColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e: DragEvent, card: CardType) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;

      //UPDATE METADATA WHEN EDIT
      cardToTransfer = {
        ...cardToTransfer,
        column,
        uid: auth.currentUser?.uid || "",
        displayName: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
        updatedAt: new Date().toISOString(),
      };

      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`) as unknown as HTMLElement[]);
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="flex flex-col flex-[50%] landscape:w-full max-w-[50%] h-[50%] landscape:h-full overflow-x-hidden overflow-y-scroll">
      <div className="flex justify-between items-center mb-3 p-2 px-3 border-b-2">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-neutral-400 text-sm">{filteredCards.length}</span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full p-2  pr-12 transition-colors rounded ${active ? "bg-input/100" : "bg-black/0"}`}
      >
        <KanbanAddCard column={column} setCards={setCards} />

        {filteredCards.map((c) => {
          return <KanbanCard key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <KanbanDropIndicator beforeId={null} column={column} />
      </div>
    </div>
  );
};

type CardProps = CardType & {
  handleDragStart: Function;
};

const KanbanCard = ({ title, id, column, handleDragStart }: CardProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <KanbanDropIndicator beforeId={id} column={column} />
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="self-center">Truncated Text</DrawerTitle>
            <p className="self-center">{title}</p>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button className="w-full">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onClick={() => {
          console.log("clicked");
          setOpen(true);
        }}
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="flex flex-row gap-2 bg-card shadow-sm p-2 border rounded-lg text-card-foreground cursor-grab active:cursor-grabbing"
      >
        <div className="flex-shrink-0">
          <GripVertical color="#737373" size={24} />
        </div>
        <p className="flex-1 text-sm lg:text-lg truncate">{title}</p>
      </motion.div>
    </>
  );
};

type KanbanDropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const KanbanDropIndicator = ({ beforeId, column }: KanbanDropIndicatorProps) => {
  return (
    <div data-before={beforeId || "-1"} data-column={column} className="bg-primary opacity-0 my-0.5 w-full h-0.5" />
  );
};

const KanbanDelete = ({ setCards }: { setCards: Dispatch<SetStateAction<CardType[]>> }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid h-full place-content-center rounded border text-3xl ${
        active ? "border-red-500/50 bg-red-500/50" : " bg-background "
      }`}
    >
      {active ? <Trash2 className="animate-ping" /> : <Trash2 />}
    </div>
  );
};

type KanbanAddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<CardType[]>>;
};

const KanbanAddCard = ({ column, setCards }: KanbanAddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
      uid: auth.currentUser?.uid || "",
      displayName: auth.currentUser?.displayName || "",
      email: auth.currentUser?.email || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCards((pv) => [...pv, newCard]);

    setAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as any);
    } else if (e.key === "Escape") {
      setAdding(false);
    }
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <Textarea
            onKeyDown={handleKeyDown}
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new item..."
            className="rounded w-full"
          />
          <div className="flex justify-end gap-1.5 p-2">
            <Button variant="outline" onClick={() => setAdding(false)}>
              <XIcon />
              <span className="hidden lg:block">Close</span>
            </Button>
            <Button type="submit">
              <Plus color="white" />
              <span className="hidden lg:block">Add</span>
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 bg-background hover:bg-accent disabled:opacity-50 px-0.5 py-1.5 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full font-medium text-xs whitespace-nowrap transition-colors text-accent-foreground hover:text-accent-foreground disabled:pointer-events-none"
        >
          <Plus />
          <span>Add card</span>
        </motion.button>
      )}
    </>
  );
};
