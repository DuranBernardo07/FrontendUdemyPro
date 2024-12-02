import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';  // Ruta correcta al servicio
import { Router } from '@angular/router';  // Para redirigir al login

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent {
  isTutorSelected: boolean = true;

  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  gmail: string = '';
  nombre: string = '';
  primerApellido: string = '';
  segundoApellido: string = '';
  telefono: string = '';
  ci: string = '';
  errorMessage: string = '';
  successMessage: string = ''; // Nueva variable para el mensaje de éxito

  constructor(private authService: AuthService, private router: Router) {}

  selectOption(option: string) {
    this.isTutorSelected = option === 'tutor';
  }

  validateNumericInput(event: KeyboardEvent): void {
    const char = String.fromCharCode(event.keyCode);
    if (!/^\d+$/.test(char)) {
      event.preventDefault();
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onRegister() {
    // Limpiar mensajes previos
    this.errorMessage = '';
    this.successMessage = '';

    // Validación de campos vacíos
    if (!this.username || !this.password || !this.confirmPassword || !this.gmail || !this.nombre || !this.primerApellido || !this.telefono || !this.ci) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    // Validación de longitud mínima de contraseña
    if (this.password.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    // Validación de coincidencia de contraseñas
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden. Por favor, intenta de nuevo.';
      return;
    }

    // Validación de formato de correo electrónico
    if (!this.isValidEmail(this.gmail)) {
      this.errorMessage = 'El formato del correo no es válido.';
      return;
    }

    const usuarioDto = {
      username: this.username,
      password: this.password,
      gmail: this.gmail,
      status: true,
      id_rol: this.isTutorSelected ? 3 : 2
    };

    const personaDto = {
      nombre: this.nombre,
      primer_apellido: this.primerApellido,
      segundo_apellido: this.segundoApellido,
      telefono: this.telefono,
      ci: this.ci
    };

    // Llamada al servicio de registro
    this.authService.registerUser(usuarioDto, personaDto).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.successMessage = 'Usuario registrado con éxito.';
        // Opcional: Redirigir después de 3 segundos
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        this.errorMessage = 'Error al registrar. Por favor, inténtalo nuevamente.';
      }
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
