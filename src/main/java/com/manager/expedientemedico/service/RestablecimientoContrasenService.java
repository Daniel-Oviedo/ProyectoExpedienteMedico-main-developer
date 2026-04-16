package com.manager.expedientemedico.service;

import com.manager.expedientemedico.dto.restablecimiento.*;
import com.manager.expedientemedico.exception.OperacionNoPermitidaException;
import com.manager.expedientemedico.model.TokenRestablecimientoContrasena;
import com.manager.expedientemedico.model.Usuario;
import com.manager.expedientemedico.repository.TokenRestablecimientoRepository;
import com.manager.expedientemedico.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
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

        // Enviar email de forma asincrónica con SendGrid
        enviarEmailCodigo(usuario, codigo);

        // Devolver el código en la respuesta para mostrar en pantalla
        return new RespuestaRestablecimientoDTO(true, "Código generado. Se envió a tu correo. Usa el código a continuación:", codigo);
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

    // Enviar email usando SendGrid API de forma asincrónica
    @Async
    public void enviarEmailCodigo(Usuario usuario, String codigo) {
        String apiKey = System.getenv("SENDGRID_API_KEY");
        String fromEmail = System.getenv("SENDGRID_FROM_EMAIL");
        
        if (apiKey == null || fromEmail == null) {
            System.err.println("SENDGRID_API_KEY o SENDGRID_FROM_EMAIL no están configurados");
            return;
        }
        
        try {
            String requestBody = String.format("""
                {
                  "personalizations": [{
                    "to": [{"email": "%s"}]
                  }],
                  "from": {"email": "%s", "name": "Expediente Médico"},
                  "subject": "Código de recuperación de contraseña",
                  "content": [{
                    "type": "text/html",
                    "value": "<h2>Recuperación de Contraseña</h2><p>Hola %s,</p><p>Tu código de recuperación es:</p><h1 style='color: #0052a3; font-size: 32px; letter-spacing: 4px;'>%s</h1><p>Este código expira en 15 minutos.</p><p>Si no solicitaste este cambio, ignora este correo.</p><p>Saludos,<br>Equipo Expediente Médico</p>"
                  }]
                }
                """, usuario.getEmail(), fromEmail, usuario.getNombre(), codigo);
            
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.sendgrid.com/v3/mail/send"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();
            
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 202) {
                System.out.println("Email enviado exitosamente a: " + usuario.getEmail());
            } else {
                System.err.println("Error enviando email con SendGrid. Status: " + response.statusCode() + " Body: " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Error enviando email a " + usuario.getEmail() + ": " + e.getMessage());
        }
    }
}
    

