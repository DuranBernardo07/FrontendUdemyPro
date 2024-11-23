import {Component, OnInit} from '@angular/core';
import { LeccionService } from '../../services/leccion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/course.service';
import { CursoDto } from '../../models/CursoDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeccionDto } from '../../models/LeccionDto';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-lection',
  templateUrl: './edit-lection.component.html',
  styleUrls: ['./edit-lection.component.css']
})
export class EditLectionComponent implements OnInit{
  selectedFile: File | null = null; // Archivo seleccionado
  fileError: string | null = null; // Error relacionado con el archivo
  previewUrl: string | ArrayBuffer | null = null; // URL de vista previa de la imagen
  leccionForm!: FormGroup;
  userId: number | null = null; // Almacenar el ID del usuario logueado
  courseId: number | null = null; // Almacenar el ID del curso actual
  course: CursoDto | null = null; // Almacenar los detalles del curso actual
  leccion: LeccionDto | null = null; // Almacenar los detalles de la lección actual

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private leccionService: LeccionService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private location: Location

  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('idUsuario');
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID del curso:', this.courseId);
    this.leccionForm = this.fb.group({
      titulo: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      duracionEstimada: ['', [Validators.required]],
      contenido: ['', [Validators.required]],
      cursoId: [this.courseId, [Validators.required]],
    });
    this.loadLeccion(this.courseId);
  }

  loadLeccion(idLeccion: number): void {
    this.leccionService.getLeccion(idLeccion).subscribe(
      (response) => {
        const leccion = response;
        this.leccionForm.patchValue({
          titulo: leccion.titulo,
          orden: leccion.orden,
          duracionEstimada: leccion.duracionEstimada,
          contenido: leccion.contenido,
        });
      });
  }

  createLeccion(): void {
    if (this.leccionForm.valid) {
      const leccionId = this.route.snapshot.paramMap.get('id');
      this.leccion = {
        idLeccion: leccionId ? Number(leccionId) : 0,
        titulo: this.leccionForm.get('titulo')?.value,
        orden: this.leccionForm.get('orden')?.value,
        duracionEstimada: this.leccionForm.get('duracionEstimada')?.value,
        contenido: this.leccionForm.get('contenido')?.value,
        cursoId: this.leccionForm.get('cursoId')?.value,
      }
      this.leccionService.updateLeccion(this.leccion).subscribe(
        (response) => {
          this.snackBar.open('Lección creada con éxito.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
        });
      // volver a la ruta anterior
      this.location.back();
    } else {
      this.snackBar.open('Por favor, complete el formulario correctamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }

  }

}
