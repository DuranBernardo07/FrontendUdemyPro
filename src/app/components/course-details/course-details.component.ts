import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/course.service';
import { CursoDto } from '../../models/CursoDto';
import { LeccionDto } from '../../models/LeccionDto';
import { InscripcionService } from '../../services/inscripcion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {LeccionService} from '../../services/leccion.service';
import {PaginadoDto} from "../../models/PaginadoDto";

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: CursoDto | null = null;
  isEnrolled: boolean = false;
  userId: number | null = null;
  // lista de leccion dto
  lecciones: LeccionDto[] = [];
  // paginado dto
  paginadoDto: PaginadoDto = {
    page: 1,
    size: 10,
    sortBy: 'idLeccion',
    sortDir: 'asc'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cursoService: CursoService,
    private inscripcionService: InscripcionService,
    private snackBar: MatSnackBar,
    private leccionService: LeccionService
  ) {}

  ngOnInit(): void {

    const storedUserId = localStorage.getItem('idUsuario');
    if (storedUserId) {
      this.userId = Number(storedUserId);
      console.log('ID del usuario logueado:', this.userId);
    } else {
      console.error('No se encontró el ID del usuario en localStorage.');
      this.snackBar.open('Por favor, inicie sesión nuevamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
      this.router.navigate(['/login']);
      return;
    }

    // Obtener el ID del curso de la URL
    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (courseId) {
      // Cargar los detalles del curso usando el servicio
      this.loadCourseDetails(courseId);
      this.loadLeccionesByCursoId(courseId, this.paginadoDto);
    }
  }

  // Método para cargar los detalles del curso desde la API
  loadCourseDetails(courseId: number): void {
    this.cursoService.getCursoById(courseId).subscribe({
      next: (data) => {
        this.course = data;
        console.log('Detalles del curso cargados:', this.course);
      },
      error: (error) => {
        console.error('Error al cargar los detalles del curso:', error);
      }
    });
  }

  loadLeccionesByCursoId(cursoId: number, paginadoDto: PaginadoDto): void {

    this.leccionService.getLeccionesByCurso(cursoId).subscribe({
      next: (data) => {
        this.lecciones = data.content;
        console.log('Lecciones del curso cargadas:', this.lecciones);
      },
      error: (error) => {
        console.error('Error al cargar las lecciones del curso:', error);
      }
    });

  }

  // Lógica para inscribirse en el curso
  enrollInCourse(): void {
    if (this.course && this.userId !== null) {
      const inscripcionDto = {
        usuarioId: this.userId,
        cursoId: this.course.idCurso
      };

      this.inscripcionService.createInscripcion(inscripcionDto).subscribe({
        next: (data) => {
          this.isEnrolled = true;
          this.snackBar.open('¡Te has inscrito en el curso exitosamente!', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
        },
        error: (error) => {
          console.error('Error al inscribirse en el curso:', error);
          this.snackBar.open('Hubo un problema al intentar inscribirse en el curso.', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar'],
          });
        }
      });
    } else {
      this.snackBar.open('No se pudo realizar la inscripción. Inténtalo de nuevo más tarde.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });
    }
  }

  viewSubject(id: number): void {
    this.router.navigate(['/course-lections/', id]);
  }

  addLesson(): void {
    this.router.navigate(['/course-lections/', this.route.snapshot.paramMap.get('id')]);
  }

  // Lógica para volver a la lista de cursos
  goBack(): void {
    this.router.navigate(['/course-categories']);
  }
}
