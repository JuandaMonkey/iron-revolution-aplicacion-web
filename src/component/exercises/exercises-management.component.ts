import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, FormBuilder, ReactiveFormsModule ,Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

// models
import { Exercises } from '../../model/exercises/exercises.model';

// services
import { ExercisesService } from '../../service/exercises/exercises.service';

@Component({
  selector: 'app-exercises-management',
  standalone: true,
  imports: [CommonModule, 
            FormsModule, 
            ReactiveFormsModule,
            RouterModule, 
            MatIconModule
  ],
  templateUrl: './exercises-management.component.html',
  styleUrl: './exercises-management.component.css'
})
export class ExercisesManagementComponent implements OnInit {
  // list of exercises
  exercisesList: Exercises[] = [];
  selectedExerciseType: string = '';

  // status for new exercise
  isNewExercise: boolean = false;

  // modify exercise
  selectedExerciseId: string | null = null;

  // exercise form
  exerciseForm!: FormGroup;

  constructor (
    // services
    private exercisesService: ExercisesService,
    // form
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // form
    this.exerciseForm = this.fb.group({
      foto: [null],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      descripcion: ['', Validators.required],
      series: ['', [Validators.required, Validators.min(1)]],
      repeticiones: ['', [Validators.required, Validators.min(1)]]
    });

    // list of exercises
    this.loadExercises(this.selectedExerciseType);
  }

  onChange() {
    this.loadExercises(this.selectedExerciseType);
  }

  // get exercises
  loadExercises(exerciseType: string) {
    this.exercisesService.loadExercises(exerciseType).subscribe ({
      next: (data) => {
        this.exercisesList = data;
      },
      error: (err) => {
        alert('Error al obtener ejercicios.')
      }
    });
  }

  // open modal
  openNewExcercise() {
    this.isNewExercise = !this.isNewExercise;
    this.selectedExerciseId = null;
    this.exerciseForm.reset();
  }

  // save form information
  saveExercise() {
    if(this.exerciseForm.valid) {
      const formData = this.exerciseForm.value;

      if (this.selectedExerciseId) {
        this.modifyExercise(this.selectedExerciseId, formData);
      } else {
        this.insertExercise(formData);
      }
    }
  }

  // insert
  insertExercise(exerciseData: FormData) {
    this.exercisesService.insertExercise(exerciseData).subscribe ({
      next: (data) => {
        this.loadExercises(data.tipo);
        this.openNewExcercise();
      }, 
      error: (err) => {
        alert('Error al insertar ejercicio.');
      }
    });
  }

  // set exercises information
  modifyExerciseData(exercise: Exercises) {
    this.selectedExerciseId = exercise.ejercicio_Id;

    this.exerciseForm.patchValue({
      foto: exercise.foto,
      nombre: exercise.nombre,
      tipo: exercise.tipo,
      descripcion: exercise.descripcion,
      series: exercise.series,
      repeticiones: exercise.repeticiones
    });

    this.isNewExercise = true;
  }

  // modify
  modifyExercise(exerciseId: string, exerciseData: FormData) {
    this.exercisesService.modifyExercise(exerciseId, exerciseData).subscribe ({
      next: (data) => {
        this.loadExercises(data.tipo);
        this.openNewExcercise();
      },
      error: (err) => {
        alert('Error al modificar ejercicio.');
      }
    });
  }

  // delete
  deleteExercise(exerciseId: string) {
    this.exercisesService.deleteExercise(exerciseId).subscribe ({
      next: (data) => {
        this.loadExercises('');
      },
      error: (err) => {
        alert('Error al eliminar ejercicio.')
      }
    })
  }

  // clean filters
  cleanFilters() {
    this.selectedExerciseType = '';

    this.loadExercises(this.selectedExerciseType)
  }
}
