import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeccionDto } from '../../models/LeccionDto';
import {LeccionService} from "../../services/leccion.service";
import {PaginadoDto} from "../../models/PaginadoDto";
import {MatSnackBar} from "@angular/material/snack-bar";
import {TemaDto} from "../../models/TemaDto";
import {TemaService} from "../../services/tema.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent {
  selectedFile: File | null = null; // Archivo seleccionado
  fileError: string | null = null; // Error relacionado con el archivo
  previewUrl: string | ArrayBuffer | null = null; // URL de vista previa de la imagen
  subjectForm!: FormGroup;
  userId: number | null = null; // Almacenar el ID del usuario logueado
  leccionId: number | null = null; // Almacenar el ID de la lección actual
  fileForSending: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private leccionService: LeccionService,
    private temaService: TemaService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private location: Location
  ) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('idUsuario');
    this.leccionId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID de la leccion:', this.leccionId);
    this.subjectForm = this.fb.group({
      idTema: [0],
      titulo: ['', [Validators.required]],
      orden: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      recursoMultimedia: ['', [Validators.required]],
      leccionId: [this.leccionId,Validators.required],
    });

    this.loadSubject(this.leccionId);
  }

  createSubject(): void {
    const formData: FormData = new FormData();
    this.subjectForm.value.leccionId = this.leccionId;
    console.log('es valido el form? :',this.subjectForm.valid);
    console.log('data:',this.subjectForm.value);
    formData.append('data',JSON.stringify(this.subjectForm.value));
    formData.append('file',this.selectedFile as File);
    this.temaService.updateTema(formData).subscribe((data: any) => {
    });
    this.location.back();
  }

  loadSubject(idSubject: number): void {
    this.temaService.getTemaById(idSubject).subscribe(
      (response) => {
        const subject = response;
        console.log('Tema:', subject);
        this.subjectForm.patchValue({
          idTema: idSubject,
          leccionId: subject.idLeccion,
          titulo: subject.titulo,
          orden: subject.orden,
          descripcion: subject.descripcion
        });
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (file) {
      this.selectedFile = file;
      this.fileError = null;

      // Mostrar vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      console.log('Vista previa de la imagen lista');
    }
  }
}
