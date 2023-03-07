<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $limit = $request->has('limit') ? $request->limit : 1;
        $tasks = Task::orderByDesc('created_at')->get();
        $tasks = [
            'tasks' => $tasks,
            'response' => 200
        ];
        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'libelle' => 'required|string|min:1',
        ]);

        // On cree l'nstance de la tache puis on l'enregistre vite fait
        $task = new Task();
        $task->libelle = $request->libelle;
        $task->state = "a faire";
        $task->deadline = $request->deadline;

        $task->save();
        $task = [
            'task' => $task,
            'success' => true
        ];

        // puis on retoune le resultat pour la vue
        return response()->json($task);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $task)
    {
        // Validation
        $request->validate([
            'libelle' => 'required|string|min:1',
            'task' => 'exists:tasks,id'
        ]);

        // Récupération
        $task = Task::firstWhere(["id" => $request->id]);

        // Mise à jour
        $task->update([
            "libelle" => $request->libelle,
            "state" => $request->state,
            "deadline" => $request->deadline
        ]);

        $task = [
            'task' => $task,
            'success' => true
        ];
        // puis on sors
        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy($task)
    {
        $task = Task::find($task);
        $task->forceDelete();
        return response()->json(['success' => true]);
    }
}
