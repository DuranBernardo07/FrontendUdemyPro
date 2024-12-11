import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../services/course.service';
import { CursoDto } from '../../models/CursoDto';
import { LeccionDto } from '../../models/LeccionDto';
import { InscripcionService } from '../../services/inscripcion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LeccionService } from '../../services/leccion.service';
import { PaginadoDto } from '../../models/PaginadoDto';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {
  course: CursoDto | null = null;
  isEnrolled: boolean = false;
  userId: number | null = null;
  lecciones: LeccionDto[] = [];
  paginadoDto: PaginadoDto = {
    page: 0,
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

    const courseId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID del curso:', courseId);
    if (courseId) {
      this.loadCourseDetails(courseId);
      this.loadLeccionesByCursoId(courseId, this.paginadoDto);
    }
  }

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
    this.leccionService.getLeccionesByCurso(cursoId, paginadoDto).subscribe({
      next: (data) => {
        console.log('Data:', data);
        this.lecciones = data.content;
        console.log('Lecciones del curso cargadas:', this.lecciones);
      },
      error: (error) => {
        console.error('Error al cargar las lecciones del curso:', error);
      }
    });
  }

  enrollInCourse(): void {
    if (this.course && this.userId !== null) {
      const inscripcionDto = {
        usuarioId: this.userId,
        cursoId: this.course.idCurso
      };

      this.inscripcionService.createInscripcion(inscripcionDto).subscribe({
        next: () => {
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
          this.snackBar.open('Ya se encuentra inscrito en este curso.', 'Cerrar', {
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
    const courseId = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/create-lection/', courseId]);
  }

  goBack(): void {
    this.router.navigate(['/course-categories']);
  }

  editLesson(id: number): void {
    console.log('ID de la lección:', id);
    this.router.navigate(['/update-lection/', id]);
  }

  deleteLesson(id: number): void {
    this.leccionService.deleteLeccion(id).subscribe({
      next: () => {
        this.snackBar.open('Lección eliminada con éxito', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar'],
        });
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error al eliminar la lección:', error);
        this.snackBar.open('Error al eliminar la lección.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar'],
        });
      }
    });
  }
}
