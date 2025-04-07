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

  // status for new exercises
  isNewExercises: boolean = false;

  // modify exercises
  selectedExercisesId: string = '';

  // exercises form
  exercisesForm!: FormGroup;

  constructor (
    // services
    private exercisesService: ExercisesService,
    // form
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // form
    this.exercisesForm = this.fb.group({
      foto: [null],
      nombre: ['', Validators.required],
      tipo: ['', Validators.required],
      descripcion: ['', Validators.required],
      series: ['', Validators.required],
      repeticiones: ['', Validators.required]
    });

    // list of exercises
    this.loadExercises(this.selectedExercisesId);
  }

  onChange() {
    this.loadExercises(this.selectedExercisesId)
  }

  // get exercises
  loadExercises(exercisesId: string) {
    this.exercisesService.loadExercises(exercisesId).subscribe ({
      next: (data) => {
        this.exercisesList = data;
      },
      error: (err) => {
        alert('Error al obtener ejercicios.')
      }
    })
  }

  // clean filters
  cleanFilters() {
    this.selectedExercisesId = '';

    this.loadExercises(this.selectedExercisesId)
  }
}
