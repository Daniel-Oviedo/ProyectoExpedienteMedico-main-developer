package com.manager.expedientemedico.dto.restablecimiento;

public class SolicitudRestablecerContrasenaDTO {
    private String email;
    private String codigo;
    private String nuevaPassword;

    public SolicitudRestablecerContrasenaDTO() {}

    public SolicitudRestablecerContrasenaDTO(String email, String codigo, String nuevaPassword) {
        this.email = email;
        this.codigo = codigo;
        this.nuevaPassword = nuevaPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNuevaPassword() {
        return nuevaPassword;
    }

    public void setNuevaPassword(String nuevaPassword) {
        this.nuevaPassword = nuevaPassword;
    }
}
