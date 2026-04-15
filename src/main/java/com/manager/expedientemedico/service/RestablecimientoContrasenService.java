package com.manager.expedientemedico.service;

import com.manager.expedientemedico.dto.restablecimiento.*;
import com.manager.expedientemedico.exception.OperacionNoPermitidaException;
import com.manager.expedientemedico.model.TokenRestablecimientoContrasena;
import com.manager.expedientemedico.model.Usuario;
import com.manager.expedientemedico.repository.TokenRestablecimientoRepository;
import com.manager.expedientemedico.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RestablecimientoContrasenService {

    @Autowired
    private TokenRestablecimientoRepository tokenRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int MINUTOS_EXPIRACION = 15;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    @Transactional
    public RespuestaRestablecimientoDTO olvidarContrasena(SolicitudOlvideContrasenaDTO dto) {
        // Buscar usuario por email
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(dto.getEmail());
        
        if (!usuarioOpt.isPresent()) {
            // No revelar si el email existe o no (por seguridad)
            return new RespuestaRestablecimientoDTO(true, "Si el correo existe, recibirás un código");
        }

        Usuario usuario = usuarioOpt.get();

        // Generar código aleatorio seguro (6 dígitos)
        String codigo = String.format("%06d", SECURE_RANDOM.nextInt(1000000));

        // Fijar expiración en 15 minutos
        LocalDateTime expiracion = LocalDateTime.now().plusMinutes(MINUTOS_EXPIRACION);

        // Crear token
        TokenRestablecimientoContrasena token = new TokenRestablecimientoContrasena(codigo, usuario, dto.getEmail(), expiracion);
        tokenRepository.save(token);

        // Intentar enviar email, pero no fallar si no se puede
        try {
            enviarEmailCodigo(usuario, codigo);
        } catch (Exception e) {
            System.err.println("No se pudo enviar email, pero el código fue generado: " + codigo);
        }

        // Devolver el código en la respuesta para mostrar en pantalla (uso temporal)
        return new RespuestaRestablecimientoDTO(true, "Código enviado a tu correo. Usa el código a continuación:", codigo);
    }

    @Transactional
    public RespuestaRestablecimientoDTO verificarCodigo(SolicitudVerificarCodigoDTO dto) {
        // Buscar token por código
        Optional<TokenRestablecimientoContrasena> tokenOpt = tokenRepository.findByToken(dto.getCodigo());

        if (!tokenOpt.isPresent()) {
            throw new OperacionNoPermitidaException("Código inválido");
        }

        TokenRestablecimientoContrasena token = tokenOpt.get();

        // Validar que no haya expirado
        if (!token.esValido()) {
            throw new OperacionNoPermitidaException("Código expirado o ya fue utilizado");
        }

        // Validar que el email coincida
        if (!token.getEmail().equals(dto.getEmail())) {
            throw new OperacionNoPermitidaException("El correo no coincide con el código");
        }

        // Generar un token temporal para el reset
        String resetToken = UUID.randomUUID().toString();

        return new RespuestaRestablecimientoDTO(true, "Código válido", resetToken);
    }

    @Transactional
    public RespuestaRestablecimientoDTO restablecerContrasena(SolicitudRestablecerContrasenaDTO dto) {
        // Buscar token por código
        Optional<TokenRestablecimientoContrasena> tokenOpt = tokenRepository.findByToken(dto.getCodigo());

        if (!tokenOpt.isPresent()) {
            throw new OperacionNoPermitidaException("Código inválido");
        }

        TokenRestablecimientoContrasena token = tokenOpt.get();

        // Validar que no haya expirado
        if (!token.esValido()) {
            throw new OperacionNoPermitidaException("Código expirado o ya fue utilizado");
        }

        // Validar que el email coincida
        if (!token.getEmail().equals(dto.getEmail())) {
            throw new OperacionNoPermitidaException("El correo no coincide con el código");
        }

        // Obtener usuario
        Usuario usuario = token.getUsuario();

        // Actualizar contraseña
        usuario.setPassword(passwordEncoder.encode(dto.getNuevaPassword()));
        usuarioRepository.save(usuario);

        // Marcar token como usado
        token.setUsado(true);
        tokenRepository.save(token);

        return new RespuestaRestablecimientoDTO(true, "Contraseña actualizada correctamente");
    }

    // Método auxiliar para enviar email
    private void enviarEmailCodigo(Usuario usuario, String codigo) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setTo(usuario.getEmail());
            mensaje.setSubject("Código de recuperación de contraseña - Expediente Médico");
            mensaje.setText("Hola " + usuario.getNombre() + ",\n\n" +
                    "Tu código de recuperación es: " + codigo + "\n" +
                    "Este código expira en " + MINUTOS_EXPIRACION + " minutos.\n\n" +
                    "Si no solicitaste este cambio, ignora este correo.\n\n" +
                    "Saludos,\nEquipo Expediente Médico");
            
            mailSender.send(mensaje);
        } catch (Exception e) {
            // Log pero no falla la operación, el usuario puede reintentar
            System.err.println("Error enviando email: " + e.getMessage());
        }
    }
}
