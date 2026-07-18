import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Input } from "../components/Input";
import { CardSkeleton, TableSkeleton } from "../components/Skeleton";
import { useAuth } from "../context/AuthContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  Calendar,
  AlertTriangle,
  ClipboardList,
  CheckSquare,
  Clock,
  Inbox,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { TaskService } from "../services/task.service";
import type { Task } from "../services/task.service";
import toast from "react-hot-toast";

export const Tasks: React.FC = () => {
  const { user } = useAuth();
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
      console.log(error)
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

  // Statistics calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;
  const overdueTasks = tasks.filter((t) => {
    const isPastDue = new Date(t.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
    return isPastDue && t.status !== "Completed";
  }).length;

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
      {/* 3. Dashboard Header (Title Left, Add Button Right) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-left">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight m-0">Dashboard</h1>
          <p className="text-sm text-slate-500 m-0">
            Welcome back, <span className="text-slate-800 font-semibold">{user?.name || "User"}</span>. Here is your workspace summary.
          </p>
        </div>
        <Button onClick={openCreateModal} className="sm:w-auto shrink-0 self-start">
          <Plus className="w-4.5 h-4.5" />
          <span>Add Task</span>
        </Button>
      </div>

      {/* 4. Statistics Grid (4 Cards, Hover Animations) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {/* Total tasks */}
          <Card animateHover className="relative overflow-hidden group border border-slate-200">
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-bl-full group-hover:bg-blue-500/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Tasks</span>
                <span className="text-3xl font-bold text-slate-900 mt-1 leading-none">{totalTasks}</span>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">All registered project tasks</span>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 shadow-sm">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Completed tasks */}
          <Card animateHover className="relative overflow-hidden group border border-slate-200">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Completed</span>
                <span className="text-3xl font-bold text-slate-900 mt-1 leading-none">{completedTasks}</span>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">
                  {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% completion rate` : "No tasks added"}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm">
                <CheckSquare className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Pending tasks */}
          <Card animateHover className="relative overflow-hidden group border border-slate-200">
            <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-bl-full group-hover:bg-amber-500/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending</span>
                <span className="text-3xl font-bold text-slate-900 mt-1 leading-none">{pendingTasks}</span>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">Require execution priority</span>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </Card>

          {/* Overdue tasks */}
          <Card animateHover className="relative overflow-hidden group border border-slate-200">
            <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/5 rounded-bl-full group-hover:bg-red-500/10 transition-colors" />
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Overdue</span>
                <span className="text-3xl font-bold text-slate-900 mt-1 leading-none">{overdueTasks}</span>
                <span className="text-[11px] text-slate-400 mt-2 font-medium">Past designated deadline</span>
              </div>
              <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-sm">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 5. Toolbar Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full shadow-sm">
        {/* Left: Search input */}
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

        {/* Right: Filters & Sort Dropdowns */}
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

          {/* Add Task Quick Button */}
          <button
            onClick={openCreateModal}
            className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 6. Tasks Table & Responsive Mobile Cards */}
      {loading ? (
        <TableSkeleton />
      ) : filteredTasks.length === 0 ? (
        /* 7. Empty State Layout */
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center gap-4 w-full shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
            <Inbox className="w-8 h-8" />
          </div>
          <div className="max-w-xs">
            <h3 className="text-lg font-bold text-slate-900 m-0">No tasks found</h3>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              Create your first task to begin tracking your team deliverables and project tasks.
            </p>
          </div>
          <Button onClick={openCreateModal} className="w-auto mt-2">
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-lg w-full max-h-[600px] overflow-y-auto">
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        task.priority === "High" ? "bg-red-50 text-red-700 border-red-200" :
                        task.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                        task.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" :
                        task.status === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-blue-50 text-blue-700 border-blue-200"
                      }`}>
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

          {/* 8. Mobile Card-List View */}
          <div className="grid grid-cols-1 gap-4 md:hidden w-full">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="flex flex-col gap-4 border border-slate-200 shadow-lg p-5">
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-slate-800 leading-snug m-0 text-base">{task.title}</h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer border-none bg-transparent"
                    >
                      <Edit2 className="w-4.5 h-4.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer border-none bg-transparent"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    task.priority === "High" ? "bg-red-50 text-red-700 border-red-200" :
                    task.priority === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {task.priority}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    task.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" :
                    task.status === "In Progress" ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-blue-50 text-blue-700 border-blue-200"
                  }`}>
                    {task.status}
                  </span>

                  <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>

                {task.status !== "Completed" && (
                  <Button variant="success" onClick={() => handleCompleteTask(task.id)} className="w-full h-11">
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Complete Task</span>
                  </Button>
                )}
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="flex flex-col gap-5">
          <Input
            id="taskTitle"
            label="Task Title"
            type="text"
            placeholder="e.g. Update onboarding forms API"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-semibold text-slate-700">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-4 outline-none text-slate-900 text-sm font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-4 outline-none text-slate-900 text-sm font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <Input
            id="taskDueDate"
            label="Due Date"
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
          />

          <div className="flex items-center gap-3 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Task">
        <form onSubmit={handleEditTask} className="flex flex-col gap-5">
          <Input
            id="editTaskTitle"
            label="Task Title"
            type="text"
            placeholder="e.g. Update onboarding forms API"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-semibold text-slate-700">Priority</label>
              <select
                value={formPriority}
                onChange={(e) => setFormPriority(e.target.value as any)}
                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-4 outline-none text-slate-900 text-sm font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as any)}
                className="w-full h-[52px] bg-white border border-slate-200 rounded-xl px-4 outline-none text-slate-900 text-sm font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <Input
            id="editTaskDueDate"
            label="Due Date"
            type="date"
            value={formDueDate}
            onChange={(e) => setFormDueDate(e.target.value)}
          />

          <div className="flex items-center gap-3 mt-2">
            <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};
