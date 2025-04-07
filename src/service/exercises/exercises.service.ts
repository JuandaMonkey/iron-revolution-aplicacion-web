import { Injectable } from '@angular/core';

// service api
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// models
import { Exercises } from '../../model/exercises/exercises.model';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {
  // url
  private url='https://localhost:44363/api/Exercises';
  
  constructor(private http: HttpClient) { }

  // get 'Listar-Ejercicios'
  loadExercises(exerciseId: string): Observable<Exercises[]> {
    return this.http.get<Exercises[]>(`${this.url}/ListarEjercicios?exercisesId=${exerciseId}`)
  }

  // post 'Insertar-Ejercicio'
  insertExercise(formData: FormData): Observable<Exercises> {
    return this.http.post<Exercises>(`${this.url}/InsertarEjercicio`, formData)
  }

  // put 'Modificar-Ejercicio'
  modifyExercise(exerciseId: string, formData: FormData): Observable<Exercises> {
    return this.http.put<Exercises>(`${this.url}/ModificarEjercicio?exerciseId=${exerciseId}`, formData)
  }

  // delete 'Elimianr-Ejercicio'
  deleteExercise(exerciseId: string): Observable<Exercises> {
    return this.http.delete<Exercises>(`${this.url}/EliminarEjercicio?exerciseId=${exerciseId}`)
  }
}
