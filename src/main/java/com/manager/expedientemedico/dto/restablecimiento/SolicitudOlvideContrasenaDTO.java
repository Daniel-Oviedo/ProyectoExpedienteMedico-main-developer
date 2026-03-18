package com.manager.expedientemedico.dto.restablecimiento;

public class SolicitudOlvideContrasenaDTO {
    private String email;

    public SolicitudOlvideContrasenaDTO() {}

    public SolicitudOlvideContrasenaDTO(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
