import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { TableSkeleton } from "../components/Skeleton";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Calendar,
  Inbox,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { TaskService } from "../services/task.service";
import type { Task } from "../services/task.service";
import { useSocket } from "../hooks/useSocket";
import toast from "react-hot-toast";

export const Tasks: React.FC = () => {
  const { socket } = useSocket();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, Filters & Sort State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("due-asc");

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  // Form Fields State
  const [formTitle, setFormTitle] = useState("");
  const [formPriority, setFormPriority] = useState<"Low" | "Medium" | "High">("Medium");
  const [formStatus, setFormStatus] = useState<"Todo" | "In Progress" | "Completed">("Todo");
  const [formDueDate, setFormDueDate] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await TaskService.getTasks();
      if (response.success && response.data) {
        setTasks(response.data);
      } else {
        toast.error(response.message || "Failed to load tasks");
      }
    } catch (error: any) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Real-time Socket.IO synchronization listeners
  useEffect(() => {
    if (!socket) return;

    const handleTaskCreated = (newTask: Task) => {
      setTasks((prevTasks) => {
        if (prevTasks.some((t) => t.id === newTask.id)) return prevTasks;
        return [newTask, ...prevTasks];
      });
    };

    const handleTaskUpdated = (updatedTask: Task) => {
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    };

    const handleTaskDeleted = (data: { id: string }) => {
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== data.id));
    };

    socket.on("task-created", handleTaskCreated);
    socket.on("task-updated", handleTaskUpdated);
    socket.on("task-deleted", handleTaskDeleted);

    return () => {
      socket.off("task-created", handleTaskCreated);
      socket.off("task-updated", handleTaskUpdated);
      socket.off("task-deleted", handleTaskDeleted);
    };
  }, [socket]);

  const openCreateModal = () => {
    setFormTitle("");
    setFormPriority("Medium");
    setFormStatus("Todo");
    setFormDueDate("");
    setIsCreateOpen(true);
  };

  const openEditModal = (task: Task) => {
    setCurrentTask(task);
    setFormTitle(task.title);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormDueDate(task.dueDate);
    setIsEditOpen(true);
  };

  // Create handler
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (!formDueDate) {
      toast.error("Due date is required");
      return;
    }

    try {
      const response = await TaskService.createTask({
        title: formTitle.trim(),
        priority: formPriority,
        status: formStatus,
        dueDate: formDueDate,
        description: "",
      } as any);

      if (response.success) {
        setIsCreateOpen(false);
        toast.success("Task created successfully!");
        loadTasks();
      } else {
        toast.error(response.message || "Failed to create task");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to save task to server");
    }
  };

  // Edit handler
  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask) return;
    if (!formTitle.trim()) {
      toast.error("Task title is required");
      return;
    }
    if (!formDueDate) {
      toast.error("Due date is required");
      return;
    }

    try {
      const response = await TaskService.updateTask(currentTask.id, {
        title: formTitle.trim(),
        priority: formPriority,
        status: formStatus,
        dueDate: formDueDate,
      });

      if (response.success) {
        setIsEditOpen(false);
        toast.success("Task updated successfully!");
        loadTasks();
      } else {
        toast.error(response.message || "Failed to update task");
      }
    } catch (error: any) {
      toast.error("Failed to save changes to server");
    }
  };

  // Delete handler
  const handleDeleteTask = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const response = await TaskService.deleteTask(id);
      if (response.success) {
        toast.success("Task deleted successfully");
        loadTasks();
      } else {
        toast.error(response.message || "Failed to delete task");
      }
    } catch (error: any) {
      toast.error("Failed to delete task on server");
    }
  };

  // Complete handler
  const handleCompleteTask = async (id: string) => {
    try {
      const response = await TaskService.updateTask(id, { status: "Completed" });
      if (response.success) {
        toast.success("Task marked as completed! 🎉");
        loadTasks();
      } else {
        toast.error(response.message || "Failed to complete task");
      }
    } catch (error: any) {
      toast.error("Failed to complete task on server");
    }
  };

  // Filter & Sort Logic
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "due-asc") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "due-desc") {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <DashboardLayout>
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-left">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight m-0">Tasks</h1>
          <p className="text-sm text-slate-500 m-0">Manage all your tasks.</p>
        </div>
        <Button onClick={openCreateModal} className="sm:w-auto shrink-0 self-start">
          <Plus className="w-4.5 h-4.5" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* 2. Toolbar Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full shadow-sm">
        {/* Search input */}
        <div className="flex-grow flex items-center relative max-w-md w-full">
          <Search className="absolute left-3.5 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left"
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl bg-slate-50 p-1">
            <Filter className="h-3.5 w-3.5 text-slate-400 ml-2 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold outline-none py-1.5 px-2 text-slate-700 cursor-pointer border-none"
            >
              <option value="All">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl bg-slate-50 p-1">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold outline-none py-1.5 px-2 text-slate-700 cursor-pointer border-none"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1 border border-slate-200 rounded-xl bg-slate-50 p-1">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 ml-2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-semibold outline-none py-1.5 px-2 text-slate-700 cursor-pointer border-none"
            >
              <option value="due-asc">Due Date (Asc)</option>
              <option value="due-desc">Due Date (Desc)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Task Table & Responsive View */}
      {loading ? (
        <TableSkeleton />
      ) : filteredTasks.length === 0 ? (
        /* Empty State Layout */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center gap-4 w-full shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
            <Inbox className="w-8 h-8 text-slate-400" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-lg font-bold text-slate-900 m-0">No Tasks Yet</h3>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              Create your first task to start organizing your work efficiently.
            </p>
          </div>
          <Button onClick={openCreateModal} className="w-auto mt-2">
            <Plus className="w-4 h-4" />
            <span>Create First Task</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg w-full max-h-[650px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="sticky top-0 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider z-10">
                  <th className="py-4.5 px-6">Title</th>
                  <th className="py-4.5 px-6">Priority</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6">Due Date</th>
                  <th className="py-4.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="py-4.5 px-6 font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                      {task.title}
                    </td>
                    <td className="py-4.5 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          task.priority === "High"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : task.priority === "Medium"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          task.status === "Completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : task.status === "In Progress"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 text-slate-500 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{task.dueDate}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2.5">
                        {task.status !== "Completed" && (
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            title="Complete Task"
                            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                          >
                            <CheckCircle className="w-4.5 h-4.5" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(task)}
                          title="Edit Task"
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          title="Delete Task"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-4 md:hidden w-full">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-base font-bold text-slate-900 m-0 leading-snug">
                    {task.title}
                  </h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${
                      task.priority === "High"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : task.priority === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      task.status === "Completed"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : task.status === "In Progress"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {task.status}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                  {task.status !== "Completed" && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(task)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-4 text-left">
          <Input
            label="Task Title"
            type="text"
            placeholder="e.g. Design Landing Page Wireframes"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Priority</label>
            <select
              value={formPriority}
              onChange={(e) => setFormPriority(e.target.value as any)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Status</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Task">
        <form onSubmit={handleEditTask} className="flex flex-col gap-4 text-left">
          <Input
            label="Task Title"
            type="text"
            placeholder="e.g. Design Landing Page Wireframes"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Priority</label>
            <select
              value={formPriority}
              onChange={(e) => setFormPriority(e.target.value as any)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold text-slate-700">Status</label>
            <select
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value as any)}
              className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all text-left"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
