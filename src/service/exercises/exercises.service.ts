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

  loadExercises(exercisesId: string): Observable<Exercises[]> {
    return this.http.get<Exercises[]>(`${this.url}/ListarEjercicios?exercisesId=${exercisesId}`)
  }
}
