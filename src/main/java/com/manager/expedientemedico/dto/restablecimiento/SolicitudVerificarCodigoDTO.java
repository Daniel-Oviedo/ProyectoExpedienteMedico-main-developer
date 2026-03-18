package com.manager.expedientemedico.dto.restablecimiento;

public class SolicitudVerificarCodigoDTO {
    private String email;
    private String codigo;

    public SolicitudVerificarCodigoDTO() {}

    public SolicitudVerificarCodigoDTO(String email, String codigo) {
        this.email = email;
        this.codigo = codigo;
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
}
