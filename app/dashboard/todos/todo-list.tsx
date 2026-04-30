"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTodo, updateTodo, deleteTodo } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus, CheckSquare2 } from "lucide-react";

export type TodoItem = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type TodoListProps = {
  initialTodos: TodoItem[];
};

export function TodoList({ initialTodos }: TodoListProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [isAdding, setIsAdding] = useState(false);

  
  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const title = formData.get("title")?.toString().trim();
    if (!title) {
      toast.error("Title is required.");
      return;
    }
    setIsAdding(true);
    try {
      const result = await createTodo(formData);
      if (result.success) {
        toast.success("Todo added.");
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleComplete = async (todo: TodoItem) => {
    try {
      const result = await updateTodo(todo.id, { completed: !todo.completed });
      if (result.success) {
        setTodos((prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
        );
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to update.");
    }
  };

  const handleEdit = async (todoId: string, title: string, description: string | null) => {
    if (!title.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    setEditingId(todoId);
    try {
      const result = await updateTodo(todoId, {
        title: title.trim(),
        description: description?.trim() || null,
      });
      if (result.success) {
        toast.success("Todo updated.");
        setEditingId(null);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to update.");
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (todoId: string) => {
    setDeletingId(todoId);
    try {
      const result = await deleteTodo(todoId);
      if (result.success) {
        setTodos((prev) => prev.filter((t) => t.id !== todoId));
        toast.success("Todo deleted.");
        setDeletingId(null);
        router.refresh();
      } else {
        toast.error(result.error);
        setDeletingId(null);
      }
    } catch {
      toast.error("Failed to delete.");
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-50 mb-2">My Todos</h1>
        <p className="text-slate-400">Create, edit, and organize your tasks efficiently</p>
      </div>

      {/* Add Todo Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <h3 className="font-semibold text-slate-50 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" />
            Add New Task
          </h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-slate-300 mb-2 block">
                  Task Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="What needs to be done?"
                  required
                  maxLength={500}
                  disabled={isAdding}
                  className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-500 focus:border-emerald-500"
                />
              </div>
              <div className="md:col-span-1 flex flex-col justify-end">
                <Button
                  type="submit"
                  disabled={isAdding}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white w-full"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-slate-300 mb-2 block">
                Description (optional)
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="Add task details..."
                maxLength={1000}
                disabled={isAdding}
                className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-500 focus:border-emerald-500"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Todo List */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <h3 className="font-semibold text-slate-50">Tasks ({todos.length})</h3>
        </CardHeader>
        <CardContent className="p-0">
          {todos.length === 0 ? (
            <div className="py-16 text-center">
              <CheckSquare2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No tasks yet</p>
              <p className="text-slate-500 text-sm mt-1">Create your first task to get started</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-700">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="p-4 hover:bg-slate-700/50 transition group flex items-center gap-4"
                >
                  <Checkbox
                    id={`check-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    className="shrink-0 h-5 w-5 rounded border-slate-600 bg-slate-700 text-emerald-500"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`check-${todo.id}`}
                      className={`cursor-pointer font-medium block ${
                        todo.completed
                          ? "text-slate-500 line-through"
                          : "text-slate-50"
                      }`}
                    >
                      {todo.title}
                    </label>
                    {todo.description && (
                      <p
                        className={`mt-1 text-sm line-clamp-2 ${
                          todo.completed ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <EditTodoDialog
                      todo={todo}
                      onSave={handleEdit}
                      isEditing={editingId === todo.id}
                      onOpenChange={(open) => !open && setEditingId(null)}
                    />
                    <AlertDialog
                      open={deletingId === todo.id}
                      onOpenChange={(open) => !open && setDeletingId(null)}
                    >
                      <AlertDialogContent className="bg-slate-800 border-slate-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-50">Delete task?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-400">
                            Are you sure you want to delete &quot;{todo.title}&quot;? This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-slate-700 border-slate-600 text-slate-50 hover:bg-slate-600">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(todo.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeletingId(todo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialog>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EditTodoDialog({
  todo,
  onSave,
  isEditing,
  onOpenChange,
}: {
  todo: TodoItem;
  onSave: (id: string, title: string, description: string | null) => Promise<void>;
  isEditing: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(todo.id, title, description || null).then(() => setOpen(false));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        onOpenChange(o);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0" disabled={isEditing}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-slate-50">Edit Task</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update the task details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-slate-300">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              maxLength={500}
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-slate-300">
              Description (optional)
            </Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              maxLength={1000}
              className="bg-slate-700 border-slate-600 text-slate-50 placeholder:text-slate-500 focus:border-emerald-500"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}