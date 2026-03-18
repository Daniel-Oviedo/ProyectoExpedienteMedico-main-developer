package com.manager.expedientemedico.dto.restablecimiento;

public class RespuestaRestablecimientoDTO {
    private boolean valido;
    private String mensaje;
    private String token;

    public RespuestaRestablecimientoDTO() {}

    public RespuestaRestablecimientoDTO(boolean valido, String mensaje) {
        this.valido = valido;
        this.mensaje = mensaje;
    }

    public RespuestaRestablecimientoDTO(boolean valido, String mensaje, String token) {
        this.valido = valido;
        this.mensaje = mensaje;
        this.token = token;
    }

    public boolean isValido() {
        return valido;
    }

    public void setValido(boolean valido) {
        this.valido = valido;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
