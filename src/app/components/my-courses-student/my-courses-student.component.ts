import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InscripcionService } from '../../services/inscripcion.service'; // Importar el servicio de inscripciones
import { InscripcionResponseDto } from '../../models/inscripcion.model'; // Importar el modelo de la inscripción
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar para notificaciones

interface Course {
  id: number;
  name: string;
  date: string;
  time: string;
  studentsEnrolled: number;
  image: string;
}

@Component({
  selector: 'app-my-courses-student',
  templateUrl: './my-courses-student.component.html',
  styleUrls: ['./my-courses-student.component.css']
})
export class MyCoursesStudentComponent implements OnInit {
  courses: Course[] = []; // Cursos inscritos por el usuario
  userId: number = 1; // ID del usuario logueado (puedes reemplazarlo con el ID real del usuario)

  constructor(
    private router: Router,
    private inscripcionService: InscripcionService, // Inyectar el servicio de inscripciones
    private snackBar: MatSnackBar // Servicio para notificaciones
  ) {}

  ngOnInit(): void {
    // Llamar al método para cargar los cursos inscritos al iniciar el componente
    this.loadUserCourses();
  }

  // Método para cargar los cursos inscritos del usuario
  loadUserCourses(): void {
    this.inscripcionService.getInscripcionesByUsuarioId(this.userId).subscribe({
      next: (inscripciones) => {
        // Convertir las inscripciones en el formato de Course para mostrar en la vista
        this.courses = inscripciones.map((inscripcion) => ({
          id: inscripcion.cursoId,
          name: inscripcion.cursoNombre,
          date: inscripcion.fechaInscripcion,
          time: '10:00 AM', // Puedes agregar una propiedad de hora si está disponible
          studentsEnrolled: 0, // No tenemos la cantidad de inscritos en la inscripción, puedes ajustarlo según tu API
          image: 'assets/curso.png' // Agregar la imagen por defecto o usar inscripcion.cursoImagen si está disponible
        }));
      },
      error: (error) => {
        console.error('Error al cargar los cursos del usuario:', error);
        this.snackBar.open('Error al cargar los cursos. Por favor, inténtalo de nuevo más tarde.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  // Abrir un curso (puede redirigir a una vista de detalles del curso)
  openCourse(course: Course) {
    this.router.navigate(['/course-details', course.id]);
  }

  // Abrir el formulario de crear curso (si es necesario)
  openCourseForm(): void {
    this.router.navigate(['/create-course']);
  }
}
