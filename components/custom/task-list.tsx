'use client'

import { useMemo, useState } from 'react'
import { Task } from '@/lib/types'
import { saveTask, updateTask, deleteTask } from '@/lib/storage'
import { CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  onTasksChanged: () => void
}

export function TaskList({ tasks, onTasksChanged }: TaskListProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('')

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const todayTasks = useMemo(
    () => (tasks || []).filter((t: any) => t?.date === today),
    [tasks, today]
  )
  const completedCount = useMemo(
    () => todayTasks.filter((t: any) => !!t?.completed).length,
    [todayTasks]
  )

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return

    // ✅ IMPORTANTE: não tipar como "Task =" aqui
    // porque seu Task no types.ts provavelmente exige mais campos obrigatórios.
    const task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      date: today,
    } as Task

    saveTask(task)
    setNewTaskTitle('')
    onTasksChanged()
  }

  const handleToggleTask = (id: string, completed: boolean) => {
    updateTask(id, { completed: !completed })
    onTasksChanged()
  }

  const handleDeleteTask = (id: string) => {
    deleteTask(id)
    onTasksChanged()
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Tarefas de hoje
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {completedCount} de {todayTasks.length} concluídas
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleAddTask} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-colors"
            aria-label="Adicionar tarefa"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Lista */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {todayTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Adicione sua primeira tarefa do dia.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Use o campo acima para organizar suas atividades.
            </p>
          </div>
        ) : (
          todayTasks.map((task: any) => (
            <div
              key={task.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
            >
              <button
                onClick={() => handleToggleTask(task.id, task.completed)}
                className="flex-shrink-0"
                aria-label="Marcar tarefa"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                )}
              </button>

              <span
                className={`flex-1 ${
                  task.completed
                    ? 'line-through text-gray-500 dark:text-gray-400'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {task.title}
              </span>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                aria-label="Excluir tarefa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
